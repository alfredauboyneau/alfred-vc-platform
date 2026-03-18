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

  if (breakdown.sectorScore >= 76) aligned.push(copy.summaryFactors.sector);
  else if (breakdown.sectorScore >= 60) mixed.push(copy.summaryFactors.sector);

  if (breakdown.stageScore >= 68) aligned.push(copy.summaryFactors.stage);
  else if (breakdown.stageScore >= 60) mixed.push(copy.summaryFactors.stage);

  if (breakdown.ticketScore >= 72) aligned.push(copy.summaryFactors.ticket);
  else if (breakdown.ticketScore >= 52) mixed.push(copy.summaryFactors.ticket);

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
          support: "What supports the score",
          reservation: "Main reservation",
          quickRead: "Quick read",
          noReservation: "No major reservation on the core fit criteria.",
          noSupport: "No decisive support appears on the main criteria.",
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
          fundSectors: "Declared sectors",
          startupStage: "Startup stage",
          fundStages: "Declared stages",
          amountSought: "Amount sought",
          fundRange: "Fund cheque range",
          listedDeals: "Listed investments",
          detectedSignals: "Detected signals",
          evidence: "Observed basis",
          noDeals: "No named investments in the current dataset.",
          noSignals: "No clear overlap detected from the startup narrative.",
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
          support: "Ce qui soutient le score",
          reservation: "Réserve principale",
          quickRead: "Lecture rapide",
          noReservation: "Aucune réserve majeure sur les critères structurants.",
          noSupport: "Aucun soutien décisif ne ressort sur les critères principaux.",
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
          fundSectors: "Secteurs déclarés",
          startupStage: "Stade de la startup",
          fundStages: "Stades déclarés",
          amountSought: "Montant recherché",
          fundRange: "Fourchette de ticket",
          listedDeals: "Participations connues",
          detectedSignals: "Signaux comparables",
          evidence: "Base du score",
          noDeals: "Aucune participation nommée dans les données disponibles.",
          noSignals: "Aucun signal comparable clair.",
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

function formatLimitedList(items: string[], lang: Lang, maxItems = 4) {
  if (items.length === 0) return "—";

  const visible = items.slice(0, maxItems);
  const remainder = items.length - visible.length;
  const base = visible.join(" · ");

  if (remainder <= 0) return base;

  return lang === "en" ? `${base} · +${remainder} more` : `${base} · +${remainder} autres`;
}

function getTicketPositionCopy(lang: Lang, ratio: number) {
  if (ratio <= 0.3) {
    return lang === "en" ? "rather in the lower part of the range" : "plutôt en bas de fourchette";
  }
  if (ratio >= 0.7) {
    return lang === "en" ? "rather in the upper part of the range" : "plutôt en haut de fourchette";
  }

  return lang === "en" ? "near the middle of the range" : "au coeur de la fourchette";
}

function getSectorSummary(lang: Lang, breakdown: MatchFitBreakdown) {
  if (breakdown.matchedSectors.length > 0) {
    return lang === "en"
      ? `${breakdown.matchedSectors.length} explicit sector match across ${breakdown.sectorBreadth} declared sectors`
      : `${breakdown.matchedSectors.length} secteur explicite sur ${breakdown.sectorBreadth} secteurs déclarés`;
  }
  if (breakdown.sectorKeywordTotal > 0 && breakdown.sectorKeywordMatches > 0) {
    return lang === "en"
      ? `${breakdown.sectorKeywordMatches}/${breakdown.sectorKeywordTotal} sector signals found in the fund profile`
      : `${breakdown.sectorKeywordMatches}/${breakdown.sectorKeywordTotal} signaux sectoriels retrouvés`;
  }

  return lang === "en" ? "No explicit sector evidence" : "Aucune preuve sectorielle explicite";
}

function getStageSummary(lang: Lang, breakdown: MatchFitBreakdown) {
  if (breakdown.stageExactListed) {
    return lang === "en"
      ? `Stage explicitly listed across ${breakdown.stageBreadth} declared stages`
      : `Stade explicitement listé parmi ${breakdown.stageBreadth} stades déclarés`;
  }
  if (breakdown.stageAdjacentListed) {
    return lang === "en" ? "Neighbouring stage to the stated mandate" : "Stade voisin du mandat déclaré";
  }
  if (breakdown.stageFit === "broad") {
    return lang === "en" ? "Broad mandate, but no direct stage focus" : "Mandat large, sans focus direct";
  }

  return lang === "en" ? "No direct stage listing" : "Aucune mention directe du stade";
}

