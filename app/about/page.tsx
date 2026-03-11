"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  CheckCircle2,
  XCircle,
  Zap,
  Brain,
  Target,
  Clock,
  TrendingUp,
  Linkedin,
} from "lucide-react";
import { useLanguage, LanguageToggle } from "@/lib/i18n";
import { NavbarLoginButton } from "@/components/navbar-login-button";
import { MarketingFooter } from "@/components/marketing-footer";

export default function AboutPage() {
  const { t, lang } = useLanguage();
  const a = t.about;
  const operatingPrinciples =
    lang === "en"
      ? [
          {
            title: "Explainable by design",
            desc: "Alfred is meant to produce output a founder or investor can read, challenge and reuse.",
          },
          {
            title: "Focused on the French market",
            desc: "The product is designed around French VC theses, stages and ticket logic before broader expansion.",
          },
          {
            title: "Qualification before outreach",
            desc: "The goal is not to automate more noise, but to improve relevance before any contact happens.",
          },
        ]
      : [
          {
            title: "Explicable par construction",
            desc: "Alfred doit produire un rendu qu'un fondateur ou un investisseur peut lire, challenger et reutiliser.",
          },
          {
            title: "Concu d'abord pour le marche francais",
            desc: "Le produit est pense autour des theses VC francaises, des stades et des logiques de ticket avant toute extension.",
          },
          {
            title: "Qualifier avant de prospecter",
            desc: "L'objectif n'est pas d'automatiser plus de bruit, mais d'ameliorer la pertinence avant toute prise de contact.",
          },
        ];

  return (
    <div className="min-h-screen bg-white">

      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-50 border-b border-slate-100 bg-white/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-sm">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg text-slate-900 tracking-tight">Alfred</span>
          </Link>
          <div className="hidden sm:flex items-center gap-1">
            <Link href="/how-it-works">
              <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900">{t.nav.howItWorks}</Button>
            </Link>
            <Link href="/about">
              <Button variant="ghost" size="sm" className="text-blue-600 font-medium">{t.nav.about}</Button>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <NavbarLoginButton />
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

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white pt-20 pb-24">
        <div className="absolute inset-0 opacity-[0.35]"
          style={{ backgroundImage: "linear-gradient(#e2e8f0 1px, transparent 1px), linear-gradient(to right, #e2e8f0 1px, transparent 1px)", backgroundSize: "64px 64px" }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[250px] bg-blue-100/60 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 mb-8 px-4 py-1.5 rounded-full border border-blue-200 bg-blue-50 text-blue-700 text-xs font-semibold tracking-widest uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            {a.heroBadge}
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 mb-6 leading-[1.05]">
            {a.heroTitle}{" "}
            <span className="text-blue-600">{a.heroTitleHighlight}</span>
          </h1>

          <p className="text-xl text-slate-500 leading-relaxed mb-10 max-w-2xl mx-auto">
            {a.heroSubtitle}
          </p>

          <div className="flex gap-3 flex-wrap justify-center mb-16">
            <Link href="/startup/submit">
              <Button size="lg" className="gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 shadow-sm">
                {a.ctaAnalyze} <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/how-it-works">
              <Button size="lg" variant="outline" className="gap-2 border-slate-200 text-slate-700 hover:bg-slate-50">
                {a.ctaHowItWorks}
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto">
            {a.stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-2xl font-bold text-slate-900">{s.value}</p>
                <p className="text-xs text-slate-400 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Ce qu'Alfred simplifie ── */}
      <section className="py-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-xs font-semibold tracking-widest text-blue-600 uppercase mb-3">{a.simplifiesBadge}</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            {a.simplifiesTitle}
          </h2>
        </div>

        <div className="grid sm:grid-cols-3 gap-6">
          {a.features.map((item, i) => {
            const icons = [
              <TrendingUp key={0} className="w-6 h-6 text-blue-600" />,
              <Target key={1} className="w-6 h-6 text-blue-600" />,
              <Brain key={2} className="w-6 h-6 text-blue-600" />,
            ];
            return (
              <div key={i} className="group bg-white rounded-2xl border border-slate-100 p-7 shadow-sm hover:shadow-md hover:border-blue-100 transition-all">
                <div className="w-11 h-11 bg-blue-50 rounded-xl flex items-center justify-center mb-5 group-hover:bg-blue-100 transition-colors">
                  {icons[i]}
                </div>
                <h3 className="font-bold text-slate-900 mb-2 text-lg">{item.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Avant / Après ── */}
      <section className="bg-slate-50 py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold tracking-widest text-blue-600 uppercase mb-3">{a.problemBadge}</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              {a.problemTitle}
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-white border border-red-100 rounded-2xl p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
                  <XCircle className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">{a.withoutTitle}</h3>
                  <p className="text-xs text-red-500">{a.withoutSub}</p>
                </div>
              </div>
              <ul className="space-y-3.5">
                {a.withoutList.map((p, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 shrink-0" />
                    <span className="text-slate-600 text-sm leading-relaxed">{p}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-blue-600 rounded-2xl p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white">{a.withTitle}</h3>
                  <p className="text-xs text-blue-200">{a.withSub}</p>
                </div>
              </div>
              <ul className="space-y-3.5">
                {a.withList.map((s, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-blue-200 mt-0.5 shrink-0" />
                    <span className="text-white/90 text-sm leading-relaxed">{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Temps économisé ── */}
      <section className="py-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 rounded-3xl p-10 sm:p-14 text-center">
          <Clock className="w-10 h-10 text-blue-400 mx-auto mb-6" />
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-5 tracking-tight">
            {a.timeBadge}
          </h2>
          <p className="text-slate-400 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
            {a.timeDesc1} <strong className="text-white">{a.timeBold1}</strong> {a.timeDesc2} <strong className="text-blue-400">{a.timeBold2}</strong>.
          </p>
          <div className="grid grid-cols-3 gap-8 max-w-xl mx-auto mb-10">
            {a.timeStats.map((s, i) => (
              <div key={i} className="text-center">
                <p className={`text-4xl font-bold ${i === 2 ? "text-blue-400" : i === 0 ? "text-red-400" : "text-slate-600"}`}>
                  {s.value}<span className="text-lg ml-1">{s.unit}</span>
                </p>
                {s.label && <p className="text-xs text-slate-500 mt-1">{s.label}</p>}
              </div>
            ))}
          </div>
          <Link href="/startup/submit">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold gap-2 px-8">
              {a.timeCta} <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      <section className="py-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold tracking-widest text-blue-600 uppercase mb-3">
            {lang === "en" ? "Operating principles" : "Principes de fonctionnement"}
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            {lang === "en" ? "A product built to stay readable and useful" : "Un produit pense pour rester lisible et utile"}
          </h2>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {operatingPrinciples.map((item) => (
            <div key={item.title} className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── L'équipe ── */}
      <section className="bg-slate-50 py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold tracking-widest text-blue-600 uppercase mb-3">{a.teamBadge}</p>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">{a.teamTitle}</h2>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 flex flex-col sm:flex-row items-center sm:items-start gap-8">
            <div className="shrink-0">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-md">
                <span className="text-white text-2xl font-bold">AA</span>
              </div>
            </div>
            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start mb-3">
                <span className="text-xl font-bold text-slate-900">{a.founderName}</span>
                <span className="text-sm text-blue-600 font-semibold bg-blue-50 px-2.5 py-0.5 rounded-full">
                  {a.founderRole}
                </span>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed">
                {a.founderBio}
              </p>
              <div className="flex items-center gap-3 mt-4 justify-center sm:justify-start">
                <a
                  href="https://www.linkedin.com/in/alfred-auboyneau"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-blue-600 transition-colors"
                >
                  <Linkedin className="w-4 h-4" />
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Mission ── */}
      <section className="bg-blue-600 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-blue-200 text-xs font-semibold tracking-widest uppercase mb-5">{a.missionBadge}</p>
          <p className="text-white text-2xl sm:text-3xl font-bold leading-relaxed">
            &ldquo;{a.missionQuote}&rdquo;
          </p>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
