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
  ShieldCheck,
  SearchCheck,
  FileSpreadsheet,
  LockKeyhole,
  Building2,
  ScanSearch,
} from "lucide-react";
import { useLanguage, LanguageToggle } from "@/lib/i18n";
import { NavbarLoginButton } from "@/components/navbar-login-button";
import { MarketingFooter } from "@/components/marketing-footer";

export default function Home() {
  const { t, lang } = useLanguage();
  const l = t.landing;
  const trustItems =
    lang === "en"
      ? [
          {
            title: "Method first",
            desc: "Startup data, financial analysis, thesis fit and ticket are scored in sequence.",
            icon: <ScanSearch className="w-5 h-5 text-blue-700" />,
          },
          {
            title: "Readable output",
            desc: "Every match comes with a short rationale, not just a score.",
            icon: <FileSpreadsheet className="w-5 h-5 text-blue-700" />,
          },
          {
            title: "Sensitive data handled carefully",
            desc: "Financial data is used to generate the report and matching output, then kept in your workspace.",
            icon: <LockKeyhole className="w-5 h-5 text-blue-700" />,
          },
        ]
      : [
          {
            title: "Une methode avant la promesse",
            desc: "Donnees startup, analyse financiere, these d'investissement et ticket sont evalues sequentiellement.",
            icon: <ScanSearch className="w-5 h-5 text-blue-700" />,
          },
          {
            title: "Un rendu lisible",
            desc: "Chaque match est accompagne d'une justification courte, pas uniquement d'un score.",
            icon: <FileSpreadsheet className="w-5 h-5 text-blue-700" />,
          },
          {
            title: "Des donnees sensibles traitees proprement",
            desc: "Les donnees financieres servent a generer le rapport et le matching, puis restent dans votre espace.",
            icon: <LockKeyhole className="w-5 h-5 text-blue-700" />,
          },
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
            title: "Intake startup",
            desc: "Les donnees societe, les metriques et le contexte de levee sont structures au meme endroit.",
          },
          {
            step: "02",
            title: "Revue financiere",
            desc: "Claude genere un rapport sur la sante, les forces, les risques et la maturite d'investissement.",
          },
          {
            step: "03",
            title: "Scoring de fit VC",
            desc: "Les fonds sont filtres par these, stade et ticket avant le classement final.",
          },
        ];
  const previewCopy =
    lang === "en"
      ? {
          title: "What founders actually receive",
          subtitle: "Not a black box. Alfred produces a financial summary and a ranked shortlist with explanations.",
          report: "Financial report",
          score: "Health score",
          strengths: "Key strengths",
          risks: "Key risks",
          fit: "VC shortlist",
          fitDesc: "Ranked by score, stage fit, sector fit and ticket range.",
          bullets: [
            "0-100 financial health score",
            "Short rationale for each recommended fund",
            "Readable output to share with advisors or investors",
          ],
        }
      : {
          title: "Ce que le fondateur recoit vraiment",
          subtitle: "Pas une boite noire. Alfred produit une synthese financiere et une shortlist classee avec explications.",
          report: "Rapport financier",
          score: "Score sante",
          strengths: "Points forts",
          risks: "Points de vigilance",
          fit: "Shortlist VC",
          fitDesc: "Classement par score, adequation stade, secteur et ticket.",
          bullets: [
            "Score de sante financiere de 0 a 100",
            "Justification courte pour chaque fonds recommande",
            "Rendu lisible a partager avec advisors ou investisseurs",
          ],
        };
  const pipelineCopy =
    lang === "en"
      ? {
          label: "Delivery flow",
          title: "How Alfred turns raw startup data into a usable fundraising output",
          subtitle: "The workflow stays simple for the founder, but the output is designed to remain readable for advisors, operators and funds.",
        }
      : {
          label: "Workflow produit",
          title: "Comment Alfred transforme des donnees brutes en rendu exploitable pour la levee",
          subtitle: "Le parcours reste simple pour le fondateur, mais le rendu est pense pour rester lisible par les advisors, les operateurs et les fonds.",
        };
  const credibilityCopy =
    lang === "en"
      ? {
          title: "Built for a fundraising workflow that can be audited",
          subtitle: "Alfred is designed to reduce wasted outreach, not replace judgement. The product structures data, explains the outcome and keeps the workflow usable for founders and funds.",
          badge: "Credibility layer",
        }
      : {
          title: "Concu pour un workflow de levee qui peut se verifier",
          subtitle: "Alfred est pense pour reduire la prospection inutile, pas pour remplacer le jugement. Le produit structure les donnees, explique le resultat et garde un rendu exploitable pour les fondateurs comme pour les fonds.",
          badge: "Couche de credibilite",
        };
  const trustBand =
    lang === "en"
      ? [
          "French VC market coverage",
          "Human-readable scoring output",
          "FR / EN reporting",
        ]
      : [
          "Couverture du marche VC francais",
          "Scoring avec restitution lisible",
          "Rapports FR / EN",
        ];
  const footerNote =
    lang === "en"
      ? "Alfred structures startup information, produces a readable financial review and ranks compatible French funds. It is not investment advice."
      : "Alfred structure les informations startup, produit une revue financiere lisible et classe les fonds francais compatibles. Ce n'est pas un conseil en investissement.";

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
      <section className="relative overflow-hidden bg-gradient-to-b from-stone-50 via-white to-white pt-20 pb-24">
        {/* Subtle grid */}
        <div className="absolute inset-0 opacity-[0.4]"
          style={{ backgroundImage: "linear-gradient(#e2e8f0 1px, transparent 1px), linear-gradient(to right, #e2e8f0 1px, transparent 1px)", backgroundSize: "64px 64px" }} />
        <div className="absolute top-0 right-[8%] w-[520px] h-[320px] bg-blue-100/70 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          {/* Badge */}
          <div>
            <div className="inline-flex items-center gap-2 mb-7 px-4 py-1.5 rounded-full border border-blue-200 bg-blue-50 text-blue-700 text-xs font-semibold tracking-widest uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              {l.badge}
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-[68px] font-bold leading-[1.04] tracking-tight mb-6 text-slate-900">
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
                <span key={item} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-600 shadow-sm">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="rounded-[28px] border border-slate-200 bg-white/95 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.10)] backdrop-blur">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
                    {previewCopy.report}
                  </p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">Alfred scorecard</p>
                </div>
                <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-right">
                  <p className="text-xs text-emerald-700">{previewCopy.score}</p>
                  <p className="text-2xl font-bold text-emerald-800">81/100</p>
                </div>
              </div>

              <div className="grid gap-4 pt-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    {previewCopy.strengths}
                  </p>
                  <ul className="mt-3 space-y-2 text-sm text-slate-700">
                    <li className="flex gap-2"><CheckCircle2 className="mt-0.5 w-4 h-4 text-emerald-600 shrink-0" /><span>MoM growth +14%</span></li>
                    <li className="flex gap-2"><CheckCircle2 className="mt-0.5 w-4 h-4 text-emerald-600 shrink-0" /><span>LTV/CAC above 3x</span></li>
                    <li className="flex gap-2"><CheckCircle2 className="mt-0.5 w-4 h-4 text-emerald-600 shrink-0" /><span>B2B SaaS gross margin 78%</span></li>
                  </ul>
                </div>

                <div className="rounded-2xl bg-amber-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-700">
                    {previewCopy.risks}
                  </p>
                  <ul className="mt-3 space-y-2 text-sm text-slate-700">
                    <li className="flex gap-2"><Target className="mt-0.5 w-4 h-4 text-amber-600 shrink-0" /><span>Runway under 12 months</span></li>
                    <li className="flex gap-2"><Target className="mt-0.5 w-4 h-4 text-amber-600 shrink-0" /><span>Ticket fit concentrated on Seed funds</span></li>
                  </ul>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-blue-100 bg-blue-50 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-700">
                      {previewCopy.fit}
                    </p>
                    <p className="mt-1 text-sm text-slate-700">{previewCopy.fitDesc}</p>
                  </div>
                  <div className="shrink-0 rounded-full bg-white px-3 py-1 text-sm font-semibold text-blue-700 shadow-sm">
                    3 top funds
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  {["Partech", "Kima Ventures", "Alven"].map((fund, index) => (
                    <div key={fund} className="flex items-center justify-between rounded-xl bg-white px-3 py-2 text-sm text-slate-700">
                      <span className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-blue-600" />
                        {fund}
                      </span>
                      <span className="font-semibold text-slate-900">{92 - index * 5}/100</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 space-y-2 rounded-2xl bg-slate-950 p-4 text-sm text-slate-200">
                {previewCopy.bullets.map((item) => (
                  <div key={item} className="flex gap-2">
                    <SearchCheck className="mt-0.5 w-4 h-4 text-blue-300 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="border-y border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-slate-100">
            {[
              { value: "98+", label: l.stats.vcs },
              { value: "35", label: lang === "en" ? "Funds pre-filtered before ranking" : "Fonds pre-filtres avant classement" },
              { value: "0-100", label: lang === "en" ? "Readable compatibility score" : "Score de compatibilite lisible" },
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

      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 max-w-3xl">
            <p className="text-blue-600 text-xs font-bold tracking-[0.2em] uppercase mb-4">{credibilityCopy.badge}</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-4">{credibilityCopy.title}</h2>
            <p className="text-slate-500 leading-relaxed">{credibilityCopy.subtitle}</p>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {trustItems.map((item) => (
              <div key={item.title} className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                <div className="mb-4 inline-flex rounded-2xl bg-blue-100 p-3">{item.icon}</div>
                <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-blue-600 text-xs font-bold tracking-[0.2em] uppercase mb-4">{l.processLabel}</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4 tracking-tight">{l.howTitle}</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">{l.howSubtitle}</p>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {methodItems.map((item) => (
              <div key={item.step} className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 font-semibold text-blue-700">
                    {item.step}
                  </span>
                  <span className="text-xs uppercase tracking-[0.2em] text-slate-300">Alfred</span>
                </div>
                <h3 className="text-xl font-semibold tracking-tight text-slate-900">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMMENT ÇA MARCHE ── */}
      <section className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-blue-600 text-xs font-bold tracking-[0.2em] uppercase mb-4">{pipelineCopy.label}</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4 tracking-tight">{pipelineCopy.title}</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">{pipelineCopy.subtitle}</p>
            <Link href="/how-it-works" className="inline-flex items-center gap-1.5 mt-5 text-sm text-blue-600 hover:text-blue-700 font-medium">
              {t.nav.seeProcess} <ArrowRight className="w-3.5 h-3.5" />
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
      <section className="bg-blue-600 py-24">
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
          <p className="mt-6 text-sm text-slate-400">{footerNote}</p>
        </div>
      </section>
      <MarketingFooter />
    </div>
  );
}