function getTicketSummary(lang: Lang, breakdown: MatchFitBreakdown) {
  if (breakdown.ticketInsideRange && breakdown.ticketPositionRatio !== null) {
    return lang === "en"
      ? `Inside range, ${getTicketPositionCopy(lang, breakdown.ticketPositionRatio)}`
      : `Dans la fourchette, ${getTicketPositionCopy(lang, breakdown.ticketPositionRatio)}`;
  }
  if (breakdown.ticketDistanceRatio > 0) {
    const distance = Math.round(breakdown.ticketDistanceRatio * 100);
    return lang === "en"
      ? `About ${distance}% away from the stated range`
      : `Environ ${distance} % d'écart avec la fourchette`;
  }

  return lang === "en" ? "Cheque range unclear" : "Fourchette peu lisible";
}

function getPortfolioSummary(lang: Lang, breakdown: MatchFitBreakdown) {
  const companyCount = breakdown.notableCompanies.length;
  const signalCount = breakdown.sharedSignals.length;

  if (companyCount > 0 && signalCount > 0) {
    return lang === "en"
      ? `${companyCount} named deals and ${signalCount} comparable signals`
      : `${companyCount} participations citées et ${signalCount} signaux comparables`;
  }
  if (companyCount > 0) {
    return lang === "en"
      ? `${companyCount} named deals, with limited close comparables`
      : `${companyCount} participations citées, avec peu de comparables proches`;
  }
  if (signalCount > 0) {
    return lang === "en"
      ? `${signalCount} comparable signals in the fund narrative`
      : `${signalCount} signaux comparables dans le narratif du fonds`;
  }

  return lang === "en" ? "Little comparable evidence" : "Peu d'éléments comparables";
}

function getSectorEvidence(
  lang: Lang,
  breakdown: MatchFitBreakdown,
  localizedSector: string
) {
  if (breakdown.matchedSectors.length > 0) {
    return lang === "en"
      ? `${localizedSector} is explicitly listed in the fund's declared sector scope.`
      : `${localizedSector} figure explicitement dans les secteurs déclarés par le fonds.`;
  }
  if (breakdown.sectorKeywordTotal > 0 && breakdown.sectorKeywordMatches > 0) {
    return lang === "en"
      ? `${breakdown.sectorKeywordMatches}/${breakdown.sectorKeywordTotal} sector signals were identified in the thesis, description or named portfolio.`
      : `${breakdown.sectorKeywordMatches}/${breakdown.sectorKeywordTotal} signaux sectoriels ont été repérés dans la thèse, la description ou le portefeuille cité.`;
  }

  return lang === "en"
    ? "No explicit sector overlap appears in the fields currently available for the fund."
    : "Aucun recouvrement sectoriel explicite n'apparaît dans les champs actuellement disponibles pour le fonds.";
}

function getStageEvidence(lang: Lang, breakdown: MatchFitBreakdown, localizedStage: string) {
  if (breakdown.stageExactListed) {
    return lang === "en"
      ? `${localizedStage} is explicitly listed in the fund profile (${breakdown.stageBreadth} declared stages).`
      : `${localizedStage} figure explicitement dans le profil du fonds (${breakdown.stageBreadth} stades déclarés).`;
  }
  if (breakdown.stageAdjacentListed) {
    return lang === "en"
      ? `${localizedStage} is not listed verbatim, but the fund covers an adjacent stage.`
      : `${localizedStage} n'est pas listé tel quel, mais le fonds couvre un stade voisin.`;
  }
  if (breakdown.stageFit === "broad") {
    return lang === "en"
      ? `${localizedStage} remains possible because the fund presents a broad mandate, without clear stage priority.`
      : `${localizedStage} reste possible car le fonds présente un mandat large, sans priorité de stade clairement exprimée.`;
  }

  return lang === "en"
    ? `${localizedStage} does not appear in the fund's declared stage scope.`
    : `${localizedStage} n'apparaît pas dans les stades déclarés par le fonds.`;
}

