import { db } from "@/db";
import { products, categories, reviews } from "@/db/schema";
import { eq, desc, asc, ilike, sql, and } from "drizzle-orm";
import ProductsGrid from "@/components/ProductsGrid";
import { he } from "@/lib/translations";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

// Hebrew category names
const categoryNamesHe: Record<string, string> = {
  "Beaded Charms": "תליוני חרוזים",
  "Chain Charms": "תליוני שרשרת",
  "Nature Charms": "תליוני טבע",
  "Character Charms": "תליוני דמויות",
};

export default async function ProductsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const categorySlug = params.category;
  const sort = params.sort || "featured";
  const search = params.search;
  const t = he;

  const conditions = [];
  let categoryName = t.productsPage.allCharms;

  if (categorySlug) {
    const cat = await db
      .select({ id: categories.id, name: categories.name })
      .from(categories)
      .where(eq(categories.slug, categorySlug))
      .limit(1);
    if (cat.length > 0) {
      conditions.push(eq(products.categoryId, cat[0].id));
      categoryName = categoryNamesHe[cat[0].name] || cat[0].name;
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
    })
    .from(products)
    .where(whereClause)
    .orderBy(orderBy);

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

  const productList = allProducts.map((p) => {
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

  const allCategories = await db
    .select({
      id: categories.id,
      name: categories.name,
      slug: categories.slug,
      productCount: sql<number>`count(${products.id})::int`,
    })
    .from(categories)
    .leftJoin(products, eq(products.categoryId, categories.id))
    .groupBy(categories.id)
    .orderBy(categories.name);

  return (
    <div className="pt-20 sm:pt-24">
      {/* Page header */}
      <div className="bg-warm-50 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav className="text-xs text-gray-400 mb-4">
            <a href="/" className="hover:text-brand-600 transition-colors">{t.productPage.home}</a>
            <span className="mx-2">/</span>
            <span className="text-warm-900">{categoryName}</span>
          </nav>
          <h1 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-bold text-warm-900">
            {search ? `תוצאות עבור "${search}"` : categoryName}
          </h1>
          <p className="text-gray-500 mt-2">
            {productList.length} {productList.length === 1 ? t.productsPage.product : t.productsPage.products}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <ProductsGrid
          products={productList}
          categories={allCategories}
          currentCategory={categorySlug || ""}
          currentSort={sort}
        />
      </div>
    </div>
  );
}
