"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import ProductCard from "./ProductCard";
import { he } from "@/lib/translations";

interface Review {
  id: number;
  author: string;
  rating: number;
  title: string | null;
  body: string | null;
  verified: boolean | null;
  createdAt: string;
}

interface RelatedProduct {
  id: number;
  name: string;
  slug: string;
  price: number;
  compareAtPrice: number | null;
  image: string;
  tags: string[];
  rating: number;
  reviewCount: number;
}

interface ProductData {
  id: number;
  name: string;
  slug: string;
  description: string;
  details: string | null;
  price: number;
  compareAtPrice: number | null;
  images: string[];
  tags: string[];
  featured: boolean | null;
  inStock: boolean | null;
  stockCount: number | null;
  categoryName: string | null;
  categorySlug: string | null;
  reviews: Review[];
  rating: number;
  reviewCount: number;
  related: RelatedProduct[];
}

// Hebrew category names
const categoryNamesHe: Record<string, string> = {
  "Beaded Charms": "תליוני חרוזים",
  "Chain Charms": "תליוני שרשרת",
  "Nature Charms": "תליוני טבע",
  "Character Charms": "תליוני דמויות",
};

export default function ProductDetailClient({ product }: { product: ProductData }) {
  const { addItem } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [activeTab, setActiveTab] = useState<"details" | "reviews">("details");
  const [addedToCart, setAddedToCart] = useState(false);
  const t = he;

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0] || "/images/product-1.jpg",
      slug: product.slug,
      quantity,
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleSubmitReview = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId: product.id,
        author: formData.get("author"),
        rating: Number(formData.get("rating")),
        title: formData.get("title"),
        body: formData.get("body"),
      }),
    });
    setShowReviewForm(false);
    window.location.reload();
  };

  const discount = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  const categoryNameHe = product.categoryName ? (categoryNamesHe[product.categoryName] || product.categoryName) : null;

  return (
    <div className="pt-20 sm:pt-24">
      {/* Breadcrumb */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
        <nav className="text-xs text-gray-400">
          <Link href="/" className="hover:text-brand-600 transition-colors">{t.productPage.home}</Link>
          <span className="mx-2">/</span>
          <Link href="/products" className="hover:text-brand-600 transition-colors">{t.productPage.shop}</Link>
          {categoryNameHe && (
            <>
              <span className="mx-2">/</span>
              <Link href={`/products?category=${product.categorySlug}`} className="hover:text-brand-600 transition-colors">
                {categoryNameHe}
              </Link>
            </>
          )}
          <span className="mx-2">/</span>
          <span className="text-warm-900">{product.name}</span>
        </nav>
      </div>

      {/* Product section */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Image gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-warm-50">
              <Image
                src={product.images[selectedImage] || "/images/product-1.jpg"}
                alt={product.name}
                fill
                className="object-cover transition-opacity duration-300"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
              {product.compareAtPrice && (
                <span className="absolute top-4 left-4 px-3 py-1.5 bg-brand-500 text-white text-xs font-bold rounded-full">
                  −{discount}%
                </span>
              )}
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto scrollbar-hide">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden shrink-0 transition-all ${
                      selectedImage === i
                        ? "ring-2 ring-brand-500 ring-offset-2"
                        : "opacity-60 hover:opacity-100"
                    }`}
                  >
                    <Image src={img} alt="" fill className="object-cover" sizes="80px" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product info */}
          <div className="lg:py-4">
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-warm-50 text-warm-800 text-[10px] font-semibold uppercase tracking-wider rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-bold text-warm-900 mb-4">
              {product.name}
            </h1>

            {/* Rating */}
            {product.reviewCount > 0 && (
              <div className="flex items-center gap-2 mb-6">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className={`w-4 h-4 ${
                        star <= Math.round(product.rating) ? "text-amber-400" : "text-gray-200"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm text-gray-500">
                  {product.rating} ({product.reviewCount} {t.productPage.reviewsTab})
                </span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="font-[family-name:var(--font-display)] text-3xl font-bold text-warm-900">
                {t.currency.symbol}{product.price.toFixed(2)}
              </span>
              {product.compareAtPrice && (
                <>
                  <span className="text-xl text-gray-400 line-through">
                    {t.currency.symbol}{product.compareAtPrice.toFixed(2)}
                  </span>
                  <span className="text-sm font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                    {t.productPage.save} {t.currency.symbol}{(product.compareAtPrice - product.price).toFixed(2)}
                  </span>
                </>
              )}
            </div>

            <p className="text-gray-600 leading-relaxed mb-8">
              {product.description}
            </p>

            {/* Quantity & Add to cart */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="flex items-center border border-gray-200 rounded-full overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 flex items-center justify-center text-gray-500 hover:text-warm-900 hover:bg-warm-50 transition-colors"
                >
                  −
                </button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-12 h-12 flex items-center justify-center text-gray-500 hover:text-warm-900 hover:bg-warm-50 transition-colors"
                >
                  +
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className={`flex-1 py-3.5 px-8 rounded-full font-semibold text-sm transition-all duration-300 ${
                  addedToCart
                    ? "bg-green-500 text-white"
                    : product.inStock
                    ? "bg-warm-900 text-white hover:bg-brand-600 hover:shadow-lg hover:shadow-brand-500/20"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                }`}
              >
                {addedToCart ? t.productPage.addedToBag : product.inStock ? t.productPage.addToBag : t.productPage.outOfStock}
              </button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-4 py-6 border-t border-gray-100">
              <div className="text-center">
                <svg className="w-6 h-6 mx-auto text-brand-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <p className="text-[11px] text-gray-500 font-medium">{t.productPage.freeShipping}</p>
              </div>
              <div className="text-center">
                <svg className="w-6 h-6 mx-auto text-brand-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <p className="text-[11px] text-gray-500 font-medium">{t.productPage.returns}</p>
              </div>
              <div className="text-center">
                <svg className="w-6 h-6 mx-auto text-brand-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <p className="text-[11px] text-gray-500 font-medium">{t.productPage.handcrafted}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs: Details & Reviews */}
        <div className="mt-16 border-t border-gray-100 pt-12">
          <div className="flex gap-8 border-b border-gray-100 mb-8">
            <button
              onClick={() => setActiveTab("details")}
              className={`pb-4 text-sm font-semibold border-b-2 transition-colors ${
                activeTab === "details"
                  ? "border-brand-500 text-brand-600"
                  : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
            >
              {t.productPage.details}
            </button>
            <button
              onClick={() => setActiveTab("reviews")}
              className={`pb-4 text-sm font-semibold border-b-2 transition-colors ${
                activeTab === "reviews"
                  ? "border-brand-500 text-brand-600"
                  : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
            >
              {t.productPage.reviewsTab} ({product.reviewCount})
            </button>
          </div>

          {activeTab === "details" && product.details && (
            <div className="max-w-2xl animate-fade-in">
              <div className="prose prose-sm text-gray-600">
                {product.details.split("\n").map((line, i) => (
                  <p key={i} className="mb-2">{line}</p>
                ))}
              </div>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="max-w-2xl animate-fade-in">
              {/* Rating summary */}
              <div className="flex items-center gap-6 mb-8 p-6 bg-warm-50 rounded-2xl">
                <div className="text-center">
                  <p className="font-[family-name:var(--font-display)] text-4xl font-bold text-warm-900">
                    {product.rating || "—"}
                  </p>
                  <div className="flex mt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        className={`w-4 h-4 ${
                          star <= Math.round(product.rating) ? "text-amber-400" : "text-gray-200"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{product.reviewCount} {t.productPage.reviewsTab}</p>
                </div>
                <div className="flex-1">
                  <button
                    onClick={() => setShowReviewForm(!showReviewForm)}
                    className="px-6 py-2.5 bg-brand-500 text-white text-sm font-medium rounded-full hover:bg-brand-600 transition-colors"
                  >
                    {t.productPage.writeReview}
                  </button>
                </div>
              </div>

              {/* Review form */}
              {showReviewForm && (
                <form onSubmit={handleSubmitReview} className="mb-8 p-6 border border-gray-100 rounded-2xl space-y-4 animate-scale-in">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      name="author"
                      required
                      placeholder={t.productPage.yourName}
                      className="px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-400 transition-colors"
                    />
                    <select
                      name="rating"
                      required
                      className="px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-400 transition-colors"
                    >
                      <option value="">{t.productPage.rating}</option>
                      <option value="5">★★★★★ (5)</option>
                      <option value="4">★★★★ (4)</option>
                      <option value="3">★★★ (3)</option>
                      <option value="2">★★ (2)</option>
                      <option value="1">★ (1)</option>
                    </select>
                  </div>
                  <input
                    name="title"
                    placeholder={t.productPage.reviewTitle}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-400 transition-colors"
                  />
                  <textarea
                    name="body"
                    rows={3}
                    placeholder={t.productPage.writeYourReview}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-400 transition-colors resize-none"
                  />
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-warm-900 text-white text-sm font-medium rounded-full hover:bg-brand-600 transition-colors"
                    >
                      {t.productPage.submit}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowReviewForm(false)}
                      className="px-6 py-2.5 text-gray-500 text-sm font-medium hover:text-warm-900 transition-colors"
                    >
                      {t.productPage.cancel}
                    </button>
                  </div>
                </form>
              )}

              {/* Review list */}
              <div className="space-y-6">
                {product.reviews.map((review) => (
                  <div key={review.id} className="pb-6 border-b border-gray-50 last:border-0">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-full bg-brand-50 flex items-center justify-center">
                        <span className="text-brand-600 font-semibold text-xs">{review.author[0]}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-warm-900">{review.author}</span>
                          {review.verified && (
                            <span className="text-[10px] font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                              {t.productPage.verified}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <svg
                                key={star}
                                className={`w-3 h-3 ${
                                  star <= review.rating ? "text-amber-400" : "text-gray-200"
                                }`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <span className="text-[10px] text-gray-400">
                            {new Date(review.createdAt).toLocaleDateString("he-IL", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                    {review.title && (
                      <h4 className="text-sm font-semibold text-warm-900 mb-1">{review.title}</h4>
                    )}
                    {review.body && (
                      <p className="text-sm text-gray-600 leading-relaxed">{review.body}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Related products */}
        {product.related.length > 0 && (
          <div className="mt-20 border-t border-gray-100 pt-16">
            <h2 className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl font-bold text-warm-900 mb-10">
              {t.productPage.youMightLove}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {product.related.map((p, i) => (
                <ProductCard key={p.id} {...p} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
