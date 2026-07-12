import Link from "next/link";
import { he } from "@/lib/translations";

export default function Footer() {
  const t = he;

  return (
    <footer className="bg-warm-900 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="font-[family-name:var(--font-display)] text-xl font-semibold">
                SnapCase
              </span>
            </Link>
            <p className="text-warm-200/70 text-sm leading-relaxed max-w-xs">
              {t.footer.tagline}
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-warm-200/50">
              {t.footer.shop}
            </h4>
            <ul className="space-y-2.5">
              <li><Link href="/products" className="text-sm text-warm-200/70 hover:text-white transition-colors">{t.footer.allCharms}</Link></li>
              <li><Link href="/products?category=beaded-charms" className="text-sm text-warm-200/70 hover:text-white transition-colors">{t.footer.beaded}</Link></li>
              <li><Link href="/products?category=chain-charms" className="text-sm text-warm-200/70 hover:text-white transition-colors">{t.footer.chain}</Link></li>
              <li><Link href="/products?category=nature-charms" className="text-sm text-warm-200/70 hover:text-white transition-colors">{t.footer.nature}</Link></li>
              <li><Link href="/products?category=character-charms" className="text-sm text-warm-200/70 hover:text-white transition-colors">{t.footer.character}</Link></li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-warm-200/50">
              {t.footer.support}
            </h4>
            <ul className="space-y-2.5">
              <li><span className="text-sm text-warm-200/70">{t.footer.shippingPolicy}</span></li>
              <li><span className="text-sm text-warm-200/70">{t.footer.returnsExchanges}</span></li>
              <li><span className="text-sm text-warm-200/70">{t.footer.faq}</span></li>
              <li><span className="text-sm text-warm-200/70">{t.footer.contactUs}</span></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-warm-200/50">
              {t.footer.newsletter}
            </h4>
            <p className="text-sm text-warm-200/70 mb-4">
              {t.footer.newsletterText}
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder={t.footer.emailPlaceholder}
                className="flex-1 min-w-0 px-4 py-2.5 bg-white/10 border border-white/10 rounded-full text-sm text-white placeholder-white/40 focus:outline-none focus:border-brand-400 transition-colors"
              />
              <button className="px-5 py-2.5 bg-brand-500 text-white text-sm font-medium rounded-full hover:bg-brand-400 transition-colors shrink-0">
                {t.footer.join}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-warm-200/40">
            {t.footer.rights}
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-warm-200/40">{t.footer.freeShippingNote}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
