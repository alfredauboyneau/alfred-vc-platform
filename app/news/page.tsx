"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowUpRight, Newspaper, Radio, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LanguageToggle, useLanguage } from "@/lib/i18n";
import { NavbarLoginButton } from "@/components/navbar-login-button";
import { MarketingFooter } from "@/components/marketing-footer";
import {
  FundingNewsArticle,
  fundingNewsFallbackArticles,
  fundingNewsSources,
} from "@/lib/news-feed";

export default function NewsPage() {
  const { t, lang } = useLanguage();
  const [articles, setArticles] = useState<FundingNewsArticle[]>(fundingNewsFallbackArticles);

  useEffect(() => {
    document.title = lang === "en" ? "Alfred · Funding news" : "Alfred · News des levées";
  }, [lang]);

  useEffect(() => {
    let cancelled = false;

    async function loadLiveNews() {
      try {
        const response = await fetch("/api/news-feed", { cache: "no-store" });

        if (!response.ok) {
          throw new Error(`News feed failed with status ${response.status}`);
        }

        const data = await response.json();

        if (cancelled || !Array.isArray(data.articles) || data.articles.length === 0) {
          return;
        }

        setArticles(data.articles);
      } catch (error) {
        console.error("[news-page] feed load failed", error);
      }
    }

    loadLiveNews();

    return () => {
      cancelled = true;
    };
  }, []);

  const copy =
    lang === "en"
      ? {
          badge: "Funding news",
          title: "Funding news",
          subtitle:
            "A simple selection of recent funding stories and useful reading for founders following the French and European startup market.",
          sectionArticles: "Recent news",
          sectionArticlesTitle: "Recent funding stories worth reading",
          sectionArticlesDesc:
            "A simple press selection with direct links to the original articles.",
          openArticle: "Open article",
          sourceLabel: "Source",
          languageFr: "FR source",
          languageEn: "EN source",
          sectionSources: "Useful sources",
          sectionSourcesTitle: "Publications worth keeping open",
          sectionSourcesDesc:
            "A short list of media covering startup funding and the broader tech ecosystem.",
          note:
            "This page is a press selection intended to help visitors keep an eye on recent funding news.",
          cta: "Run an analysis",
        }
      : {
          badge: "News des levées",
          title: "News des levées",
          subtitle:
            "Une sélection simple d'articles récents et de lectures utiles pour les fondateurs qui suivent le marché startup français et européen.",
          sectionArticles: "Articles récents",
          sectionArticlesTitle: "Les levées récentes à lire",
          sectionArticlesDesc:
            "Une sélection de presse simple, avec un lien direct vers l'article source.",
          openArticle: "Lire l'article",
          sourceLabel: "Source",
          languageFr: "Source FR",
          languageEn: "Source EN",
          sectionSources: "Sources utiles",
          sectionSourcesTitle: "Quelques médias à garder ouverts",
          sectionSourcesDesc:
            "Une courte liste de médias qui couvrent les levées et, plus largement, l'écosystème tech.",
          note:
            "Cette page propose simplement une sélection de presse utile pour suivre les levées récentes.",
          cta: "Analyser ma startup",
        };

  const formatDate = (date: string) =>
    new Intl.DateTimeFormat(lang === "en" ? "en-US" : "fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(date));

  return (
    <div className="min-h-screen bg-white">
      <nav className="sticky top-0 z-50 border-b border-slate-100/80 bg-white/80 backdrop-blur-2xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 shadow-sm">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900">Alfred</span>
          </Link>
          <div className="hidden items-center gap-1 sm:flex">
            <Link href="/how-it-works">
              <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900">
                {t.nav.howItWorks}
              </Button>
            </Link>
            <Link href="/news">
              <Button variant="ghost" size="sm" className="font-semibold text-blue-600">
                {t.nav.news}
              </Button>
            </Link>
            <Link href="/about">
              <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900">
                {t.nav.about}
              </Button>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <NavbarLoginButton className="text-slate-600 hover:text-slate-900" />
            <Link href="/startup/submit">
              <Button
                variant="outline"
                size="sm"
                className="hidden gap-1.5 border-blue-200 font-semibold text-blue-700 hover:bg-blue-50 sm:flex"
              >
                {t.nav.isStartup}
              </Button>
            </Link>
            <Link href="/vc/register">
              <Button size="sm" className="hidden gap-1.5 bg-blue-600 font-semibold text-white shadow-sm hover:bg-blue-700 sm:flex">
                {t.nav.isVC}
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <section className="marketing-surface relative overflow-hidden pb-16 pt-20">
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              "linear-gradient(#e2e8f0 1px, transparent 1px), linear-gradient(to right, #e2e8f0 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
        <div className="pointer-events-none absolute left-1/2 top-0 h-[240px] w-[580px] -translate-x-1/2 rounded-full bg-blue-100/70 blur-[90px]" />

        <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/90 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-blue-700 shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
            {copy.badge}
          </div>

          <h1 className="headline-balance mb-5 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            {copy.title}
          </h1>
          <p className="mx-auto max-w-3xl text-lg leading-relaxed text-slate-500 sm:text-xl">
            {copy.subtitle}
          </p>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 max-w-3xl">
            <p className="eyebrow mb-3">{copy.sectionArticles}</p>
            <h2 className="headline-balance text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              {copy.sectionArticlesTitle}
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-500 sm:text-lg">{copy.sectionArticlesDesc}</p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {articles.map((article) => (
              <article
                key={article.id}
                className="premium-card rounded-[28px] border border-slate-200/70 p-7 shadow-[0_18px_60px_rgba(15,23,42,0.05)]"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold uppercase tracking-widest text-slate-600">
                    <Newspaper className="h-3.5 w-3.5 text-blue-600" />
                    {article.source}
                  </div>
                  <span className="text-sm text-slate-400">{formatDate(article.publishedAt)}</span>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700">
                    {article.sourceLang === "fr" ? copy.languageFr : copy.languageEn}
                  </span>
                </div>

                <div className="mt-5">
                  <h3 className="text-2xl font-semibold tracking-tight text-slate-950">{article.title}</h3>
                  <p className="mt-3 text-base leading-7 text-slate-500">{article.excerpt}</p>
                </div>

                <div className="mt-7 flex items-center justify-between gap-4 border-t border-slate-100 pt-5">
                  <a
                    href={article.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-slate-400 transition-colors hover:text-slate-600"
                  >
                    {copy.sourceLabel}: {article.source}
                  </a>
                  <a
                    href={article.articleUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 transition-colors hover:text-blue-900"
                  >
                    {copy.openArticle}
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50/80 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 max-w-3xl">
            <p className="eyebrow mb-3">{copy.sectionSources}</p>
            <h2 className="headline-balance text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              {copy.sectionSourcesTitle}
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-500 sm:text-lg">{copy.sectionSourcesDesc}</p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {fundingNewsSources.map((source) => (
              <a
                key={source.name}
                href={source.url}
                target="_blank"
                rel="noreferrer"
                className="premium-card group rounded-[26px] border border-slate-200/70 bg-white p-6 transition-all hover:-translate-y-0.5 hover:border-blue-100"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xl font-semibold tracking-tight text-slate-950">{source.name}</p>
                    <p className="mt-3 text-sm leading-6 text-slate-500">
                      {lang === "en" ? source.focusEn : source.focusFr}
                    </p>
                  </div>
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-blue-50 transition-colors group-hover:bg-blue-100">
                    <Radio className="h-4.5 w-4.5 text-blue-700" />
                  </div>
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  {source.name === "Financial Times" || source.name === "Les Echos Start" ? (
                    <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600">
                      {lang === "en" ? "Business press" : "Presse business"}
                    </span>
                  ) : (
                    <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600">
                      {lang === "en" ? "Tech press" : "Presse tech"}
                    </span>
                  )}
                </div>
                <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-blue-700">
                  {source.name}
                  <ArrowUpRight className="h-4 w-4" />
                </div>
              </a>
            ))}
          </div>

          <div className="mt-10 flex flex-col gap-4 rounded-[28px] bg-slate-950 px-6 py-6 text-slate-200 sm:flex-row sm:items-center sm:justify-between sm:px-8">
            <p className="max-w-3xl text-sm leading-6 text-slate-300">{copy.note}</p>
            <Link href="/startup/submit">
              <Button className="h-11 bg-blue-600 px-5 font-semibold text-white hover:bg-blue-700">{copy.cta}</Button>
            </Link>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
