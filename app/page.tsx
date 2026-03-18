"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Brain,
  Users,
  Zap,
  BarChart3,
  Target,
  CheckCircle2,
  ShieldCheck,
  FileSpreadsheet,
  LockKeyhole,
} from "lucide-react";
import { useLanguage, LanguageToggle } from "@/lib/i18n";
import { NavbarLoginButton } from "@/components/navbar-login-button";
import { MarketingFooter } from "@/components/marketing-footer";

export default function Home() {
  const { t, lang } = useLanguage();
  const l = t.landing;
  const vcLogos = [
    { name: "Partech", src: "/vc-logos/partech.png", width: 640, height: 427, className: "max-w-[118px] sm:max-w-[132px]" },
    { name: "Eurazeo", src: "/vc-logos/eurazeo.svg", width: 220, height: 48, className: "max-w-[122px] sm:max-w-[142px]" },
    { name: "Kima Ventures", src: "/vc-logos/kima.png", width: 1200, height: 668, className: "max-w-[124px] sm:max-w-[148px]" },
    { name: "ISAI", src: "/vc-logos/isai.png", width: 2362, height: 944, className: "max-w-[110px] sm:max-w-[128px]" },
    { name: "Elaia", src: "/vc-logos/elaia.png", width: 180, height: 54, className: "max-w-[110px] sm:max-w-[126px]" },
    { name: "Daphni", src: "/vc-logos/daphni.svg", width: 220, height: 52, className: "max-w-[118px] sm:max-w-[136px]" },
    { name: "Singular", src: "/vc-logos/singular.svg", width: 240, height: 52, className: "max-w-[124px] sm:max-w-[144px]" },
    { name: "Frst", src: "/vc-logos/frst.svg", width: 220, height: 52, className: "max-w-[96px] sm:max-w-[112px]" },
    { name: "Serena", src: "/vc-logos/serena.svg", width: 220, height: 60, className: "max-w-[118px] sm:max-w-[136px]" },
    { name: "Founders Future", src: "/vc-logos/founders-future.png", width: 408, height: 168, className: "max-w-[124px] sm:max-w-[144px]" },
  ];
  const methodItems =
    lang === "en"
      ? [
          {
            step: "01",
            title: "Startup intake",
            desc: "Core company data, metrics and fundraising context are structured in one place.",
          },
          {
            step: "02",
            title: "Financial review",
            desc: "Claude generates a report on health, strengths, risks and investment readiness.",
          },
          {
            step: "03",
            title: "VC fit scoring",
            desc: "Funds are filtered by thesis, stage and ticket before the final ranking is produced.",
          },
        ]
      : [
          {
            step: "01",
            title: "Collecte des données",
            desc: "Les informations de la startup, les métriques et le contexte de levée sont structurés au même endroit.",
          },
          {
            step: "02",
            title: "Revue financière",
            desc: "Claude génère un rapport sur la santé, les forces, les risques et la maturité d'investissement.",
          },
          {
            step: "03",
            title: "Classement des fonds",
            desc: "Les fonds sont filtrés par thèse, stade et ticket avant le classement final.",
          },
        ];
  const heroPanel =
    lang === "en"
      ? {
          label: "What the product produces",
          title: "A structured output, not a generic AI answer.",
          items: [
            {
              icon: <BarChart3 className="w-4 h-4 text-blue-700" />,
              title: "Financial review",
              desc: "Health score, strengths, watchpoints and readiness.",
            },
            {
              icon: <Target className="w-4 h-4 text-blue-700" />,
              title: "Fund ranking",
              desc: "Ordered by thesis fit, stage fit and ticket fit.",
            },
            {
              icon: <FileSpreadsheet className="w-4 h-4 text-blue-700" />,
              title: "Usable output",
              desc: "Readable by founders, advisors and investors.",
            },
          ],
          note: "Detailed report example on the Method page",
        }
      : {
          label: "Ce que produit Alfred",
          title: "Un rendu structuré, pas une réponse IA générique.",
          items: [
            {
              icon: <BarChart3 className="w-4 h-4 text-blue-700" />,
              title: "Revue financière",
              desc: "Score de santé, points forts, risques et maturité.",
            },
            {
              icon: <Target className="w-4 h-4 text-blue-700" />,
              title: "Classement des fonds",
              desc: "Ordonné selon la thèse, le stade et le ticket.",
            },
            {
              icon: <FileSpreadsheet className="w-4 h-4 text-blue-700" />,
              title: "Rendu exploitable",
              desc: "Lisible pour les fondateurs, leurs conseils et les investisseurs.",
            },
          ],
          note: "Exemple détaillé du rapport sur la page Méthode",
        };
  const trustBand =
    lang === "en"
      ? [
          "French VC market coverage",
          "Human-readable scoring output",
          "FR / EN reporting",
        ]
      : [
          "Couverture du marché VC français",
          "Score explicable",
          "Rapports FR / EN",
        ];
  const footerNote =
    lang === "en"
      ? "Alfred structures startup information, produces a readable financial review and ranks compatible French funds. It is not investment advice."
      : "Alfred structure les informations de la startup, produit une revue financière lisible et classe les fonds français compatibles. Ce n'est pas un conseil en investissement.";

  return (
    <div className="min-h-screen bg-white">

      {/* ── NAVBAR ── */}
      <nav className="sticky top-0 z-50 border-b border-slate-100/80 bg-white/80 backdrop-blur-2xl">
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
      <section className="relative overflow-hidden marketing-surface pt-20 pb-24">
        {/* Subtle grid */}
        <div className="absolute inset-0 opacity-[0.4]"
          style={{ backgroundImage: "linear-gradient(#e2e8f0 1px, transparent 1px), linear-gradient(to right, #e2e8f0 1px, transparent 1px)", backgroundSize: "64px 64px" }} />
        <div className="absolute top-0 right-[8%] w-[520px] h-[320px] bg-blue-100/70 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid gap-12 lg:grid-cols-[1.16fr_0.84fr] lg:items-center">
          {/* Badge */}
          <div>
            <div className="inline-flex items-center gap-2 mb-7 px-4 py-1.5 rounded-full border border-blue-200/80 bg-white/85 text-blue-700 text-xs font-semibold tracking-widest uppercase shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              {l.badge}
            </div>

            <h1 className="headline-balance text-5xl sm:text-6xl lg:text-[68px] font-bold leading-[1.02] tracking-tight mb-6 text-slate-900">
              {l.titlePart1}{" "}
              <span className="text-blue-600">{l.titleHighlight}</span>
              <br />
              {l.titlePart2}
            </h1>

            <p className="text-lg sm:text-xl text-slate-500 mb-8 max-w-2xl leading-relaxed">
              {l.subtitle}
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
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

            <div className="mt-8 flex flex-wrap gap-2">
              {trustBand.map((item) => (
                <span key={item} className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/90 px-3 py-1.5 text-xs text-slate-600 shadow-sm">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="relative lg:max-w-[30rem] lg:ml-auto">
            <div className="premium-card section-frame rounded-[30px] border border-slate-200/70 p-6 sm:p-7">
              <div className="mb-6">
                <p className="eyebrow mb-3">{heroPanel.label}</p>
                <p className="headline-balance text-2xl font-semibold tracking-tight text-slate-950">
                  {heroPanel.title}
                </p>
              </div>
              <div className="space-y-3">
                {heroPanel.items.map((item) => (
                  <div key={item.title} className="flex gap-3 rounded-2xl border border-slate-200/80 bg-white/80 p-4">
                    <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-blue-50">
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-950">{item.title}</p>
                      <p className="mt-1 text-sm leading-6 text-slate-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/how-it-works" className="mt-5 flex items-center justify-between rounded-2xl bg-slate-950 px-4 py-3 text-sm text-slate-200">
                <span>{heroPanel.note}</span>
                <ArrowRight className="w-4 h-4 text-blue-300" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-14 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-[32px] border border-slate-200/80 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.08),transparent_42%),linear-gradient(180deg,rgba(248,250,252,0.92),rgba(255,255,255,1))] px-6 py-8 sm:px-10 sm:py-10">
            <div className="mx-auto max-w-3xl text-center">
              <p className="eyebrow mb-4">{l.vcRibbon.eyebrow}</p>
              <h2 className="headline-balance text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                {l.vcRibbon.title}
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-500 sm:text-base">
                {l.vcRibbon.desc}
              </p>
            </div>

            <div className="mt-10 logo-ribbon">
              <div className="logo-ribbon-track">
                {[...vcLogos, ...vcLogos].map((logo, index) => (
                  <div
                    key={`${logo.name}-${index}`}
                    className="flex h-24 w-[10.75rem] shrink-0 items-center justify-center rounded-[24px] border border-slate-200/80 bg-white/92 px-6 shadow-[0_18px_42px_rgba(15,23,42,0.06)]"
                  >
                    <Image
                      src={logo.src}
                      alt={`${logo.name} logo`}
                      width={logo.width}
                      height={logo.height}
                      className={`h-auto max-h-11 w-auto object-contain ${logo.className}`}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="border-y border-slate-100 bg-white/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-slate-100">
            {[
              { value: "98+", label: l.stats.vcs },
              { value: "35", label: lang === "en" ? "Funds pre-filtered before ranking" : "Fonds préfiltrés avant classement" },
              { value: "0-100", label: lang === "en" ? "Readable compatibility score" : "Score de compatibilité lisible" },
              { value: "FR / EN", label: lang === "en" ? "Bilingual reporting" : "Rendu bilingue" },
            ].map((stat) => (
              <div key={stat.label} className="py-10 text-center">
                <div className="text-3xl font-bold text-slate-900 tracking-tight">{stat.value}</div>
                <div className="text-sm text-slate-400 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-18">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="premium-card section-frame rounded-[30px] border border-slate-200/70 p-8 sm:p-10">
            <div className="grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-start">
              <div>
                <p className="eyebrow mb-4">{l.privacy.eyebrow}</p>
                <h2 className="headline-balance text-3xl sm:text-4xl font-bold tracking-tight text-slate-950 mb-4">
                  {l.privacy.title}
                </h2>
                <p className="max-w-xl text-base leading-7 text-slate-600">{l.privacy.desc}</p>
                <Link href="/privacy" className="inline-flex items-center gap-1.5 mt-6 text-sm text-blue-600 hover:text-blue-700 font-medium">
                  {l.privacy.cta} <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              <div className="rounded-[26px] border border-blue-100/80 bg-blue-50/80 p-6">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-blue-100">
                  <ShieldCheck className="w-5 h-5 text-blue-700" />
                </div>
                <p className="text-base leading-7 text-slate-800">{l.privacy.access}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-50/80 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="headline-balance text-3xl sm:text-4xl font-bold text-slate-900 mb-4 tracking-tight">{l.howTitle}</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">{l.howSubtitle}</p>
            <Link href="/how-it-works" className="inline-flex items-center gap-1.5 mt-5 text-sm text-blue-600 hover:text-blue-700 font-medium">
              {t.nav.seeProcess} <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {methodItems.map((item) => (
              <div key={item.step} className="rounded-[28px] border border-slate-200/80 bg-white p-8 shadow-[0_20px_50px_rgba(15,23,42,0.05)]">
                <div className="flex items-center justify-between mb-6">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 font-semibold text-white">
                    {item.step}
                  </span>
                  <span className="h-px flex-1 mx-4 bg-slate-200" />
                </div>
                <h3 className="text-xl font-semibold tracking-tight text-slate-950">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── POUR LES VCs ── */}
      <section className="relative overflow-hidden bg-blue-600 py-24">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.24) 1px, transparent 1px), linear-gradient(to right, rgba(255,255,255,0.2) 1px, transparent 1px)", backgroundSize: "52px 52px" }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative grid sm:grid-cols-2 gap-16 items-center">
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
                <div key={item} className="flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 px-4 py-3.5 backdrop-blur-sm">
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
          <h2 className="headline-balance text-3xl sm:text-4xl font-bold text-slate-900 mb-4 tracking-tight">{l.ctaTitle}</h2>
          <p className="text-slate-500 mb-10">{l.ctaDesc}</p>
          <Link href="/startup/submit">
            <Button size="lg" className="gap-2 px-10 h-12 text-base bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-200 border-0 font-semibold">
              {l.ctaBtn} <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <div className="mt-10 flex flex-wrap justify-center gap-2">
            {l.privacy.points.map((point, index) => (
              <span key={point} className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-slate-50 px-3 py-1.5 text-xs text-slate-600">
                {index === 0 ? (
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                ) : index === 1 ? (
                  <LockKeyhole className="w-3.5 h-3.5 text-blue-600" />
                ) : (
                  <FileSpreadsheet className="w-3.5 h-3.5 text-blue-600" />
                )}
                {point}
              </span>
            ))}
          </div>
          <p className="mt-6 text-sm text-slate-400">{footerNote}</p>
        </div>
      </section>
      <MarketingFooter />
    </div>
  );
}
