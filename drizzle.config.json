"use client";

import Link from "next/link";
import { useEffect, Suspense } from "react";
import { useCart } from "@/context/CartContext";
import { useSearchParams } from "next/navigation";
import { he } from "@/lib/translations";

function OrderSuccessContent() {
  const { clearCart } = useCart();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const t = he;

  useEffect(() => {
    // Clear cart on successful order
    if (sessionId) {
      clearCart();
    }
  }, [sessionId, clearCart]);

  return (
    <div className="pt-28 sm:pt-32 pb-20 min-h-screen flex items-center justify-center">
      <div className="max-w-md mx-auto text-center px-4 animate-fade-in-up">
        <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold text-warm-900 mb-3">
          {t.checkout.orderConfirmed}
        </h1>
        {sessionId && (
          <p className="text-gray-500 mb-2">
            {t.checkout.orderNumber}: {sessionId.slice(-8).toUpperCase()}
          </p>
        )}
        <p className="text-gray-500 mb-8">
          {t.checkout.thankYou}
        </p>
        <Link
          href="/products"
          className="inline-flex items-center px-8 py-3.5 bg-brand-500 text-white font-semibold rounded-full hover:bg-brand-600 transition-colors text-sm"
        >
          {t.checkout.continueShop}
        </Link>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="pt-28 sm:pt-32 pb-20 min-h-screen flex items-center justify-center">
      <div className="animate-pulse flex flex-col items-center">
        <div className="w-20 h-20 rounded-full bg-gray-200 mb-6"></div>
        <div className="h-8 bg-gray-200 rounded w-48 mb-3"></div>
        <div className="h-4 bg-gray-200 rounded w-32"></div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <OrderSuccessContent />
    </Suspense>
  );
}
