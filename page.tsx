import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

export async function POST(request: NextRequest) {
  if (!stripeSecretKey) {
    return NextResponse.json(
      { error: "Stripe not configured. Add STRIPE_SECRET_KEY to environment variables." },
      { status: 500 }
    );
  }

  const stripe = new Stripe(stripeSecretKey);

  try {
    const body = await request.json();
    const { items, customerEmail, customerName, shippingAddress } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "No items in cart" }, { status: 400 });
    }

    // Calculate totals in agorot (ILS cents)
    const subtotal = items.reduce(
      (sum: number, item: { price: number; quantity: number }) =>
        sum + Math.round(item.price * 100) * item.quantity,
      0
    );

    // Free shipping over 150 ILS, otherwise 25 ILS
    const shippingCost = subtotal >= 15000 ? 0 : 2500;

    // Create line items for Stripe
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map(
      (item: { name: string; price: number; quantity: number; image: string }) => ({
        price_data: {
          currency: "ils",
          product_data: {
            name: item.name,
            images: item.image.startsWith("http")
              ? [item.image]
              : [`${process.env.NEXT_PUBLIC_BASE_URL || "https://snapcase.co"}${item.image}`],
          },
          unit_amount: Math.round(item.price * 100), // Convert to agorot
        },
        quantity: item.quantity,
      })
    );

    // Add shipping as a line item if not free
    if (shippingCost > 0) {
      lineItems.push({
        price_data: {
          currency: "ils",
          product_data: {
            name: "משלוח",
          },
          unit_amount: shippingCost,
        },
        quantity: 1,
      });
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${request.headers.get("origin")}/order-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.headers.get("origin")}/checkout`,
      customer_email: customerEmail,
      locale: "auto",
      metadata: {
        customerName,
        shippingAddress: JSON.stringify(shippingAddress),
        items: JSON.stringify(items.map((i: { id: number; name: string; quantity: number; price: number }) => ({
          id: i.id,
          name: i.name,
          quantity: i.quantity,
          price: i.price,
        }))),
      },
      shipping_address_collection: {
        allowed_countries: ["IL"],
      },
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error("Stripe error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Payment failed" },
      { status: 500 }
    );
  }
}
