import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { products, categories, reviews } from "@/db/schema";
import { eq, desc, asc, ilike, sql, and } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const category = searchParams.get("category");
  const sort = searchParams.get("sort") || "featured";
  const search = searchParams.get("search");
  const tag = searchParams.get("tag");

  const conditions = [];

  if (category) {
    const cat = await db
      .select({ id: categories.id })
      .from(categories)
      .where(eq(categories.slug, category))
      .limit(1);
    if (cat.length > 0) {
      conditions.push(eq(products.categoryId, cat[0].id));
    }
  }

  if (search) {
    conditions.push(ilike(products.name, `%${search}%`));
  }

  let orderBy;
  switch (sort) {
    case "price-asc":
      orderBy = asc(products.price);
      break;
    case "price-desc":
      orderBy = desc(products.price);
      break;
    case "newest":
      orderBy = desc(products.createdAt);
      break;
    case "featured":
    default:
      orderBy = desc(products.featured);
      break;
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const allProducts = await db
    .select({
      id: products.id,
      name: products.name,
      slug: products.slug,
      price: products.price,
      compareAtPrice: products.compareAtPrice,
      images: products.images,
      tags: products.tags,
      featured: products.featured,
      categoryId: products.categoryId,
      categorySlug: categories.slug,
      categoryName: categories.name,
    })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(whereClause)
    .orderBy(orderBy);

  // Get average ratings
  const ratingsData = await db
    .select({
      productId: reviews.productId,
      avgRating: sql<number>`round(avg(${reviews.rating})::numeric, 1)`,
      reviewCount: sql<number>`count(*)::int`,
    })
    .from(reviews)
    .groupBy(reviews.productId);

  const ratingsMap = new Map(
    ratingsData.map((r) => [r.productId, { rating: Number(r.avgRating), count: r.reviewCount }])
  );

  let result = allProducts.map((p) => {
    const r = ratingsMap.get(p.id) || { rating: 0, count: 0 };
    return {
      ...p,
      price: Number(p.price),
      compareAtPrice: p.compareAtPrice ? Number(p.compareAtPrice) : null,
      image: (p.images as string[])?.[0] || "/images/product-1.jpg",
      rating: r.rating,
      reviewCount: r.count,
    };
  });

  if (tag) {
    result = result.filter((p) => (p.tags as string[]).includes(tag));
  }

  return NextResponse.json(result);
}