function getTicketEvidence(
  lang: Lang,
  breakdown: MatchFitBreakdown,
  amount: number,
  min: number,
  max: number
) {
  if (breakdown.ticketInsideRange && breakdown.ticketPositionRatio !== null) {
    return lang === "en"
      ? `${amount.toLocaleString("en-US")} € sits inside the stated cheque range, ${getTicketPositionCopy(
          lang,
          breakdown.ticketPositionRatio
        )}.`
      : `${amount.toLocaleString("fr-FR")} € se situe dans la fourchette déclarée, ${getTicketPositionCopy(
          lang,
          breakdown.ticketPositionRatio
        )}.`;
  }

  const distance = Math.round(breakdown.ticketDistanceRatio * 100);
  if (amount < min) {
    return lang === "en"
      ? `${amount.toLocaleString("en-US")} € is about ${distance}% below the fund's stated minimum cheque.`
      : `${amount.toLocaleString("fr-FR")} € se situe environ ${distance} % en dessous du ticket minimum déclaré.`;
  }
  if (amount > max) {
    return lang === "en"
      ? `${amount.toLocaleString("en-US")} € is about ${distance}% above the fund's stated maximum cheque.`
      : `${amount.toLocaleString("fr-FR")} € se situe environ ${distance} % au-dessus du ticket maximum déclaré.`;
  }

  return lang === "en" ? "Cheque range evidence remains limited." : "La preuve sur le ticket reste limitée.";
}

function getPortfolioEvidence(lang: Lang, breakdown: MatchFitBreakdown) {
  const companyCount = breakdown.notableCompanies.length;
  const signalCount = breakdown.sharedSignals.length;

  if (companyCount > 0 && signalCount > 0) {
    return lang === "en"
      ? `${companyCount} named portfolio companies and ${signalCount} comparable signals support this part of the score.`
      : `${companyCount} participations nommées et ${signalCount} signaux comparables soutiennent cette partie du score.`;
  }
  if (companyCount > 0) {
    return lang === "en"
      ? `${companyCount} named portfolio companies are available, but close comparables remain limited.`
      : `${companyCount} participations nommées sont disponibles, mais les comparables proches restent limités.`;
  }
  if (signalCount > 0) {
    return lang === "en"
      ? `This card relies mostly on ${signalCount} comparable signals found in the thesis and description.`
      : `Cette carte repose surtout sur ${signalCount} signaux comparables relevés dans la thèse et la description.`;
  }

  return lang === "en"
    ? "No comparable portfolio evidence is clearly usable in the current dataset."
    : "Aucun élément de portefeuille clairement comparable n'est exploitable dans les données actuelles.";
}

function getSupportText(
  copy: ReturnType<typeof buildCopy>,
  lang: Lang,
  aligned: string[],
  mixed: string[]
) {
  if (aligned.length >= 2) {
    return lang === "en"
      ? `${formatList(aligned, lang)} are consistent with the fund's declared mandate.`
      : `${formatList(aligned, lang)} sont cohérents avec le mandat déclaré du fonds.`;
  }

  if (aligned.length === 1 && mixed.length > 0) {
    return lang === "en"
      ? `${formatList(aligned, lang)} is the clearest support, while ${formatList(mixed, lang)} remains more nuanced.`
      : `${formatList(aligned, lang)} constitue le soutien le plus clair, tandis que ${formatList(mixed, lang)} reste plus nuancé.`;
  }

  if (aligned.length === 1) {
    return lang === "en"
      ? `${formatList(aligned, lang)} is the clearest support in the current data.`
      : `${formatList(aligned, lang)} constitue le soutien le plus clair dans les données actuelles.`;
  }

  if (mixed.length > 0) {
    return lang === "en"
      ? `The score relies mainly on partial signals around ${formatList(mixed, lang)}.`
      : `Le score repose surtout sur des signaux partiels autour de ${formatList(mixed, lang)}.`;
  }

  return copy.header.noSupport;
}

