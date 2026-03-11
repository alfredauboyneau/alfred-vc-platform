"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  CheckCircle2,
  XCircle,
  Zap,
  Users,
  Brain,
  Target,
  BarChart3,
  Linkedin,
} from "lucide-react";
import { useLanguage, LanguageToggle } from "@/lib/i18n";
import { NavbarLoginButton } from "@/components/navbar-login-button";

export default function AboutPage() {
  const { t } = useLanguage();

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
            <Link href="/vc/register">
              <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900">{t.nav.isVC}</Button>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <NavbarLoginButton />
            <Link href="/startup/submit">
              <Button size="sm" className="hidden sm:flex gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm">
                Analyser ma startup <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
        <Badge variant="outline" className="mb-6 text-blue-600 border-blue-200 bg-blue-50">
          Notre histoire
        </Badge>
        <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6 leading-tight tracking-tight">
          Fondé par un entrepreneur,{" "}
          <span className="text-blue-600">pour les entrepreneurs</span>
        </h1>
        <p className="text-lg text-slate-500 leading-relaxed mb-10 max-w-2xl mx-auto">
          Alfred est né d&apos;une frustration réelle : trop de startups prometteuses échouent à lever,
          non pas par manque de qualité, mais par manque de visibilité auprès des bons investisseurs.
        </p>
        <div className="flex gap-3 flex-wrap justify-center">
          <Link href="/startup/submit">
            <Button size="lg" className="gap-2">
              Analyser ma startup <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="/vc/register">
            <Button size="lg" variant="outline" className="gap-2">
              Accéder au deal flow <Users className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* ── Comment ça marche ── */}
      <section className="bg-slate-50 py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <Badge variant="outline" className="mb-4 text-blue-600 border-blue-200 bg-blue-50">
              Le produit
            </Badge>
            <h2 className="text-3xl font-bold text-slate-900 mb-5 tracking-tight">
              Comment Alfred fonctionne
            </h2>
            <p className="text-slate-500 text-lg leading-relaxed max-w-3xl mx-auto">
              Alfred connecte l&apos;IA de pointe d&apos;Anthropic (Claude) à une base de données de 98+ fonds
              de VC français. En quelques minutes, votre startup est analysée financièrement et mise
              en face des investisseurs dont la thèse d&apos;investissement lui correspond vraiment —
              pas une liste générique, mais un matching précis basé sur les critères réels de chaque fonds.
            </p>
          </div>

          {/* Chiffres clés */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-16">
            {[
              { value: "98+", label: "VCs français référencés" },
              { value: "< 2 min", label: "Pour être analysé par l'IA" },
              { value: "100 %", label: "Analyse pilotée par IA" },
              { value: "0", label: "Cold email non ciblé" },
            ].map((stat) => (
              <div key={stat.label} className="bg-white rounded-2xl border border-slate-100 p-6 text-center shadow-sm">
                <p className="text-3xl font-bold mb-1 text-blue-600">{stat.value}</p>
                <p className="text-xs text-slate-500 leading-tight">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* 3 étapes */}
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                icon: <BarChart3 className="w-6 h-6 text-blue-600" />,
                step: "1",
                title: "Soumettez votre profil",
                desc: "Renseignez les infos de votre startup et vos données financières (MRR, burn rate, traction…). L'IA s'adapte même si vous n'avez pas encore de revenus.",
              },
              {
                icon: <Brain className="w-6 h-6 text-blue-600" />,
                step: "2",
                title: "Claude analyse votre dossier",
                desc: "Le modèle IA d'Anthropic génère un rapport complet : score de santé financière (0-100), forces, risques, unit economics et niveau de maturité pour les investisseurs.",
              },
              {
                icon: <Target className="w-6 h-6 text-blue-600" />,
                step: "3",
                title: "Trouvez vos bons VCs",
                desc: "Alfred compare votre profil avec la thèse de chaque fonds. Vous obtenez une liste de VCs matchés, triés par score de compatibilité, avec leurs coordonnées directes.",
              },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                    {item.icon}
                  </div>
                  <span className="text-xs font-bold text-blue-400 tracking-widest uppercase">Étape {item.step}</span>
                </div>
                <h3 className="font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Problème / Solution ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
            Le problème qu&apos;Alfred résout
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 gap-8">
          <div className="bg-red-50 border border-red-100 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                <XCircle className="w-5 h-5 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Sans Alfred</h3>
            </div>
            <ul className="space-y-3">
              {[
                "Des centaines de cold emails envoyés dans le vide par les fondateurs",
                "Des semaines perdues à identifier les bons VCs",
                "Des dossiers rejetés non par manque de qualité, mais d'adéquation",
                "Pas d'analyse financière structurée avant de pitcher",
                "Aucune visibilité sur pourquoi un fonds ne répond pas",
              ].map((p, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 shrink-0" />
                  <span className="text-slate-600 text-sm leading-relaxed">{p}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Avec Alfred</h3>
            </div>
            <ul className="space-y-3">
              {[
                "Une analyse IA complète de la santé financière de votre startup",
                "Un matching intelligent avec les fonds dont la thèse correspond vraiment",
                "Un score de compatibilité de 0 à 100 par fonds, avec justification",
                "Un rapport structuré, prêt à partager avec les investisseurs",
                "Accès direct aux coordonnées des fonds les plus pertinents",
              ].map((s, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                  <span className="text-slate-600 text-sm leading-relaxed">{s}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── L'équipe ── */}
      <section className="bg-slate-50 py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 text-blue-600 border-blue-200 bg-blue-50">
              L&apos;équipe
            </Badge>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
              Derrière Alfred
            </h2>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 flex flex-col sm:flex-row items-center sm:items-start gap-8">
            {/* Avatar initiales */}
            <div className="shrink-0">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-md">
                <span className="text-white text-2xl font-bold tracking-tight">AA</span>
              </div>
            </div>
            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start mb-3">
                <span className="text-xl font-bold text-slate-900">Alfred Auboyneau</span>
                <span className="text-sm text-blue-600 font-semibold bg-blue-50 px-2.5 py-0.5 rounded-full">
                  Fondateur &amp; CEO
                </span>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed">
                Entrepreneur et passionné de technologie, Alfred a créé cette plateforme après avoir
                observé de près les difficultés des startups françaises à trouver les bons investisseurs.
                Convaincu que l&apos;IA peut radicalement améliorer ce processus, il a construit Alfred
                pour mettre l&apos;intelligence artificielle au service des fondateurs — et rendre le
                financement VC plus accessible et plus efficace pour tous.
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
          <p className="text-blue-200 text-sm font-semibold tracking-widest uppercase mb-4">
            Notre mission
          </p>
          <p className="text-white text-2xl sm:text-3xl font-bold leading-relaxed">
            &ldquo;Démocratiser l&apos;accès au financement VC en France en mettant
            l&apos;intelligence artificielle au service des fondateurs.&rdquo;
          </p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-slate-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-sm">Alfred</span>
          </div>
          <p className="text-xs text-slate-400">{t.landing.footerCopyright}</p>
          <div className="flex gap-4 text-xs text-slate-400">
            <Link href="/about" className="hover:text-slate-700">{t.nav.about}</Link>
            <Link href="/startup/submit" className="hover:text-slate-700">{t.landing.footerStartups}</Link>
            <Link href="/vc/register" className="hover:text-slate-700">{t.landing.footerInvestors}</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
