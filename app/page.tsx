"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

export default function Home() {
  const { t } = useLanguage();
  const l = t.landing;

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="border-b border-gray-100 sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl">Alfred</span>
          </div>
          <div className="flex items-center gap-3">
            <LanguageToggle />
            <Link href="/vc/register">
              <Button variant="ghost" size="sm">{t.nav.isVC}</Button>
            </Link>
            <Link href="/startup/submit">
              <Button size="sm">{l.ctaStartup}</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
        <Badge variant="info" className="mb-6">{l.badge}</Badge>
        <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6 leading-tight">
          {l.titlePart1} <span className="text-blue-600">{l.titleHighlight}</span>
          <br />{l.titlePart2}
        </h1>
        <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto">{l.subtitle}</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/startup/submit">
            <Button size="lg" className="gap-2">
              {l.ctaStartup} <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="/vc/register">
            <Button size="lg" variant="outline" className="gap-2">
              {l.ctaVC} <Users className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
            {[
              { value: "98+", label: l.stats.vcs },
              { value: "< 5 min", label: l.stats.time },
              { value: "IA", label: l.stats.ai },
              { value: "100%", label: l.stats.matching },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl font-bold text-blue-600">{stat.value}</div>
                <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comment ça marche */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{l.howTitle}</h2>
          <p className="text-gray-500 max-w-xl mx-auto">{l.howSubtitle}</p>
        </div>
        <div className="grid sm:grid-cols-3 gap-10">
          {[
            { step: "01", icon: <BarChart3 className="w-6 h-6 text-blue-600" />, ...l.steps[0] },
            { step: "02", icon: <Brain className="w-6 h-6 text-blue-600" />, ...l.steps[1] },
            { step: "03", icon: <Target className="w-6 h-6 text-blue-600" />, ...l.steps[2] },
          ].map((item) => (
            <div key={item.step} className="relative">
              <div className="text-6xl font-bold text-gray-100 absolute -top-4 -left-2 select-none">
                {item.step}
              </div>
              <div className="relative pt-6">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
                  {item.icon}
                </div>
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pour les VCs */}
      <section className="bg-blue-600 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="bg-blue-500 text-white mb-6">{l.vcSectionBadge}</Badge>
              <h2 className="text-3xl font-bold text-white mb-6">
                {l.vcSectionTitle}<br />{l.vcSectionTitle2}
              </h2>
              <p className="text-blue-100 mb-8">{l.vcSectionDesc}</p>
              <Link href="/vc/register">
                <Button size="lg" variant="outline" className="bg-white text-blue-600 hover:bg-blue-50 border-white gap-2">
                  {l.vcSectionCta} <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
            <div className="space-y-4">
              {l.vcFeatures.map((item) => (
                <div key={item} className="flex items-center gap-3 text-white">
                  <CheckCircle2 className="w-5 h-5 text-blue-200 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">{l.ctaTitle}</h2>
        <p className="text-gray-500 mb-8 max-w-lg mx-auto">{l.ctaDesc}</p>
        <Link href="/startup/submit">
          <Button size="lg" className="gap-2">
            {l.ctaBtn} <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-sm">Alfred</span>
          </div>
          <p className="text-xs text-gray-400">{l.footerCopyright}</p>
          <div className="flex gap-4 text-xs text-gray-400">
            <Link href="/startup/submit" className="hover:text-gray-700">{l.footerStartups}</Link>
            <Link href="/vc/register" className="hover:text-gray-700">{l.footerInvestors}</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
