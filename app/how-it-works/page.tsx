"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Brain,
  Zap,
  BarChart3,
  Target,
  CheckCircle2,
  Clock,
  ChevronDown,
  ChevronUp,
  Lightbulb,
} from "lucide-react";
import { useLanguage, LanguageToggle } from "@/lib/i18n";
import { useState } from "react";
import { NavbarLoginButton } from "@/components/navbar-login-button";
import { MarketingFooter } from "@/components/marketing-footer";

const ICONS: Record<string, React.ReactNode> = {
  BarChart3: <BarChart3 className="w-7 h-7 text-blue-600" />,
  Brain: <Brain className="w-7 h-7 text-blue-600" />,
  Target: <Target className="w-7 h-7 text-blue-600" />,
  CheckCircle2: <CheckCircle2 className="w-7 h-7 text-blue-600" />,
};

export default function HowItWorksPage() {
  const { t } = useLanguage();
  const h = t.howItWorks;
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-white">

      {/* ── NAVBAR ── */}
      <nav className="sticky top-0 z-50 border-b border-slate-100/80 bg-white/80 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-sm">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg text-slate-900 tracking-tight">Alfred</span>
          </Link>
          <div className="hidden sm:flex items-center gap-1">
            <Link href="/how-it-works">
              <Button variant="ghost" size="sm" className="text-blue-600 font-semibold">{t.nav.howItWorks}</Button>
            </Link>
            <Link href="/about">
              <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900">{t.nav.about}</Button>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <NavbarLoginButton className="text-slate-600 hover:text-slate-900" />
            <Link href="/startup/submit">
              <Button variant="outline" size="sm" className="hidden sm:flex gap-1.5 border-blue-200 text-blue-700 hover:bg-blue-50 font-semibold">
                {t.nav.isStartup}
              </Button>
            </Link>
            <Link href="/vc/register">
              <Button size="sm" className="hidden sm:flex gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm">
                {t.nav.isVC}
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="marketing-surface pt-20 pb-16 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-blue-200 bg-white/90 text-blue-700 text-xs font-semibold tracking-widest uppercase shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            {h.badge}
          </div>
          <h1 className="headline-balance text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight mb-5">{h.title}</h1>
          <p className="text-lg text-slate-500 leading-relaxed max-w-2xl mx-auto">{h.subtitle}</p>
        </div>
      </section>

      {/* ── STEPS ── */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
        {h.steps.map((step, idx) => (
          <div key={step.number} className="relative">
            {/* Connector line */}
            {idx < h.steps.length - 1 && (
              <div className="absolute left-[39px] top-[88px] w-0.5 h-[calc(100%+2rem)] bg-gradient-to-b from-blue-200 to-transparent hidden sm:block" />
            )}

            <div className="flex gap-6 items-start">
              {/* Step number + icon */}
              <div className="shrink-0 flex flex-col items-center gap-2">
                <div className="w-20 h-20 rounded-2xl bg-blue-50 border-2 border-blue-100 flex items-center justify-center shadow-sm">
                  {ICONS[step.icon]}
                </div>
                <span className="text-xs font-bold text-blue-400 tracking-widest">{step.number}</span>
              </div>

              {/* Content */}
              <div className="premium-card flex-1 min-w-0 rounded-[28px] border border-slate-200/70 p-7 pt-6">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{step.title}</h2>
                  <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-slate-100 text-slate-500 text-xs font-medium">
                    <Clock className="w-3 h-3" />
                    {step.duration}
                  </span>
                </div>
                <p className="text-sm font-semibold text-blue-600 mb-3">{step.tagline}</p>
                <p className="text-slate-600 leading-relaxed mb-5">{step.desc}</p>

                {/* Detail points */}
                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5 mb-4">
                  <ul className="space-y-2.5">
                    {step.details.map((detail, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle2 className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                        <span className="text-slate-600 text-sm">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Tip */}
                <div className="flex items-start gap-3 px-4 py-3 rounded-2xl bg-amber-50 border border-amber-100">
                  <Lightbulb className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                  <p className="text-sm text-amber-700">{step.tip}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* ── FAQ ── */}
      <section className="bg-slate-50/80 py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h2 className="headline-balance text-2xl sm:text-3xl font-bold text-slate-900 text-center mb-10 tracking-tight">{h.faqTitle}</h2>
          <div className="space-y-3">
            {h.faq.map((item, idx) => (
              <div key={idx} className="premium-card rounded-2xl border border-slate-200/70 overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-slate-50 transition-colors"
                >
                  <span className="font-semibold text-slate-900 text-sm pr-4">{item.q}</span>
                  {openFaq === idx
                    ? <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                    : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  }
                </button>
                {openFaq === idx && (
                  <div className="px-6 pb-5 text-slate-500 text-sm leading-relaxed border-t border-slate-100 pt-4">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="relative overflow-hidden bg-blue-600 py-20 text-center">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.24) 1px, transparent 1px), linear-gradient(to right, rgba(255,255,255,0.2) 1px, transparent 1px)", backgroundSize: "52px 52px" }} />
        <div className="max-w-xl mx-auto px-4">
          <h2 className="headline-balance text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight">{h.ctaTitle}</h2>
          <p className="text-blue-100 mb-10 leading-relaxed">{h.ctaDesc}</p>
          <Link href="/startup/submit">
            <Button size="lg" className="gap-2 px-10 h-12 text-base bg-white text-blue-700 hover:bg-blue-50 border-0 font-semibold shadow-lg">
              {h.ctaBtn} <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
