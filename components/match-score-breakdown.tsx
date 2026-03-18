import type { Startup, VentureCapital } from "@/lib/supabase";
import {
  buildMatchFitBreakdown,
  getFactorTone,
  type MatchFitBreakdown,
} from "@/lib/match-fit";
import { getNumberLocale, localizeSector, localizeStage } from "@/lib/taxonomy";

type Lang = "fr" | "en";

function scoreClasses(score: number) {
  if (score >= 90) return "border-emerald-200 bg-emerald-50 text-emerald-700";
  if (score >= 75) return "border-blue-200 bg-blue-50 text-blue-700";
  if (score >= 60) return "border-amber-200 bg-amber-50 text-amber-700";
  return "border-rose-200 bg-rose-50 text-rose-700";
}

function factorCardClasses(score: number) {
  const tone = getFactorTone(score);

  if (tone === "strong") return "border-emerald-200/80 bg-white";
  if (tone === "good") return "border-blue-200/80 bg-white";
  if (tone === "mixed") return "border-amber-200/80 bg-white";
  return "border-rose-200/80 bg-white";
}

function factorBarClasses(score: number) {
  const tone = getFactorTone(score);

  if (tone === "strong") return "bg-emerald-500";
  if (tone === "good") return "bg-blue-500";
  if (tone === "mixed") return "bg-amber-500";
  return "bg-rose-500";
}

function scoreBarClasses(score: number) {
  if (score >= 90) return "bg-emerald-400";
  if (score >= 75) return "bg-blue-400";
  if (score >= 60) return "bg-amber-400";
  return "bg-rose-400";
}

function formatList(items: string[], lang: Lang) {
  if (items.length === 0) return "";

  return new Intl.ListFormat(lang === "fr" ? "fr-FR" : "en-US", {
    style: "long",
    type: "conjunction",
  }).format(items);
}

function getScoreBandLabel(score: number, copy: ReturnType<typeof buildCopy>) {
  if (score >= 92) return copy.bands.exceptional;
  if (score >= 84) return copy.bands.veryStrong;
  if (score >= 72) return copy.bands.solid;
  if (score >= 60) return copy.bands.partial;
  return copy.bands.limited;
}

function getAlignedFactors(copy: ReturnType<typeof buildCopy>, breakdown: MatchFitBreakdown) {
  const aligned: string[] = [];
  const mixed: string[] = [];

  if (breakdown.sectorScore >= 84) aligned.push(copy.summaryFactors.sector);
  else if (breakdown.sectorScore >= 66) mixed.push(copy.summaryFactors.sector);

  if (breakdown.stageScore >= 74) aligned.push(copy.summaryFactors.stage);
  else if (breakdown.stageScore >= 70) mixed.push(copy.summaryFactors.stage);

  if (breakdown.ticketScore >= 80) aligned.push(copy.summaryFactors.ticket);
  else if (breakdown.ticketScore >= 58) mixed.push(copy.summaryFactors.ticket);

  if (breakdown.portfolioScore >= 78) aligned.push(copy.summaryFactors.portfolio);
  else if (breakdown.portfolioScore >= 60) mixed.push(copy.summaryFactors.portfolio);

  return { aligned, mixed };
}

function getPrimaryReservation(copy: ReturnType<typeof buildCopy>, breakdown: MatchFitBreakdown) {
  if (breakdown.sectorFit === "weak") return copy.reservations.sector;
  if (breakdown.stageFit === "weak") return copy.reservations.stage;
  if (breakdown.ticketFit === "outside") return copy.reservations.ticketOutside;
  if (breakdown.ticketFit === "stretch") return copy.reservations.ticketStretch;
  if (breakdown.portfolioScore < 60) return copy.reservations.portfolio;
  if (breakdown.stageFit === "broad") return copy.reservations.stageBroad;

  return null;
}

