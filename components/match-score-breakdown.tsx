"use client";

import type { Startup, VentureCapital } from "@/lib/supabase";
import {
  buildMatchFitBreakdown,
  type MatchFitBreakdown,
} from "@/lib/match-fit";
import { getNumberLocale, localizeSector, localizeStage } from "@/lib/taxonomy";

type Lang = "fr" | "en";

function scoreClasses(score: number) {
  if (score >= 90) return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (score >= 75) return "bg-blue-50 text-blue-700 border-blue-200";
  if (score >= 60) return "bg-amber-50 text-amber-700 border-amber-200";
  return "bg-rose-50 text-rose-700 border-rose-200";
}

function buildCopy(lang: Lang) {
  return lang === "en"
    ? {
        title: "Score breakdown",
        subtitle: "Exact data used in the match calculation.",
        labels: {
          thesis: "Thesis",
          stage: "Stage",
          ticket: "Ticket",
          portfolio: "Track record",
        },
        rows: {
          startupSector: "Startup sector",
          fundSectors: "Fund sectors",
          startupStage: "Startup stage",
          fundStages: "Fund stages",
          amountSought: "Amount sought",
          fundRange: "Fund cheque range",
          listedDeals: "Listed investments",
          detectedSignals: "Detected signals",
          source: "Signal source",
          noDeals: "No named investments in the current dataset.",
          noSignals: "No clear overlap detected from the startup narrative.",
          sourceText: "Derived from the fund description, thesis and notable investments stored in Alfred.",
        },
        summaries: {
          thesis: {
            exact: "Exact sector match",
            strong: "Strong thesis overlap",
            broad: "Broad mandate only",
            weak: "Sector misaligned",
          },
          stage: {
            exact: "Exact stage match",
            adjacent: "Adjacent stage",
            broad: "Flexible but indirect",
            weak: "Stage outside range",
          },
          ticket: {
            inside: "Inside cheque range",
            near: "Near cheque range",
            stretch: "Stretch for the fund",
            outside: "Outside cheque range",
          },
          portfolio: {
            high: "Historical pattern supports the match",
            medium: "Some historical support",
            low: "Limited historical support",
          },
        },
      }
    : {
        title: "Détail du score",
        subtitle: "Éléments pris en compte dans le calcul du match.",
        labels: {
          thesis: "Thèse",
          stage: "Stade",
          ticket: "Ticket",
          portfolio: "Portefeuille",
        },
        rows: {
          startupSector: "Secteur de la startup",
          fundSectors: "Secteurs couverts",
          startupStage: "Stade de la startup",
          fundStages: "Stades visés",
          amountSought: "Montant recherché",
          fundRange: "Fourchette de ticket",
          listedDeals: "Participations connues",
          detectedSignals: "Points communs relevés",
          source: "Base utilisée",
          noDeals: "Aucune participation nommée dans les données disponibles.",
          noSignals: "Aucun point commun explicite relevé.",
          sourceText: "Description du fonds, thèse d'investissement et participations connues enregistrées dans Alfred.",
        },
        summaries: {
          thesis: {
            exact: "Alignement sectoriel direct",
            strong: "Alignement sectoriel fort",
            broad: "Alignement sectoriel large",
            weak: "Alignement sectoriel faible",
          },
          stage: {
            exact: "Stade visé",
            adjacent: "Stade proche",
            broad: "Stade possible",
            weak: "Stade peu compatible",
          },
          ticket: {
            inside: "Dans la fourchette",
            near: "Proche de la fourchette",
            stretch: "Fourchette étirée",
            outside: "Hors fourchette",
          },
          portfolio: {
            high: "Historique cohérent",
            medium: "Quelques précédents",
            low: "Peu de précédents",
          },
        },
      };
}

function joinList(items: string[]) {
  return items.length > 0 ? items.join(" · ") : "—";
}

