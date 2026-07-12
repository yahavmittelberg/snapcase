"use client";

import { useCart } from "@/context/CartContext";
import Image from "next/image";
import Link from "next/link";
import { he } from "@/lib/translations";

export default function CartSidebar() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, subtotal, itemCount } = useCart();
  const t = he;

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-[60] animate-fade-in"
        onClick={closeCart}
      />

      {/* Sidebar - slides from left in RTL */}
      <div className="fixed left-0 top-0 bottom-0 w-full max-w-md bg-white z-[70] shadow-2xl animate-slide-in-left flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-warm-900">
            {t.cart.yourBag} ({itemCount})
          </h2>
          <button
            onClick={closeCart}
            className="p-2 -ml-2 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close cart"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items */}
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
            <div className="w-20 h-20 rounded-full bg-warm-50 flex items-center justify-center mb-4">
              <svg className="w-10 h-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <p className="font-[family-name:var(--font-display)] text-lg text-gray-500 mb-2">
              {t.cart.empty}
            </p>
            <p className="text-sm text-gray-400 mb-6">
              {t.cart.emptySubtitle}
            </p>
            <Link
              href="/products"
              onClick={closeCart}
              className="inline-flex items-center px-6 py-3 bg-brand-500 text-white text-sm font-medium rounded-full hover:bg-brand-600 transition-colors"
            >
              {t.cart.startShopping}
            </Link>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto scrollbar-hide px-6 py-4 space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 py-4 border-b border-gray-50 last:border-0 animate-fade-in"
              >
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-warm-50 shrink-0 relative">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/products/${item.slug}`}
                    onClick={closeCart}
                    className="text-sm font-medium text-warm-900 hover:text-brand-600 transition-colors line-clamp-2"
                  >
                    {item.name}
                  </Link>
                  <p className="text-sm font-semibold text-brand-600 mt-1">
                    {t.currency.symbol}{item.price.toFixed(2)}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-brand-300 hover:text-brand-600 transition-colors text-sm"
                    >
                      −
                    </button>
                    <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-brand-300 hover:text-brand-600 transition-colors text-sm"
                    >
                      +
                    </button>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="mr-auto text-gray-300 hover:text-red-400 transition-colors"
                      aria-label="Remove item"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-100 px-6 py-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">
                {t.cart.subtotal}
              </span>
              <span className="font-[family-name:var(--font-display)] text-lg font-semibold text-warm-900">
                {t.currency.symbol}{subtotal.toFixed(2)}
              </span>
            </div>
            <p className="text-xs text-gray-400 text-center">
              {t.cart.shippingNote}
            </p>
            <Link
              href="/checkout"
              onClick={closeCart}
              className="block w-full py-3.5 bg-warm-900 text-white text-sm font-semibold rounded-full text-center hover:bg-brand-600 transition-colors"
            >
              {t.cart.checkout} — {t.currency.symbol}{subtotal.toFixed(2)}
            </Link>
            <button
              onClick={closeCart}
              className="block w-full text-center text-sm text-gray-500 hover:text-brand-600 transition-colors"
            >
              {t.cart.continueShopping}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
