import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { products, categories, reviews } from "@/db/schema";
import { eq, desc, sql } from "drizzle-orm";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const result = await db
    .select({
      id: products.id,
      name: products.name,
      slug: products.slug,
      description: products.description,
      details: products.details,
      price: products.price,
      compareAtPrice: products.compareAtPrice,
      images: products.images,
      tags: products.tags,
      featured: products.featured,
      inStock: products.inStock,
      stockCount: products.stockCount,
      categoryName: categories.name,
      categorySlug: categories.slug,
    })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(eq(products.slug, slug))
    .limit(1);

  if (result.length === 0) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const product = result[0];

  // Get reviews
  const productReviews = await db
    .select()
    .from(reviews)
    .where(eq(reviews.productId, product.id))
    .orderBy(desc(reviews.createdAt));

  // Get rating stats
  const ratingStats = await db
    .select({
      avgRating: sql<number>`round(avg(${reviews.rating})::numeric, 1)`,
      reviewCount: sql<number>`count(*)::int`,
    })
    .from(reviews)
    .where(eq(reviews.productId, product.id));

  // Get related products
  const related = await db
    .select({
      id: products.id,
      name: products.name,
      slug: products.slug,
      price: products.price,
      compareAtPrice: products.compareAtPrice,
      images: products.images,
      tags: products.tags,
    })
    .from(products)
    .where(sql`${products.id} != ${product.id}`)
    .orderBy(sql`random()`)
    .limit(4);

  // Get related product ratings
  const relatedIds = related.map((r) => r.id);
  let relatedRatingsMap = new Map<number, { rating: number; count: number }>();
  if (relatedIds.length > 0) {
    const relatedRatings = await db
      .select({
        productId: reviews.productId,
        avgRating: sql<number>`round(avg(${reviews.rating})::numeric, 1)`,
        reviewCount: sql<number>`count(*)::int`,
      })
      .from(reviews)
      .where(sql`${reviews.productId} = ANY(${relatedIds})`)
      .groupBy(reviews.productId);

    relatedRatingsMap = new Map(
      relatedRatings.map((r) => [r.productId, { rating: Number(r.avgRating), count: r.reviewCount }])
    );
  }

  return NextResponse.json({
    ...product,
    price: Number(product.price),
    compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
    reviews: productReviews.map((r) => ({
      ...r,
      createdAt: r.createdAt.toISOString(),
    })),
    rating: ratingStats[0]?.avgRating ? Number(ratingStats[0].avgRating) : 0,
    reviewCount: ratingStats[0]?.reviewCount || 0,
    related: related.map((r) => {
      const rr = relatedRatingsMap.get(r.id) || { rating: 0, count: 0 };
      return {
        ...r,
        price: Number(r.price),
        compareAtPrice: r.compareAtPrice ? Number(r.compareAtPrice) : null,
        image: (r.images as string[])?.[0] || "/images/product-1.jpg",
        rating: rr.rating,
        reviewCount: rr.count,
      };
    }),
  });
}