function getPortfolioSummary(copy: ReturnType<typeof buildCopy>, breakdown: MatchFitBreakdown) {
  if (breakdown.portfolioScore >= 85) return copy.summaries.portfolio.high;
  if (breakdown.portfolioScore >= 60) return copy.summaries.portfolio.medium;
  return copy.summaries.portfolio.low;
}

export function MatchScoreBreakdown({
  startup,
  vc,
  lang,
}: {
  startup: Startup;
  vc: VentureCapital;
  lang: Lang;
}) {
  const copy = buildCopy(lang);
  const breakdown = buildMatchFitBreakdown(startup, vc, startup.financial_analysis);
  const locale = getNumberLocale(lang);
  const localizedSector = localizeSector(startup.sector, lang);
  const localizedStage = localizeStage(startup.stage, lang);
  const amount = `${startup.amount_sought.toLocaleString(locale)} €`;
  const minTicket = `${vc.ticket_min.toLocaleString(locale)} €`;
  const maxTicket = `${vc.ticket_max.toLocaleString(locale)} €`;
  const localizedSectors = vc.sectors.map((sector) => localizeSector(sector, lang));
  const localizedStages = vc.stages.map((stage) => localizeStage(stage, lang));

  const factors = [
    {
      key: "thesis",
      label: copy.labels.thesis,
      score: breakdown.sectorScore,
      summary: copy.summaries.thesis[breakdown.sectorFit],
      rows: [
        { label: copy.rows.startupSector, value: localizedSector },
        { label: copy.rows.fundSectors, value: joinList(localizedSectors) },
      ],
    },
    {
      key: "stage",
      label: copy.labels.stage,
      score: breakdown.stageScore,
      summary: copy.summaries.stage[breakdown.stageFit],
      rows: [
        { label: copy.rows.startupStage, value: localizedStage },
        { label: copy.rows.fundStages, value: joinList(localizedStages) },
      ],
    },
    {
      key: "ticket",
      label: copy.labels.ticket,
      score: breakdown.ticketScore,
      summary: copy.summaries.ticket[breakdown.ticketFit],
      rows: [
        { label: copy.rows.amountSought, value: amount },
        { label: copy.rows.fundRange, value: `${minTicket} — ${maxTicket}` },
      ],
    },
    {
      key: "portfolio",
      label: copy.labels.portfolio,
      score: breakdown.portfolioScore,
      summary: getPortfolioSummary(copy, breakdown),
      rows: [
        {
          label: copy.rows.listedDeals,
          value: breakdown.hasPortfolioData ? joinList(breakdown.notableCompanies) : copy.rows.noDeals,
        },
        {
          label: copy.rows.detectedSignals,
          value: breakdown.matchedKeywords.length > 0
            ? joinList(breakdown.matchedKeywords)
            : copy.rows.noSignals,
        },
        { label: copy.rows.source, value: copy.rows.sourceText },
      ],
    },
  ] as const;

  return (
    <div className="mt-4 rounded-[1.5rem] border border-slate-200/80 bg-slate-50/70 p-4">
      <p className="eyebrow mb-1">{copy.title}</p>
      <p className="mb-3 text-xs text-slate-500">{copy.subtitle}</p>
      <div className="grid gap-3 sm:grid-cols-2">
        {factors.map((factor) => (
          <div key={factor.key} className="rounded-2xl border border-slate-200/70 bg-white/90 p-3">
            <div className="mb-2 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-900">{factor.label}</p>
                <p className="text-[11px] text-slate-500">{factor.summary}</p>
              </div>
              <span
                className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold ${scoreClasses(
                  factor.score
                )}`}
              >
                {factor.score}/100
              </span>
            </div>
            <div className="space-y-1.5">
              {factor.rows.map((row) => (
                <div key={row.label} className="text-xs leading-5">
                  <span className="font-medium text-slate-700">{row.label}:</span>{" "}
                  <span className="text-slate-500">{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
