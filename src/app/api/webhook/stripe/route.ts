import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "@/db";
import { orders } from "@/db/schema";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request: NextRequest) {
  if (!stripeSecretKey) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });
  }

  const stripe = new Stripe(stripeSecretKey);
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  let event: Stripe.Event;

  try {
    if (webhookSecret && signature) {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } else {
      // For testing without webhook signature verification
      event = JSON.parse(body) as Stripe.Event;
    }
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    try {
      // Extract order data from session
      const customerEmail = session.customer_email || session.customer_details?.email || "";
      const customerName = session.metadata?.customerName || session.customer_details?.name || "";
      const sessionWithShipping = session as Stripe.Checkout.Session & { 
        shipping_details?: { address?: Stripe.Address } 
      };
      const shippingAddress = sessionWithShipping.shipping_details?.address || 
        (session.metadata?.shippingAddress ? JSON.parse(session.metadata.shippingAddress) : {});
      const items = session.metadata?.items ? JSON.parse(session.metadata.items) : [];

      // Save order to database
      const [order] = await db
        .insert(orders)
        .values({
          email: customerEmail,
          name: customerName,
          address: `${shippingAddress.line1 || ""} ${shippingAddress.line2 || ""}`.trim(),
          city: shippingAddress.city || "",
          state: shippingAddress.state || "",
          zip: shippingAddress.postal_code || "",
          items: items,
          total: String((session.amount_total || 0) / 100),
          status: "paid",
        })
        .returning();

      console.log(`✅ Order ${order.id} created for ${customerEmail}`);

      // ==============================================
      // 🚚 AUTO-ORDER FROM SUPPLIER (DROPSHIPPING)
      // ==============================================
      // Uncomment and configure when you have a supplier API:
      //
      // Example with CJDropshipping API:
      // await fetch("https://cjdropshipping.com/api/v1/orders", {
      //   method: "POST",
      //   headers: {
      //     "Authorization": `Bearer ${process.env.CJ_API_KEY}`,
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     shippingAddress: {
      //       name: customerName,
      //       address: shippingAddress.line1,
      //       city: shippingAddress.city,
      //       country: "IL",
      //       zip: shippingAddress.postal_code,
      //       phone: session.customer_details?.phone,
      //     },
      //     products: items.map(i => ({
      //       sku: i.supplierSku, // You'd store this in your products table
      //       quantity: i.quantity,
      //     })),
      //   }),
      // });
      //
      // ==============================================

      // Send confirmation email (add Resend/SendGrid later)
      // await sendOrderConfirmationEmail(customerEmail, order);

    } catch (err) {
      console.error("Error processing order:", err);
    }
  }

  return NextResponse.json({ received: true });
}
