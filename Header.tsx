import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { reviews } from "@/db/schema";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { productId, author, rating, title, body: reviewBody } = body;

  if (!productId || !author || !rating) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const [review] = await db
    .insert(reviews)
    .values({
      productId,
      author,
      rating: Math.min(5, Math.max(1, rating)),
      title: title || null,
      body: reviewBody || null,
      verified: false,
    })
    .returning();

  return NextResponse.json({ id: review.id, createdAt: review.createdAt.toISOString() });
}
