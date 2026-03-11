"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Brain,
  Users,
  Zap,
  BarChart3,
  Target,
  CheckCircle2,
} from "lucide-react";
import { useLanguage, LanguageToggle } from "@/lib/i18n";
import { NavbarLoginButton } from "@/components/navbar-login-button";

export default function Home() {
  const { t } = useLanguage();
  const l = t.landing;

  return (
    <div className="min-h-screen bg-white">

      {/* ── NAVBAR ── */}
      <nav className="sticky top-0 z-50 border-b border-slate-100 bg-white/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-sm">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg text-slate-900 tracking-tight">Alfred</span>
          </div>
          <div className="hidden sm:flex items-center gap-1">
            <Link href="/how-it-works">
              <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900">{t.nav.howItWorks}</Button>
            </Link>
            <Link href="/about">
              <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900">{t.nav.about}</Button>
            </Link>
            <Link href="/vc/register">
              <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900">{t.nav.isVC}</Button>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <NavbarLoginButton className="text-slate-600 hover:text-slate-900" />
            <Link href="/startup/submit">
              <Button size="sm" className="hidden sm:flex gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm">
                {l.ctaStartup} <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white pt-20 pb-28">
        {/* Subtle grid */}
        <div className="absolute inset-0 opacity-[0.4]"
          style={{ backgroundImage: "linear-gradient(#e2e8f0 1px, transparent 1px), linear-gradient(to right, #e2e8f0 1px, transparent 1px)", backgroundSize: "64px 64px" }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-blue-100/60 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 mb-7 px-4 py-1.5 rounded-full border border-blue-200 bg-blue-50 text-blue-700 text-xs font-semibold tracking-widest uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            {l.badge}
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-[72px] font-bold leading-[1.08] tracking-tight mb-6 text-slate-900">
            {l.titlePart1}{" "}
            <span className="text-blue-600">{l.titleHighlight}</span>
            <br />
            {l.titlePart2}
          </h1>

          <p className="text-lg sm:text-xl text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed">
            {l.subtitle}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/startup/submit">
              <Button size="lg" className="gap-2 px-8 h-12 text-base bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-200 border-0 font-semibold">
                {l.ctaStartup} <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/vc/register">
              <Button size="lg" variant="outline" className="gap-2 px-8 h-12 text-base border-slate-200 text-slate-700 hover:bg-slate-50 bg-white">
                {l.ctaVC} <Users className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="border-y border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-slate-100">
            {[
              { value: "98+", label: l.stats.vcs },
              { value: "< 5 min", label: l.stats.time },
              { value: "IA", label: l.stats.ai },
              { value: "100%", label: l.stats.matching },
            ].map((stat) => (
              <div key={stat.label} className="py-10 text-center">
                <div className="text-3xl font-bold text-slate-900 tracking-tight">{stat.value}</div>
                <div className="text-sm text-slate-400 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMMENT ÇA MARCHE ── */}
      <section className="bg-slate-50 py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-blue-600 text-xs font-bold tracking-[0.2em] uppercase mb-4">Process</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4 tracking-tight">{l.howTitle}</h2>
            <p className="text-slate-500 max-w-xl mx-auto">{l.howSubtitle}</p>
            <Link href="/how-it-works" className="inline-flex items-center gap-1.5 mt-5 text-sm text-blue-600 hover:text-blue-700 font-medium">
              Voir le processus détaillé <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-3 gap-5">
            {[
              { step: "01", icon: <BarChart3 className="w-5 h-5 text-blue-600" />, ...l.steps[0] },
              { step: "02", icon: <Brain className="w-5 h-5 text-blue-600" />, ...l.steps[1] },
              { step: "03", icon: <Target className="w-5 h-5 text-blue-600" />, ...l.steps[2] },
            ].map((item) => (
              <div key={item.step} className="group relative rounded-2xl border border-slate-200 bg-white p-8 hover:border-blue-200 hover:shadow-md transition-all duration-300">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center">
                    {item.icon}
                  </div>
                  <span className="text-5xl font-bold text-slate-100 select-none group-hover:text-blue-50 transition-colors">{item.step}</span>
                </div>
                <h3 className="font-semibold text-slate-900 text-lg mb-2 tracking-tight">{item.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── POUR LES VCs ── */}
      <section className="bg-blue-600 py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-block mb-6 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 text-white border border-white/30">
                {l.vcSectionBadge}
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6 leading-tight tracking-tight">
                {l.vcSectionTitle}<br />{l.vcSectionTitle2}
              </h2>
              <p className="text-blue-100 mb-8 leading-relaxed">{l.vcSectionDesc}</p>
              <Link href="/vc/register">
                <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50 gap-2 font-semibold border-0 shadow-lg">
                  {l.vcSectionCta} <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
            <div className="space-y-2.5">
              {l.vcFeatures.map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-xl border border-white/20 bg-white/10 px-4 py-3.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-200 shrink-0" />
                  <span className="text-white text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="bg-white py-28 text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4 tracking-tight">{l.ctaTitle}</h2>
          <p className="text-slate-500 mb-10">{l.ctaDesc}</p>
          <Link href="/startup/submit">
            <Button size="lg" className="gap-2 px-10 h-12 text-base bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-200 border-0 font-semibold">
              {l.ctaBtn} <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-slate-100 bg-slate-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-semibold text-sm text-slate-700">Alfred</span>
          </div>
          <p className="text-xs text-slate-400">{l.footerCopyright}</p>
          <div className="flex gap-5 text-xs text-slate-500">
            <Link href="/how-it-works" className="hover:text-slate-900 transition-colors">{t.nav.howItWorks}</Link>
            <Link href="/about" className="hover:text-slate-900 transition-colors">{t.nav.about}</Link>
            <Link href="/startup/submit" className="hover:text-slate-900 transition-colors">{l.footerStartups}</Link>
            <Link href="/vc/register" className="hover:text-slate-900 transition-colors">{l.footerInvestors}</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
