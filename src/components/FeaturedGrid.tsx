"use client";

import ProductCard from "./ProductCard";

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

export default function FeaturedGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
      {products.map((product, i) => (
        <ProductCard
          key={product.id}
          {...product}
          index={i}
        />
      ))}
    </div>
  );
}
