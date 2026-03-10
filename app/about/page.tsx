"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, CheckCircle2, XCircle, Zap, Users } from "lucide-react";
import { useLanguage, LanguageToggle } from "@/lib/i18n";

export default function AboutPage() {
  const { t } = useLanguage();
  const a = t.about;

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="border-b border-slate-100 sticky top-0 bg-white/90 backdrop-blur-md z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight">Alfred</span>
          </Link>
          <div className="flex items-center gap-3">
            <LanguageToggle />
            <Link href="/about">
              <Button variant="ghost" size="sm" className="text-blue-600 font-medium">{t.nav.about}</Button>
            </Link>
            <Link href="/vc/register">
              <Button variant="ghost" size="sm">{t.nav.isVC}</Button>
            </Link>
            <Link href="/startup/submit">
              <Button size="sm">{a.ctaStartup}</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <Badge variant="outline" className="mb-6 text-blue-600 border-blue-200 bg-blue-50">
              {a.badge}
            </Badge>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6 leading-tight tracking-tight">
              {a.title}{" "}
              <span className="text-blue-600">{a.titleHighlight}</span>
            </h1>
            <p className="text-lg text-slate-500 leading-relaxed mb-8">
              {a.subtitle}
            </p>
            <div className="flex gap-3 flex-wrap">
              <Link href="/startup/submit">
                <Button size="lg" className="gap-2">
                  {a.ctaStartup} <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/vc/register">
                <Button size="lg" variant="outline" className="gap-2">
                  {a.ctaVC} <Users className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Photo fondateur */}
          <div className="flex flex-col items-center lg:items-end">
            <div className="relative">
              <div className="w-72 h-80 rounded-2xl overflow-hidden shadow-2xl ring-1 ring-slate-200">
                <Image
                  src="/alfred.jpg"
                  alt={a.founderName}
                  fill
                  className="object-cover object-top"
                  priority
                />
              </div>
              {/* Badge nom */}
              <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-lg border border-slate-100 px-4 py-3">
                <p className="font-semibold text-slate-900 text-sm">{a.founderName}</p>
                <p className="text-xs text-slate-500">{a.founderRole}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="bg-slate-50 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-8 tracking-tight">{a.storyTitle}</h2>
          <div className="space-y-5">
            <p className="text-slate-600 leading-relaxed text-lg">{a.storyP1}</p>
            <p className="text-slate-600 leading-relaxed text-lg">{a.storyP2}</p>
          </div>
        </div>
      </section>

      {/* Problème / Solution */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid sm:grid-cols-2 gap-12">
          {/* Problème */}
          <div className="bg-red-50 border border-red-100 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                <XCircle className="w-5 h-5 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">{a.problemTitle}</h3>
            </div>
            <ul className="space-y-3">
              {a.problems.map((p, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 shrink-0" />
                  <span className="text-slate-600 text-sm leading-relaxed">{p}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Solution */}
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">{a.solutionTitle}</h3>
            </div>
            <ul className="space-y-3">
              {a.solutions.map((s, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                  <span className="text-slate-600 text-sm leading-relaxed">{s}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="bg-blue-600 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-blue-200 text-sm font-semibold tracking-widest uppercase mb-4">{a.missionTitle}</p>
          <p className="text-white text-2xl sm:text-3xl font-bold leading-relaxed">
            "{a.missionDesc}"
          </p>
        </div>
      </section>

      {/* Footer */}
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
