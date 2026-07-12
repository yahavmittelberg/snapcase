import { NextRequest, NextResponse } from "next/server";

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
    return NextResponse.json(
      { error: "PayPal not configured. Add PAYPAL_CLIENT_ID and PAYPAL_SECRET to environment." },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const { items, customerEmail, customerName, shippingAddress } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "No items in cart" }, { status: 400 });
    }

    // Calculate totals in ILS
    const subtotal = items.reduce(
      (sum: number, item: { price: number; quantity: number }) =>
        sum + item.price * item.quantity,
      0
    );

    // Free shipping over 150 ILS, otherwise 25 ILS
    const shipping = subtotal >= 150 ? 0 : 25;
    const total = subtotal + shipping;

    const accessToken = await getAccessToken();

    // Create PayPal order
    const orderResponse = await fetch(`${PAYPAL_API}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [{
          amount: {
            currency_code: "ILS",
            value: total.toFixed(2),
            breakdown: {
              item_total: { currency_code: "ILS", value: subtotal.toFixed(2) },
              shipping: { currency_code: "ILS", value: shipping.toFixed(2) },
            },
          },
          items: items.map((item: { name: string; price: number; quantity: number }) => ({
            name: item.name,
            quantity: String(item.quantity),
            unit_amount: { currency_code: "ILS", value: item.price.toFixed(2) },
          })),
          shipping: shippingAddress ? {
            name: { full_name: customerName },
            address: {
              address_line_1: shippingAddress.line1,
              admin_area_2: shippingAddress.city,
              postal_code: shippingAddress.postal_code,
              country_code: "IL",
            },
          } : undefined,
        }],
        payment_source: {
          paypal: {
            experience_context: {
              brand_name: "SnapCase",
              locale: "he-IL",
              landing_page: "LOGIN",
              user_action: "PAY_NOW",
              return_url: `${request.headers.get("origin")}/order-success?method=paypal`,
              cancel_url: `${request.headers.get("origin")}/checkout`,
            },
          },
        },
        application_context: {
          shipping_preference: "SET_PROVIDED_ADDRESS",
        },
      }),
    });

    const orderData = await orderResponse.json();

    if (orderData.id) {
      // Find the approval link
      const approvalLink = orderData.links?.find((link: { rel: string }) => link.rel === "payer-action")?.href;
      
      return NextResponse.json({ 
        orderId: orderData.id, 
        approvalUrl: approvalLink,
      });
    } else {
      console.error("PayPal error:", orderData);
      return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
    }
  } catch (error) {
    console.error("PayPal error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Payment failed" },
      { status: 500 }
    );
  }
}