function getQuickRead(
  lang: Lang,
  score: number,
  aligned: string[],
  primaryReservation: string | null
) {
  if (score >= 92) {
    return lang === "en"
      ? "Priority match for a warm introduction. The core fit reads as unusually strong."
      : "Match prioritaire pour une introduction. Le fit ressort comme exceptionnellement solide.";
  }

  if (score >= 84) {
    return primaryReservation
      ? lang === "en"
        ? "Very credible match for outreach. Strong fit overall, with one point still worth checking."
        : "Match très crédible pour une prise de contact. Le fit est fort, avec un point à vérifier."
      : lang === "en"
      ? "Very credible match for outreach. The main criteria line up well."
      : "Match très crédible pour une prise de contact. Les critères principaux sont bien alignés.";
  }

  if (score >= 72) {
    return primaryReservation
      ? lang === "en"
        ? "Credible match for outreach. Not a perfect fit, but the fund remains relevant."
        : "Match crédible pour une prise de contact. Ce n'est pas un perfect match, mais le fonds reste pertinent."
      : lang === "en"
      ? "Credible match for outreach. The fund looks relevant on the main declared criteria."
      : "Match crédible pour une prise de contact. Le fonds paraît pertinent sur les principaux critères déclarés.";
  }

  if (score >= 60) {
    return aligned.length > 0
      ? lang === "en"
        ? "Partial fit. Worth reviewing manually before treating it as a priority."
        : "Fit partiel. À relire manuellement avant d'en faire une cible prioritaire."
      : lang === "en"
      ? "Partial fit. Useful as a secondary lead rather than a priority target."
      : "Fit partiel. À considérer plutôt comme une piste secondaire que comme une priorité.";
  }

  return lang === "en"
    ? "Weak fit on the declared criteria. Not a priority without new evidence."
    : "Fit faible au regard des critères déclarés. Pas une priorité sans élément nouveau.";
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
  const reservationText =
    primaryReservation ??
    (aligned.length > 0 && mixed.length === 0
      ? copy.header.noReservation
      : mixed.length > 0
      ? lang === "en"
        ? `Current conviction relies mostly on ${formatList(mixed, lang)}.`
        : `La conviction repose surtout sur ${formatList(mixed, lang)}.`
      : copy.header.noReservation);
  const supportText = getSupportText(copy, lang, aligned, mixed);
  const quickReadText = getQuickRead(lang, score, aligned, primaryReservation);

  const factors = [
    {
      key: "thesis",
      label: copy.labels.thesis,
      score: breakdown.sectorScore,
      summary: getSectorSummary(lang, breakdown),
      rows: [
        { label: copy.rows.startupSector, value: localizedSector },
        { label: copy.rows.fundSectors, value: formatLimitedList(localizedSectors, lang) },
        { label: copy.rows.evidence, value: getSectorEvidence(lang, breakdown, localizedSector) },
      ],
    },
    {
      key: "stage",
      label: copy.labels.stage,
      score: breakdown.stageScore,
      summary: getStageSummary(lang, breakdown),
      rows: [
        { label: copy.rows.startupStage, value: localizedStage },
        { label: copy.rows.fundStages, value: formatLimitedList(localizedStages, lang) },
        { label: copy.rows.evidence, value: getStageEvidence(lang, breakdown, localizedStage) },
      ],
    },
    {
      key: "ticket",
      label: copy.labels.ticket,
      score: breakdown.ticketScore,
      summary: getTicketSummary(lang, breakdown),
      rows: [
        { label: copy.rows.amountSought, value: amount },
        { label: copy.rows.fundRange, value: `${minTicket} — ${maxTicket}` },
        {
          label: copy.rows.evidence,
          value: getTicketEvidence(lang, breakdown, startup.amount_sought, vc.ticket_min, vc.ticket_max),
        },
      ],
    },
    {
      key: "portfolio",
      label: copy.labels.portfolio,
      score: breakdown.portfolioScore,
      summary: getPortfolioSummary(lang, breakdown),
      rows: [
        {
          label: copy.rows.listedDeals,
          value: breakdown.hasPortfolioData ? formatLimitedList(breakdown.notableCompanies, lang, 3) : copy.rows.noDeals,
        },
        {
          label: copy.rows.detectedSignals,
          value: breakdown.sharedSignals.length > 0
            ? formatLimitedList(breakdown.sharedSignals, lang, 4)
            : copy.rows.noSignals,
        },
        { label: copy.rows.evidence, value: getPortfolioEvidence(lang, breakdown) },
      ],
    },
  ] as const;

  return (
    <div className="mt-4 overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-white/90">
      <div className="grid gap-4 border-b border-slate-200/80 bg-slate-950 px-4 py-4 sm:grid-cols-[minmax(0,1fr)_190px] sm:px-5">
        <div className="min-w-0">
          <p className="eyebrow mb-3 text-slate-300">{copy.header.eyebrow}</p>
          <h4 className="text-lg font-semibold tracking-tight text-white">{getScoreBandLabel(score, copy)}</h4>
          <div className="mt-4 grid gap-3 xl:grid-cols-3 sm:grid-cols-2">
            <div className="rounded-[1.25rem] border border-white/10 bg-white/[0.04] p-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                {copy.header.support}
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-100">{supportText}</p>
            </div>
            <div className="rounded-[1.25rem] border border-white/10 bg-white/[0.04] p-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                {copy.header.reservation}
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-100">{reservationText}</p>
            </div>
            <div className="rounded-[1.25rem] border border-white/10 bg-white/[0.04] p-3 sm:col-span-2 xl:col-span-1">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                {copy.header.quickRead}
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-100">{quickReadText}</p>
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
