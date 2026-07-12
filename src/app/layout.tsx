import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import Header from "@/components/Header";
import CartSidebar from "@/components/CartSidebar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "SnapCase — תליוני טלפון מעוצבים",
  description:
    "תליוני טלפון בעבודת יד להפוך את הטלפון שלך למיוחד. תליוני חרוזים, שרשראות, טבע ודמויות - מעוצבים באהבה.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="he" dir="rtl">
      <body className="bg-white text-warm-900 antialiased font-[family-name:var(--font-hebrew)]">
        <CartProvider>
          <Header />
          <CartSidebar />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
