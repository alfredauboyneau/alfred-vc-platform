"use client";

import type { Startup, VentureCapital } from "@/lib/supabase";
import {
  buildMatchFitBreakdown,
  getFactorTone,
  type FactorTone,
} from "@/lib/match-fit";
import { getNumberLocale, localizeSector, localizeStage } from "@/lib/taxonomy";

type Lang = "fr" | "en";

function toneClasses(tone: FactorTone) {
  if (tone === "strong") return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (tone === "good") return "bg-blue-50 text-blue-700 border-blue-200";
  if (tone === "mixed") return "bg-amber-50 text-amber-700 border-amber-200";
  return "bg-rose-50 text-rose-700 border-rose-200";
}

function buildCopy(lang: Lang) {
  return lang === "en"
    ? {
        title: "Why this score",
        labels: {
          thesis: "Thesis",
          stage: "Stage",
          ticket: "Ticket",
          portfolio: "Track record",
        },
        tones: {
          strong: "Very strong",
          good: "Solid",
          mixed: "Partial",
          weak: "Weak",
        },
        thesis: {
          exact: (sector: string) => `The stated thesis clearly covers ${sector}.`,
          strong: (sector: string) => `The fund's focus is strongly aligned with ${sector}.`,
          broad: "The mandate looks broad enough, but this is not a natural core fit.",
          weak: "The stated thesis points to a different core focus.",
        },
        stage: {
          exact: (stage: string) => `${stage} is directly inside the fund's target stage.`,
          adjacent: (stage: string) => `${stage} is close to the fund's usual entry point, but not exact.`,
          broad: "The fund appears flexible on stage, though this is not a direct fit.",
          weak: "The startup stage sits outside the fund's usual range.",
        },
        ticket: {
          inside: (amount: string, min: string, max: string) =>
            `${amount} sits inside the typical cheque range of ${min} to ${max}.`,
          near: (amount: string, min: string, max: string) =>
            `${amount} is close to the usual cheque range of ${min} to ${max}.`,
          stretch: (amount: string, min: string, max: string) =>
            `${amount} is possible, but stretched versus the usual range of ${min} to ${max}.`,
          outside: (amount: string, min: string, max: string) =>
            `${amount} sits materially outside the typical cheque range of ${min} to ${max}.`,
        },
        portfolio: {
          strong: (names: string) =>
            `Past investments such as ${names} reinforce a real pattern for this kind of company.`,
          good: (names: string) =>
            `The historical portfolio, including ${names}, points to credible precedent.`,
          mixed: (names: string) =>
            `There is some precedent in the portfolio, including ${names}, but not a clean pattern.`,
          weak: (names: string) =>
            `The historical portfolio, including ${names}, suggests a different investing pattern.`,
          limited: "Portfolio history is limited here, so the match relies mostly on the current thesis.",
        },
      }
    : {
        title: "Pourquoi ce score",
        labels: {
          thesis: "Thèse",
          stage: "Stade",
          ticket: "Ticket",
          portfolio: "Historique portefeuille",
        },
        tones: {
          strong: "Très fort",
          good: "Solide",
          mixed: "Partiel",
          weak: "Faible",
        },
        thesis: {
          exact: (sector: string) => `La thèse affichée couvre clairement ${sector}.`,
          strong: (sector: string) => `Le focus du fonds est fortement aligné avec ${sector}.`,
          broad: "Le mandat semble assez large, mais ce n'est pas un fit naturel de premier ordre.",
          weak: "La thèse affichée pointe vers un coeur de cible différent.",
        },
        stage: {
          exact: (stage: string) => `${stage} entre directement dans la zone de stage du fonds.`,
          adjacent: (stage: string) => `${stage} est proche du point d'entrée habituel du fonds, sans être exact.`,
          broad: "Le fonds semble souple sur le stade, mais ce n'est pas un fit direct.",
          weak: "Le stade de la startup sort du range habituel du fonds.",
        },
        ticket: {
          inside: (amount: string, min: string, max: string) =>
            `${amount} est dans le range de ticket habituel, entre ${min} et ${max}.`,
          near: (amount: string, min: string, max: string) =>
            `${amount} est proche du range de ticket habituel, entre ${min} et ${max}.`,
          stretch: (amount: string, min: string, max: string) =>
            `${amount} reste envisageable, mais tire le range habituel de ${min} à ${max}.`,
          outside: (amount: string, min: string, max: string) =>
            `${amount} est nettement en dehors du range de ticket habituel, entre ${min} et ${max}.`,
        },
        portfolio: {
          strong: (names: string) =>
            `Des investissements passés comme ${names} confirment un pattern réel pour ce type de société.`,
          good: (names: string) =>
            `L'historique du portefeuille, avec notamment ${names}, montre un précédent crédible.`,
          mixed: (names: string) =>
            `Le portefeuille montre quelques précédents, dont ${names}, sans pattern totalement net.`,
          weak: (names: string) =>
            `L'historique du portefeuille, dont ${names}, suggère plutôt un pattern d'investissement différent.`,
          limited: "L'historique portefeuille est limité ici, donc le fit repose surtout sur la thèse actuelle.",
        },
      };
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
  const notableNames = breakdown.notableCompanies.slice(0, 2).join(" / ");

  const factors = [
    {
      key: "thesis",
      label: copy.labels.thesis,
      tone: getFactorTone(breakdown.sectorScore),
      detail:
        breakdown.sectorFit === "exact"
          ? copy.thesis.exact(localizedSector)
          : breakdown.sectorFit === "strong"
          ? copy.thesis.strong(localizedSector)
          : breakdown.sectorFit === "broad"
          ? copy.thesis.broad
          : copy.thesis.weak,
    },
    {
      key: "stage",
      label: copy.labels.stage,
      tone: getFactorTone(breakdown.stageScore),
      detail:
        breakdown.stageFit === "exact"
          ? copy.stage.exact(localizedStage)
          : breakdown.stageFit === "adjacent"
          ? copy.stage.adjacent(localizedStage)
          : breakdown.stageFit === "broad"
          ? copy.stage.broad
          : copy.stage.weak,
    },
    {
      key: "ticket",
      label: copy.labels.ticket,
      tone: getFactorTone(breakdown.ticketScore),
      detail:
        breakdown.ticketFit === "inside"
          ? copy.ticket.inside(amount, minTicket, maxTicket)
          : breakdown.ticketFit === "near"
          ? copy.ticket.near(amount, minTicket, maxTicket)
          : breakdown.ticketFit === "stretch"
          ? copy.ticket.stretch(amount, minTicket, maxTicket)
          : copy.ticket.outside(amount, minTicket, maxTicket),
    },
    {
      key: "portfolio",
      label: copy.labels.portfolio,
      tone: getFactorTone(breakdown.portfolioScore),
      detail: !breakdown.hasPortfolioData || !notableNames
        ? copy.portfolio.limited
        : breakdown.portfolioScore >= 90
        ? copy.portfolio.strong(notableNames)
        : breakdown.portfolioScore >= 75
        ? copy.portfolio.good(notableNames)
        : breakdown.portfolioScore >= 60
        ? copy.portfolio.mixed(notableNames)
        : copy.portfolio.weak(notableNames),
    },
  ] as const;

  return (
    <div className="mt-4 rounded-[1.5rem] border border-slate-200/80 bg-slate-50/70 p-4">
      <p className="eyebrow mb-3">{copy.title}</p>
      <div className="grid gap-3 sm:grid-cols-2">
        {factors.map((factor) => (
          <div key={factor.key} className="rounded-2xl border border-slate-200/70 bg-white/90 p-3">
            <div className="mb-2 flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-slate-900">{factor.label}</p>
              <span
                className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold ${toneClasses(
                  factor.tone
                )}`}
              >
                {copy.tones[factor.tone]}
              </span>
            </div>
            <p className="text-xs leading-5 text-slate-500">{factor.detail}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
