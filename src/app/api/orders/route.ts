import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { orders } from "@/db/schema";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { email, name, address, city, state, zip, items, total } = body;

  if (!email || !name || !address || !city || !zip || !items || !total) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const [order] = await db
    .insert(orders)
    .values({
      email,
      name,
      address,
      city,
      state: state || "",
      zip,
      items,
      total: String(total),
      status: "confirmed",
    })
    .returning();

  return NextResponse.json({ orderId: order.id, status: "confirmed" });
}
