"use client";

import Link from "next/link";
import { ArrowLeft, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LanguageToggle } from "@/lib/i18n";
import { MarketingFooter } from "@/components/marketing-footer";

type Section = {
  title: string;
  paragraphs: string[];
};

export function LegalPageShell({
  eyebrow,
  title,
  intro,
  sections,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  sections: Section[];
}) {
  return (
    <div className="min-h-screen bg-white">
      <nav className="sticky top-0 z-50 border-b border-slate-100 bg-white/90 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-sm">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg text-slate-900 tracking-tight">Alfred</span>
            </Link>
          </div>
          <LanguageToggle />
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-3xl">
          <p className="text-blue-600 text-xs font-bold tracking-[0.2em] uppercase mb-4">{eyebrow}</p>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 mb-6">{title}</h1>
          <p className="text-lg text-slate-500 leading-relaxed">{intro}</p>
        </div>

        <div className="mt-12 space-y-8">
          {sections.map((section) => (
            <section key={section.title} className="rounded-3xl border border-slate-200 bg-slate-50 p-8">
              <h2 className="text-xl font-semibold text-slate-900">{section.title}</h2>
              <div className="mt-4 space-y-4">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="text-sm leading-relaxed text-slate-600">
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>

      <MarketingFooter />
    </div>
  );
}
