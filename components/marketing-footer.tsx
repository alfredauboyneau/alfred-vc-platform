"use client";

import Link from "next/link";
import { Zap } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

export function MarketingFooter() {
  const { t, lang } = useLanguage();

  const legalLinks =
    lang === "en"
      ? [
          { href: "/privacy", label: "Privacy" },
          { href: "/terms", label: "Terms" },
          { href: "/legal", label: "Legal notice" },
        ]
      : [
          { href: "/privacy", label: "Confidentialité" },
          { href: "/terms", label: "Conditions" },
          { href: "/legal", label: "Mentions légales" },
        ];

  return (
    <footer className="border-t border-slate-100 bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-semibold text-sm text-slate-700">Alfred</span>
          </div>
          <p className="text-xs text-slate-400">{t.landing.footerCopyright}</p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-5 text-xs text-slate-500">
            <Link href="/how-it-works" className="hover:text-slate-900 transition-colors">
              {t.nav.howItWorks}
            </Link>
            <Link href="/news" className="hover:text-slate-900 transition-colors">
              {t.nav.news}
            </Link>
            <Link href="/about" className="hover:text-slate-900 transition-colors">
              {t.nav.about}
            </Link>
            <Link href="/startup/submit" className="hover:text-slate-900 transition-colors">
              {t.landing.footerStartups}
            </Link>
            <Link href="/vc/register" className="hover:text-slate-900 transition-colors">
              {t.landing.footerInvestors}
            </Link>
          </div>

          <div className="flex flex-wrap gap-5 text-xs text-slate-400">
            {legalLinks.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-slate-700 transition-colors">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
