import Image from "next/image";
import Link from "next/link";
import { db } from "@/db";
import { products, categories, reviews } from "@/db/schema";
import { eq, desc, sql } from "drizzle-orm";
import FeaturedGrid from "@/components/FeaturedGrid";
import { he } from "@/lib/translations";

async function getFeaturedProducts() {
  const featured = await db
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
    .where(eq(products.featured, true))
    .orderBy(desc(products.createdAt))
    .limit(8);

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

  return featured.map((p) => {
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
}

async function getCategories() {
  return db
    .select({
      id: categories.id,
      name: categories.name,
      slug: categories.slug,
      description: categories.description,
      image: categories.image,
      productCount: sql<number>`count(${products.id})::int`,
    })
    .from(categories)
    .leftJoin(products, eq(products.categoryId, categories.id))
    .groupBy(categories.id)
    .orderBy(categories.name);
}

// Hebrew category names
const categoryNamesHe: Record<string, string> = {
  "Beaded Charms": "תליוני חרוזים",
  "Chain Charms": "תליוני שרשרת",
  "Nature Charms": "תליוני טבע",
  "Character Charms": "תליוני דמויות",
};

export default async function HomePage() {
  const [featuredProducts, allCategories] = await Promise.all([
    getFeaturedProducts(),
    getCategories(),
  ]);
  const t = he;

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/hero.jpg"
            alt="SnapCase phone charms"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-warm-900/80 via-warm-900/50 to-transparent" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-32">
          <div className="max-w-xl">
            <span className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-sm text-white/90 text-xs font-medium rounded-full mb-6 tracking-wider animate-fade-in-up">
              {t.hero.badge}
            </span>
            <h1 className="font-[family-name:var(--font-display)] text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] mb-6 animate-fade-in-up animation-delay-100"
                style={{ animationFillMode: "backwards" }}>
              {t.hero.title} <br />
              <span className="text-brand-300">{t.hero.titleHighlight}</span> {t.hero.titleEnd}
            </h1>
            <p className="text-base sm:text-lg text-white/80 leading-relaxed mb-8 max-w-md animate-fade-in-up animation-delay-200"
               style={{ animationFillMode: "backwards" }}>
              {t.hero.subtitle}
            </p>
            <div className="flex flex-wrap gap-4 animate-fade-in-up animation-delay-300" style={{ animationFillMode: "backwards" }}>
              <Link
                href="/products"
                className="inline-flex items-center px-8 py-4 bg-white text-warm-900 font-semibold rounded-full hover:bg-brand-50 transition-all duration-300 hover:shadow-xl hover:shadow-brand-500/20 text-sm"
              >
                {t.hero.shopNow}
                <svg className="w-4 h-4 mr-2 flip-rtl" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                </svg>
              </Link>
              <Link
                href="/products?category=beaded-charms"
                className="inline-flex items-center px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-full hover:bg-white/10 transition-all duration-300 text-sm"
              >
                {t.hero.browseCollections}
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex items-center gap-6 mt-12 animate-fade-in-up animation-delay-400" style={{ animationFillMode: "backwards" }}>
              <div className="flex items-center gap-2 text-white/60">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" /></svg>
                <span className="text-xs">{t.hero.freeShipping}</span>
              </div>
              <div className="flex items-center gap-2 text-white/60">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                <span className="text-xs">{t.hero.handcrafted}</span>
              </div>
              <div className="flex items-center gap-2 text-white/60">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                <span className="text-xs">{t.hero.returns}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Collections */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-brand-500 text-xs font-semibold tracking-widest uppercase">
              {t.collections.badge}
            </span>
            <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-bold text-warm-900 mt-3">
              {t.collections.title}
            </h2>
            <p className="text-gray-500 mt-3 max-w-lg mx-auto">
              {t.collections.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {allCategories.map((cat) => (
              <Link
                key={cat.id}
                href={`/products?category=${cat.slug}`}
                className="group relative aspect-[4/5] rounded-2xl overflow-hidden"
              >
                <Image
                  src={cat.image || "/images/collection-1.jpg"}
                  alt={cat.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="font-[family-name:var(--font-display)] text-xl font-semibold text-white mb-1">
                    {categoryNamesHe[cat.name] || cat.name}
                  </h3>
                  <p className="text-white/70 text-sm mb-3">{cat.productCount} {t.collections.products}</p>
                  <span className="inline-flex items-center text-white text-xs font-medium opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    {t.collections.shopNow}
                    <svg className="w-3 h-3 mr-1 flip-rtl" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                    </svg>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured products */}
      <section className="py-20 sm:py-28 bg-warm-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-14">
            <div>
              <span className="text-brand-500 text-xs font-semibold tracking-widest uppercase">
                {t.featured.badge}
              </span>
              <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-bold text-warm-900 mt-3">
                {t.featured.title}
              </h2>
            </div>
            <Link
              href="/products"
              className="inline-flex items-center text-sm font-medium text-brand-600 hover:text-brand-700 transition-colors self-start sm:self-auto"
            >
              {t.featured.viewAll}
              <svg className="w-4 h-4 mr-1 flip-rtl" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
              </svg>
            </Link>
          </div>

          <FeaturedGrid products={featuredProducts} />
        </div>
      </section>

      {/* Social proof */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-brand-500 text-xs font-semibold tracking-widest uppercase">
              {t.reviews.badge}
            </span>
            <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-bold text-warm-900 mt-3">
              {t.reviews.title}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "שרה מ.", text: "אני פשוט לא יכולה לדמיין את הטלפון שלי בלי התליון של SnapCase. זה גורם לי לחייך כל פעם שאני מרימה את הטלפון. שווה כל שקל!", rating: 5 },
              { name: "יעל ל.", text: "קניתי את זה לחברה הכי טובה שלי והיא התאהבה. כבר הזמנתי עוד שניים לעצמי. גם האריזה הייתה יפהפייה!", rating: 5 },
              { name: "מיה כ.", text: "חיפשתי תליון טלפון שלא נראה זול וזה בדיוק זה. איכות פרימיום, צבעים יפים, וחיבור סופר חזק.", rating: 5 },
            ].map((review, i) => (
              <div key={i} className="bg-warm-50 rounded-2xl p-8 relative">
                <div className="flex mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-warm-800 text-sm leading-relaxed mb-6 italic">
                  &ldquo;{review.text}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center">
                    <span className="text-brand-600 font-semibold text-sm">{review.name[0]}</span>
                  </div>
                  <div>
                    <p className="font-medium text-sm text-warm-900">{review.name}</p>
                    <p className="text-xs text-gray-400">{t.reviews.verifiedBuyer}</p>
                  </div>
                </div>
                {/* Decorative quote */}
                <div className="absolute top-6 left-8 text-brand-100 text-6xl font-serif leading-none">&ldquo;</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 sm:py-28 bg-gradient-to-br from-brand-500 to-brand-700 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-40 h-40 rounded-full bg-white" />
          <div className="absolute bottom-10 left-10 w-60 h-60 rounded-full bg-white" />
          <div className="absolute top-1/2 left-1/2 w-32 h-32 rounded-full bg-white" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            {t.cta.title}
          </h2>
          <p className="text-white/80 text-lg mb-8 max-w-md mx-auto">
            {t.cta.subtitle}
          </p>
          <Link
            href="/products"
            className="inline-flex items-center px-10 py-4 bg-white text-brand-600 font-semibold rounded-full hover:bg-warm-50 transition-all duration-300 hover:shadow-xl text-sm"
          >
            {t.cta.button}
            <svg className="w-4 h-4 mr-2 flip-rtl" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
            </svg>
          </Link>
        </div>
      </section>
    </>
  );
}