function buildCopy(lang: Lang) {
  return lang === "en"
    ? {
        title: "Score review",
        subtitle: "The score is derived from the exact data points below.",
        header: {
          eyebrow: "Compatibility score",
          scoreLabel: "Overall score",
          alignments: "Key alignments",
          reservation: "Main constraint",
          noReservation: "No major reservation on the core fit criteria.",
        },
        bands: {
          exceptional: "Exceptional compatibility",
          veryStrong: "Very strong compatibility",
          solid: "Solid compatibility",
          partial: "Partial compatibility",
          limited: "Limited compatibility",
        },
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
        summaryFactors: {
          sector: "sector thesis",
          stage: "stage",
          ticket: "cheque range",
          portfolio: "track record",
        },
        reservations: {
          sector: "Sector thesis is weakly aligned.",
          stage: "Stage is outside the fund's core focus.",
          stageBroad: "Stage remains possible, but not clearly prioritised.",
          ticketStretch: "Cheque size looks possible, but stretched.",
          ticketOutside: "Cheque size is outside the usual range.",
          portfolio: "Comparable investments remain limited.",
        },
        noAlignment: "No strong signal emerges on the main fit criteria.",
      }
    : {
        title: "Lecture du score",
        subtitle: "Le score repose sur les éléments factuels ci-dessous.",
        header: {
          eyebrow: "Score de compatibilité",
          scoreLabel: "Score global",
          alignments: "Alignements clés",
          reservation: "Point de vigilance",
          noReservation: "Aucune réserve majeure sur les critères structurants.",
        },
        bands: {
          exceptional: "Compatibilité exceptionnelle",
          veryStrong: "Compatibilité très forte",
          solid: "Compatibilité solide",
          partial: "Compatibilité partielle",
          limited: "Compatibilité limitée",
        },
        labels: {
          thesis: "Thèse",
          stage: "Stade",
          ticket: "Ticket",
          portfolio: "Historique des investissements",
        },
        rows: {
          startupSector: "Secteur de la startup",
          fundSectors: "Secteurs couverts",
          startupStage: "Stade de la startup",
          fundStages: "Stades visés",
          amountSought: "Montant recherché",
          fundRange: "Fourchette de ticket",
          listedDeals: "Participations connues",
          detectedSignals: "Signaux comparables",
          noDeals: "Aucune participation nommée dans les données disponibles.",
          noSignals: "Aucun signal comparable clair.",
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
            medium: "Quelques précédents comparables",
            low: "Peu de précédents comparables",
          },
        },
        summaryFactors: {
          sector: "thèse sectorielle",
          stage: "stade",
          ticket: "ticket",
          portfolio: "historique d'investissement",
        },
        reservations: {
          sector: "Thèse sectorielle peu alignée.",
          stage: "Stade en dehors du coeur de cible du fonds.",
          stageBroad: "Stade possible, mais non prioritaire.",
          ticketStretch: "Ticket envisageable, mais moins naturel.",
          ticketOutside: "Ticket hors de la fourchette habituelle.",
          portfolio: "Peu de précédents comparables.",
        },
        noAlignment: "Aucun signal fort ne ressort sur les critères principaux.",
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
  score,
  lang,
}: {
  startup: Startup;
  vc: VentureCapital;
  score: number;
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
  const { aligned, mixed } = getAlignedFactors(copy, breakdown);
  const primaryReservation = getPrimaryReservation(copy, breakdown);
  const alignmentText =
    aligned.length > 0
      ? formatList(aligned, lang)
      : mixed.length > 0
      ? lang === "en"
        ? `Some signal on ${formatList(mixed, lang)}.`
        : `Quelques signaux sur ${formatList(mixed, lang)}.`
      : copy.noAlignment;
  const reservationText =
    primaryReservation ??
    (aligned.length > 0 && mixed.length === 0
      ? copy.header.noReservation
      : mixed.length > 0
      ? lang === "en"
        ? `Current conviction relies mostly on ${formatList(mixed, lang)}.`
        : `La conviction repose surtout sur ${formatList(mixed, lang)}.`
      : copy.header.noReservation);

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
          value: breakdown.sharedSignals.length > 0
            ? joinList(breakdown.sharedSignals)
            : copy.rows.noSignals,
        },
      ],
    },
  ] as const;

  return (
    <div className="mt-4 overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-white/90">
      <div className="grid gap-4 border-b border-slate-200/80 bg-slate-950 px-4 py-4 sm:grid-cols-[minmax(0,1fr)_190px] sm:px-5">
        <div className="min-w-0">
          <p className="eyebrow mb-3 text-slate-300">{copy.header.eyebrow}</p>
          <h4 className="text-lg font-semibold tracking-tight text-white">{getScoreBandLabel(score, copy)}</h4>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-[1.25rem] border border-white/10 bg-white/[0.04] p-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                {copy.header.alignments}
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-100">{alignmentText}</p>
            </div>
            <div className="rounded-[1.25rem] border border-white/10 bg-white/[0.04] p-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                {copy.header.reservation}
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-100">{reservationText}</p>
            </div>
          </div>
        </div>
        <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.06] p-4 text-right">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
            {copy.header.scoreLabel}
          </p>
          <div className="mt-3 flex items-end justify-end gap-1">
            <span className="text-4xl font-semibold tracking-tight text-white">{score}</span>
            <span className="pb-1 text-sm text-slate-400">/100</span>
          </div>
          <div className="mt-4 h-2 rounded-full bg-white/10">
            <div
              className={`h-2 rounded-full ${scoreBarClasses(score)}`}
              style={{ width: `${score}%` }}
            />
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-5">
        <p className="eyebrow mb-1">{copy.title}</p>
        <p className="mb-4 text-xs text-slate-500">{copy.subtitle}</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {factors.map((factor) => (
            <div
              key={factor.key}
              className={`rounded-[1.35rem] border p-4 shadow-[0_1px_0_rgba(15,23,42,0.02)] ${factorCardClasses(
                factor.score
              )}`}
            >
              <div className="mb-2 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{factor.label}</p>
                  <p className="mt-1 text-[11px] leading-5 text-slate-500">{factor.summary}</p>
                </div>
                <span
                  className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold ${scoreClasses(
                    factor.score
                  )}`}
                >
                  {factor.score}/100
                </span>
              </div>
              <div className="mb-4 h-1.5 rounded-full bg-slate-100">
                <div
                  className={`h-1.5 rounded-full ${factorBarClasses(factor.score)}`}
                  style={{ width: `${factor.score}%` }}
                />
              </div>
              <dl className="space-y-3">
                {factor.rows.map((row) => (
                  <div key={row.label}>
                    <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                      {row.label}
                    </dt>
                    <dd className="mt-1 text-sm leading-6 text-slate-600">{row.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
