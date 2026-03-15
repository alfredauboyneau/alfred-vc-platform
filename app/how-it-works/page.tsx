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
  SearchCheck,
  Building2,
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
  const { t, lang } = useLanguage();
  const h = t.howItWorks;
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const reportPreview =
    lang === "en"
      ? {
          label: "Example output",
          title: "What the founder receives after analysis",
          subtitle: "A readable financial review followed by a fund ranking with short rationales.",
          report: "Financial report",
          score: "Health score",
          strengths: "Strengths",
          risks: "Watchpoints",
          fit: "Fund shortlist",
          fitDesc: "Ranked by score, stage fit, sector fit and ticket range.",
          scorecard: "Alfred summary",
          topFunds: "3 priority funds",
          strengthItems: ["MoM growth +14%", "LTV/CAC above 3x", "B2B SaaS gross margin 78%"],
          riskItems: ["Runway under 12 months", "Ticket fit concentrated on Seed funds"],
          bullets: [
            "0-100 financial health score",
            "Short rationale for each recommended fund",
            "Readable output to share with advisors or investors",
          ],
        }
      : {
          label: "Exemple de rendu",
          title: "Ce que reçoit le fondateur après l'analyse",
          subtitle: "Une revue financière lisible, suivie d'un classement des fonds avec justification courte.",
          report: "Rapport financier",
          score: "Score de santé",
          strengths: "Points forts",
          risks: "Points d'attention",
          fit: "Classement des fonds",
          fitDesc: "Classé par score, adéquation de stade, secteur et ticket.",
          scorecard: "Synthèse Alfred",
          topFunds: "3 fonds prioritaires",
          strengthItems: ["Croissance mensuelle +14 %", "LTV/CAC supérieur à 3x", "Marge brute SaaS B2B de 78 %"],
          riskItems: ["Runway inférieur à 12 mois", "Compatibilité ticket surtout avec des fonds Seed"],
          bullets: [
            "Score de santé financière de 0 à 100",
            "Justification courte pour chaque fonds recommandé",
            "Rendu lisible à partager avec vos conseils ou vos investisseurs",
          ],
        };

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

      <section className="bg-white py-6 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10 max-w-2xl">
            <p className="eyebrow mb-4">{reportPreview.label}</p>
            <h2 className="headline-balance text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-4">
              {reportPreview.title}
            </h2>
            <p className="text-slate-500 leading-relaxed">{reportPreview.subtitle}</p>
          </div>

          <div className="premium-card section-frame rounded-[30px] border border-slate-200/70 p-5 sm:p-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <p className="eyebrow">{reportPreview.report}</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">{reportPreview.scorecard}</p>
              </div>
              <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-right ring-1 ring-emerald-100 min-w-[9rem]">
                <p className="text-xs text-emerald-700">{reportPreview.score}</p>
                <p className="text-2xl font-bold text-emerald-800">81/100</p>
              </div>
            </div>

            <div className="grid gap-4 pt-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-slate-50/90 p-4 ring-1 ring-slate-200/70">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  {reportPreview.strengths}
                </p>
                <ul className="mt-3 space-y-2 text-[15px] leading-relaxed text-slate-700">
                  {reportPreview.strengthItems.map((item) => (
                    <li key={item} className="flex gap-2">
                      <CheckCircle2 className="mt-0.5 w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl bg-amber-50/90 p-4 ring-1 ring-amber-100">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-700">
                  {reportPreview.risks}
                </p>
                <ul className="mt-3 space-y-2 text-[15px] leading-relaxed text-slate-700">
                  {reportPreview.riskItems.map((item) => (
                    <li key={item} className="flex gap-2">
                      <Target className="mt-0.5 w-4 h-4 text-amber-600 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-blue-100 bg-blue-50/90 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-700">
                    {reportPreview.fit}
                  </p>
                  <p className="mt-1 text-[15px] leading-relaxed text-slate-700">{reportPreview.fitDesc}</p>
                </div>
                <div className="shrink-0 rounded-full bg-white px-3 py-1 text-sm font-semibold text-blue-700 shadow-sm">
                  {reportPreview.topFunds}
                </div>
              </div>
              <div className="mt-4 space-y-2">
                {["Partech", "Kima Ventures", "Alven"].map((fund, index) => (
                  <div key={fund} className="flex items-center justify-between rounded-xl bg-white px-3 py-2.5 text-sm text-slate-700 shadow-sm ring-1 ring-slate-100">
                    <span className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-blue-600" />
                      {fund}
                    </span>
                    <span className="font-semibold text-slate-900">{92 - index * 5}/100</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 space-y-2 rounded-2xl bg-slate-950 p-4 text-sm text-slate-200 shadow-[0_18px_38px_rgba(15,23,42,0.24)]">
              {reportPreview.bullets.map((item) => (
                <div key={item} className="flex gap-2 leading-relaxed">
                  <SearchCheck className="mt-0.5 w-4 h-4 text-blue-300 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
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
