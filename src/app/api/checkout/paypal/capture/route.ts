import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { orders } from "@/db/schema";

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_SECRET = process.env.PAYPAL_SECRET;
const PAYPAL_API = process.env.NODE_ENV === "production" 
  ? "https://api-m.paypal.com" 
  : "https://api-m.sandbox.paypal.com";

async function getAccessToken() {
  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`).toString("base64");
  
  const response = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      "Authorization": `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  
  const data = await response.json();
  return data.access_token;
}

export async function POST(request: NextRequest) {
  if (!PAYPAL_CLIENT_ID || !PAYPAL_SECRET) {
    return NextResponse.json({ error: "PayPal not configured" }, { status: 500 });
  }

  try {
    const { orderId, orderDetails } = await request.json();

    const accessToken = await getAccessToken();

    // Capture the payment
    const captureResponse = await fetch(`${PAYPAL_API}/v2/checkout/orders/${orderId}/capture`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    const captureData = await captureResponse.json();

    if (captureData.status === "COMPLETED") {
      // Save order to database
      const payer = captureData.payer;
      const shipping = captureData.purchase_units?.[0]?.shipping;
      const amount = captureData.purchase_units?.[0]?.payments?.captures?.[0]?.amount;

      const [order] = await db
        .insert(orders)
        .values({
          email: payer?.email_address || orderDetails?.email || "",
          name: shipping?.name?.full_name || orderDetails?.name || "",
          address: shipping?.address?.address_line_1 || orderDetails?.address || "",
          city: shipping?.address?.admin_area_2 || orderDetails?.city || "",
          state: shipping?.address?.admin_area_1 || "",
          zip: shipping?.address?.postal_code || orderDetails?.zip || "",
          items: orderDetails?.items || [],
          total: amount?.value || "0",
          status: "paid",
        })
        .returning();

      console.log(`✅ PayPal Order ${order.id} completed`);

      // ==============================================
      // 🚚 AUTO-ORDER FROM SUPPLIER (DROPSHIPPING)
      // ==============================================
      // כאן מוסיפים חיבור לספק כמו:
      // - AliExpress API
      // - CJDropshipping  
      // - ספק ישראלי עם API
      //
      // Example:
      // await orderFromSupplier({
      //   shippingAddress: { ... },
      //   items: orderDetails.items.map(i => ({
      //     sku: i.supplierSku,
      //     quantity: i.quantity,
      //   })),
      // });
      // ==============================================

      return NextResponse.json({ 
        success: true, 
        orderId: order.id,
        paypalOrderId: orderId,
      });
    } else {
      return NextResponse.json({ 
        error: "Payment not completed",
        status: captureData.status,
      }, { status: 400 });
    }
  } catch (error) {
    console.error("Capture error:", error);
    return NextResponse.json({ error: "Failed to capture payment" }, { status: 500 });
  }
}
