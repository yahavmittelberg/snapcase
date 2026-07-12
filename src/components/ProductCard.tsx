"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { he } from "@/lib/translations";

interface ProductCardProps {
  id: number;
  name: string;
  slug: string;
  price: number;
  compareAtPrice?: number | null;
  image: string;
  tags: string[];
  rating: number;
  reviewCount: number;
  index?: number;
}

export default function ProductCard({
  id,
  name,
  slug,
  price,
  compareAtPrice,
  image,
  tags,
  rating,
  reviewCount,
  index = 0,
}: ProductCardProps) {
  const { addItem } = useCart();
  const t = he;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({ id, name, price, image, slug });
  };

  const delay = Math.min(index * 100, 400);

  return (
    <div
      className="group opacity-0 animate-fade-in-up"
      style={{ animationDelay: `${delay}ms`, animationFillMode: "forwards" }}
    >
      <Link href={`/products/${slug}`} className="block">
        <div className="relative aspect-square rounded-2xl overflow-hidden bg-warm-50 mb-4">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />

          {/* Badge */}
          {tags.includes("bestseller") && (
            <span className="absolute top-3 right-3 px-3 py-1 bg-brand-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-full">
              {t.product.bestseller}
            </span>
          )}
          {compareAtPrice && (
            <span className="absolute top-3 left-3 px-3 py-1 bg-warm-900 text-white text-[10px] font-bold uppercase tracking-wider rounded-full">
              {t.product.sale}
            </span>
          )}

          {/* Quick add */}
          <button
            onClick={handleAddToCart}
            className="absolute bottom-3 left-3 right-3 py-2.5 bg-white/95 backdrop-blur-sm text-warm-900 text-sm font-semibold rounded-xl opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-brand-500 hover:text-white"
          >
            {t.product.addToBag}
          </button>
        </div>

        <div className="px-1">
          <h3 className="font-medium text-base text-warm-900 mb-1 group-hover:text-brand-600 transition-colors">
            {name}
          </h3>

          {/* Stars */}
          {reviewCount > 0 && (
            <div className="flex items-center gap-1.5 mb-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className={`w-3.5 h-3.5 ${
                      star <= Math.round(rating) ? "text-amber-400" : "text-gray-200"
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-xs text-gray-400">({reviewCount})</span>
            </div>
          )}

          <div className="flex items-center gap-2">
            <span className="text-base font-semibold text-warm-900">
              {t.currency.symbol}{price.toFixed(2)}
            </span>
            {compareAtPrice && (
              <span className="text-sm text-gray-400 line-through">
                {t.currency.symbol}{compareAtPrice.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
