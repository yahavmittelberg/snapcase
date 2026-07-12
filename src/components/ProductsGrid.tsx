"use client";

import { useRouter, useSearchParams } from "next/navigation";
import ProductCard from "./ProductCard";
import { useState, useCallback } from "react";
import { he } from "@/lib/translations";

interface Product {
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

interface Category {
  id: number;
  name: string;
  slug: string;
  productCount: number;
}

interface Props {
  products: Product[];
  categories: Category[];
  currentCategory: string;
  currentSort: string;
}

// Hebrew category names
const categoryNamesHe: Record<string, string> = {
  "Beaded Charms": "תליוני חרוזים",
  "Chain Charms": "תליוני שרשרת",
  "Nature Charms": "תליוני טבע",
  "Character Charms": "תליוני דמויות",
};

export default function ProductsGrid({ products, categories, currentCategory, currentSort }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const t = he;

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.push(`/products?${params.toString()}`);
    },
    [router, searchParams]
  );

  const sortOptions = [
    { value: "featured", label: t.productsPage.featured },
    { value: "newest", label: t.productsPage.newest },
    { value: "price-asc", label: t.productsPage.priceLowHigh },
    { value: "price-desc", label: t.productsPage.priceHighLow },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-10">
      {/* Mobile filter toggle */}
      <button
        onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
        className="lg:hidden flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-warm-900 hover:border-brand-300 transition-colors self-start"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        {t.productsPage.filtersSort}
      </button>

      {/* Sidebar */}
      <aside className={`lg:w-56 shrink-0 space-y-8 ${mobileFiltersOpen ? "block" : "hidden lg:block"}`}>
        {/* Categories */}
        <div>
          <h3 className="text-sm font-semibold text-warm-900 mb-4 uppercase tracking-wider">
            {t.productsPage.category}
          </h3>
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => updateParam("category", "")}
                className={`text-sm w-full text-right py-1.5 transition-colors ${
                  !currentCategory
                    ? "text-brand-600 font-semibold"
                    : "text-gray-500 hover:text-warm-900"
                }`}
              >
                {t.productsPage.allCharms}
              </button>
            </li>
            {categories.map((cat) => (
              <li key={cat.id}>
                <button
                  onClick={() => updateParam("category", cat.slug)}
                  className={`text-sm w-full text-right py-1.5 flex justify-between transition-colors ${
                    currentCategory === cat.slug
                      ? "text-brand-600 font-semibold"
                      : "text-gray-500 hover:text-warm-900"
                  }`}
                >
                  {categoryNamesHe[cat.name] || cat.name}
                  <span className="text-gray-300 text-xs">({cat.productCount})</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Sort */}
        <div>
          <h3 className="text-sm font-semibold text-warm-900 mb-4 uppercase tracking-wider">
            {t.productsPage.sortBy}
          </h3>
          <ul className="space-y-2">
            {sortOptions.map((opt) => (
              <li key={opt.value}>
                <button
                  onClick={() => updateParam("sort", opt.value)}
                  className={`text-sm w-full text-right py-1.5 transition-colors ${
                    currentSort === opt.value
                      ? "text-brand-600 font-semibold"
                      : "text-gray-500 hover:text-warm-900"
                  }`}
                >
                  {opt.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Product grid */}
      <div className="flex-1">
        {products.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-full bg-warm-50 flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-lg text-gray-500 mb-2">{t.productsPage.noProducts}</h3>
            <p className="text-sm text-gray-400">{t.productsPage.adjustFilters}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
            {products.map((product, i) => (
              <ProductCard key={product.id} {...product} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
