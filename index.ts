"use client";

import { useCart } from "@/context/CartContext";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { he } from "@/lib/translations";

type PaymentMethod = "paypal" | "bit" | "demo";

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("paypal");
  const [orderComplete, setOrderComplete] = useState<number | null>(null);
  const t = he;

  const shipping = subtotal >= 150 ? 0 : 25;
  const tax = subtotal * 0.17; // VAT
  const total = subtotal + shipping + tax;

  const handleCheckout = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const orderDetails = {
      email: formData.get("email") as string,
      name: formData.get("name") as string,
      phone: formData.get("phone") as string,
      address: formData.get("address") as string,
      city: formData.get("city") as string,
      zip: formData.get("zip") as string,
      items: items.map((i) => ({
        id: i.id,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
        image: i.image,
      })),
    };

    try {
      if (paymentMethod === "paypal") {
        const res = await fetch("/api/checkout/paypal", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: orderDetails.items,
            customerEmail: orderDetails.email,
            customerName: orderDetails.name,
            shippingAddress: {
              line1: orderDetails.address,
              city: orderDetails.city,
              postal_code: orderDetails.zip,
            },
          }),
        });

        const data = await res.json();

        if (data.approvalUrl) {
          // Store order details for after return
          sessionStorage.setItem("pendingOrder", JSON.stringify(orderDetails));
          // Redirect to PayPal
          window.location.href = data.approvalUrl;
        } else if (data.error) {
          setError(data.error);
        }
      } else if (paymentMethod === "demo") {
        // Demo mode - just create the order
        const res = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...orderDetails,
            total: total.toFixed(2),
          }),
        });

        if (res.ok) {
          const data = await res.json();
          setOrderComplete(data.orderId);
          clearCart();
        } else {
          throw new Error("Order failed");
        }
      } else if (paymentMethod === "bit") {
        // Bit payment - would redirect to PayPlus/Tranzila
        setError("תשלום ב-Bit יהיה זמין בקרוב! בינתיים אפשר לשלם ב-PayPal או Demo.");
      }
    } catch (err) {
      setError("משהו השתבש. אנא נסו שוב.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (orderComplete) {
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
          <p className="text-gray-500 mb-2">
            {t.checkout.orderNumber}: #{orderComplete.toString().padStart(5, "0")}
          </p>
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

  if (items.length === 0) {
    return (
      <div className="pt-28 sm:pt-32 pb-20 min-h-screen flex items-center justify-center">
        <div className="max-w-md mx-auto text-center px-4">
          <div className="w-20 h-20 rounded-full bg-warm-50 flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-warm-900 mb-3">
            {t.cart.empty}
          </h1>
          <p className="text-gray-500 mb-8">{t.cart.emptySubtitle}</p>
          <Link
            href="/products"
            className="inline-flex items-center px-8 py-3.5 bg-brand-500 text-white font-semibold rounded-full hover:bg-brand-600 transition-colors text-sm"
          >
            {t.cart.startShopping}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 sm:pt-28 pb-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h1 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-bold text-warm-900 mb-10">
          {t.checkout.title}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Form */}
          <div className="lg:col-span-3">
            <form onSubmit={handleCheckout} className="space-y-8">
              {/* Contact */}
              <div>
                <h2 className="font-semibold text-lg text-warm-900 mb-4">
                  {t.checkout.contact}
                </h2>
                <div className="space-y-4">
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder={t.checkout.email}
                    className="w-full px-4 py-3.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-400 transition-all"
                  />
                  <input
                    name="name"
                    required
                    placeholder={t.checkout.fullName}
                    className="w-full px-4 py-3.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-400 transition-all"
                  />
                  <input
                    name="phone"
                    type="tel"
                    placeholder={t.checkout.phone}
                    className="w-full px-4 py-3.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-400 transition-all"
                  />
                </div>
              </div>

              {/* Shipping */}
              <div>
                <h2 className="font-semibold text-lg text-warm-900 mb-4">
                  {t.checkout.shipping}
                </h2>
                <div className="space-y-4">
                  <input
                    name="address"
                    required
                    placeholder={t.checkout.address}
                    className="w-full px-4 py-3.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-400 transition-all"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      name="city"
                      required
                      placeholder={t.checkout.city}
                      className="w-full px-4 py-3.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-400 transition-all"
                    />
                    <input
                      name="zip"
                      required
                      placeholder={t.checkout.zip}
                      className="w-full px-4 py-3.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-400 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method Selection */}
              <div>
                <h2 className="font-semibold text-lg text-warm-900 mb-4">
                  {t.checkout.payment}
                </h2>
                <div className="space-y-3">
                  {/* PayPal */}
                  <label 
                    className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-all ${
                      paymentMethod === "paypal" 
                        ? "border-brand-500 bg-brand-50" 
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="paypal"
                      checked={paymentMethod === "paypal"}
                      onChange={() => setPaymentMethod("paypal")}
                      className="w-4 h-4 text-brand-500"
                    />
                    <div className="flex items-center gap-3 flex-1">
                      <svg className="w-8 h-6" viewBox="0 0 101 32" fill="none">
                        <path d="M12.166 4.94h6.328c3.073 0 5.368 1.015 5.98 4.09.664 3.34-.804 5.635-3.877 6.484l-.169.046c.142.044.28.095.413.154 1.573.7 2.325 2.112 2.04 4.275-.352 2.683-2.257 4.716-5.742 4.716H8.29L12.166 4.94zm5.234 6.877c.766 0 1.46-.523 1.603-1.31.16-.88-.336-1.31-1.145-1.31h-1.483l-.458 2.62h1.483zm-.91 6.613c.809 0 1.506-.523 1.663-1.394.175-.97-.248-1.393-1.057-1.393h-1.72l-.506 2.787h1.62z" fill="#003087"/>
                        <path d="M27.65 24.707h-4.78l2.925-16.783h4.78L27.65 24.707z" fill="#003087"/>
                        <path d="M43.06 7.924h4.78l-2.925 16.783h-4.78l.216-1.235c-1.072.993-2.476 1.576-4.112 1.576-3.517 0-5.38-2.683-4.614-6.44.766-3.757 3.882-6.44 7.4-6.44 1.593 0 2.854.523 3.647 1.473l.388-5.717zm-4.325 12.615c1.506 0 2.786-1.138 3.05-2.62.263-1.483-.628-2.62-2.134-2.62-1.506 0-2.786 1.137-3.05 2.62-.263 1.482.628 2.62 2.134 2.62z" fill="#003087"/>
                        <path d="M49.17 24.707l2.925-16.783h4.614l-.216 1.235c1.072-.993 2.476-1.576 4.112-1.576 3.517 0 5.38 2.683 4.614 6.44-.766 3.757-3.882 6.44-7.4 6.44-1.593 0-2.854-.523-3.647-1.473l-1.222 5.717h-3.78zm8.075-7.893c1.506 0 2.786-1.138 3.05-2.62.263-1.483-.628-2.62-2.134-2.62-1.506 0-2.786 1.137-3.05 2.62-.263 1.482.628 2.62 2.134 2.62z" fill="#0070BA"/>
                        <path d="M66.18 24.707h-4.78l2.925-16.783h4.78L66.18 24.707z" fill="#0070BA"/>
                        <path d="M81.59 7.924h4.78l-2.925 16.783h-4.78l.216-1.235c-1.072.993-2.476 1.576-4.112 1.576-3.517 0-5.38-2.683-4.614-6.44.766-3.757 3.882-6.44 7.4-6.44 1.593 0 2.854.523 3.647 1.473l.388-5.717zm-4.325 12.615c1.506 0 2.786-1.138 3.05-2.62.263-1.483-.628-2.62-2.134-2.62-1.506 0-2.786 1.137-3.05 2.62-.263 1.482.628 2.62 2.134 2.62z" fill="#0070BA"/>
                      </svg>
                      <span className="text-sm font-medium">PayPal</span>
                    </div>
                    <span className="text-xs text-gray-400">כרטיס אשראי / PayPal</span>
                  </label>

                  {/* Bit */}
                  <label 
                    className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-all ${
                      paymentMethod === "bit" 
                        ? "border-brand-500 bg-brand-50" 
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="bit"
                      checked={paymentMethod === "bit"}
                      onChange={() => setPaymentMethod("bit")}
                      className="w-4 h-4 text-brand-500"
                    />
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-xs">bit</span>
                      </div>
                      <span className="text-sm font-medium">Bit / אשראי</span>
                    </div>
                    <span className="text-xs text-amber-600">בקרוב</span>
                  </label>

                  {/* Demo Mode */}
                  <label 
                    className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-all ${
                      paymentMethod === "demo" 
                        ? "border-brand-500 bg-brand-50" 
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="demo"
                      checked={paymentMethod === "demo"}
                      onChange={() => setPaymentMethod("demo")}
                      className="w-4 h-4 text-brand-500"
                    />
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center">
                        <span className="text-white text-lg">✨</span>
                      </div>
                      <span className="text-sm font-medium">Demo (ללא תשלום אמיתי)</span>
                    </div>
                    <span className="text-xs text-green-600">לבדיקה</span>
                  </label>
                </div>
              </div>

              {error && (
                <p className="text-sm text-red-500 bg-red-50 px-4 py-3 rounded-xl">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-warm-900 text-white font-semibold rounded-full hover:bg-brand-600 transition-all duration-300 hover:shadow-lg hover:shadow-brand-500/20 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    {t.checkout.processing}
                  </span>
                ) : (
                  `${t.checkout.placeOrder} — ${t.currency.symbol}${total.toFixed(2)}`
                )}
              </button>
            </form>
          </div>

          {/* Order summary */}
          <div className="lg:col-span-2">
            <div className="bg-warm-50 rounded-2xl p-6 sticky top-28">
              <h2 className="font-semibold text-lg text-warm-900 mb-6">
                {t.checkout.orderSummary}
              </h2>

              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-white shrink-0 relative">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-warm-900 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                        {item.quantity}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-warm-900 truncate">{item.name}</p>
                      <p className="text-sm text-gray-500">{t.currency.symbol}{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-warm-200/50 pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">{t.cart.subtotal}</span>
                  <span className="font-medium">{t.currency.symbol}{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">{t.cart.shipping}</span>
                  <span className="font-medium">
                    {shipping === 0 ? (
                      <span className="text-green-600">{t.cart.free}</span>
                    ) : (
                      `${t.currency.symbol}${shipping.toFixed(2)}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">{t.cart.tax} (17%)</span>
                  <span className="font-medium">{t.currency.symbol}{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base font-semibold pt-3 border-t border-warm-200/50">
                  <span>{t.cart.total}</span>
                  <span className="font-[family-name:var(--font-display)]">{t.currency.symbol}{total.toFixed(2)}</span>
                </div>
              </div>

              {subtotal < 150 && (
                <p className="mt-4 text-xs text-brand-600 bg-brand-50 px-3 py-2 rounded-lg text-center">
                  🎁 {t.cart.freeShippingAt.replace("{amount}", (150 - subtotal).toFixed(2))}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
