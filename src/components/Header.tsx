"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useState, useEffect } from "react";
import { he } from "@/lib/translations";

export default function Header() {
  const { itemCount, toggleCart } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const t = he;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-sm"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 sm:h-20 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center transition-transform group-hover:scale-110">
                <span className="text-white font-bold text-sm sm:text-base">S</span>
              </div>
              <span className="font-[family-name:var(--font-display)] text-xl sm:text-2xl font-semibold tracking-tight text-warm-900">
                SnapCase
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden sm:flex items-center gap-8">
              <Link
                href="/"
                className="text-sm font-medium text-warm-800 hover:text-brand-600 transition-colors relative after:absolute after:bottom-0 after:right-0 after:h-[2px] after:w-0 after:bg-brand-500 after:transition-all hover:after:w-full"
              >
                {t.nav.home}
              </Link>
              <Link
                href="/products"
                className="text-sm font-medium text-warm-800 hover:text-brand-600 transition-colors relative after:absolute after:bottom-0 after:right-0 after:h-[2px] after:w-0 after:bg-brand-500 after:transition-all hover:after:w-full"
              >
                {t.nav.shop}
              </Link>
              <Link
                href="/products?category=beaded-charms"
                className="text-sm font-medium text-warm-800 hover:text-brand-600 transition-colors relative after:absolute after:bottom-0 after:right-0 after:h-[2px] after:w-0 after:bg-brand-500 after:transition-all hover:after:w-full"
              >
                {t.nav.collections}
              </Link>
            </nav>

            <div className="flex items-center gap-2">
              {/* Cart button */}
              <button
                onClick={toggleCart}
                className="relative p-2 text-warm-900 hover:text-brand-600 transition-colors"
                aria-label={t.nav.cart}
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -left-0.5 bg-brand-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center animate-scale-in">
                    {itemCount}
                  </span>
                )}
              </button>

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="sm:hidden p-2 text-warm-900 hover:text-brand-600 transition-colors"
                aria-label="Toggle menu"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {mobileOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="sm:hidden bg-white/95 backdrop-blur-md border-t border-warm-100 animate-fade-in">
            <nav className="px-4 py-4 space-y-3">
              <Link href="/" onClick={() => setMobileOpen(false)} className="block text-sm font-medium text-warm-800 py-2">{t.nav.home}</Link>
              <Link href="/products" onClick={() => setMobileOpen(false)} className="block text-sm font-medium text-warm-800 py-2">{t.nav.shop}</Link>
              <Link href="/products?category=beaded-charms" onClick={() => setMobileOpen(false)} className="block text-sm font-medium text-warm-800 py-2">{t.nav.collections}</Link>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
