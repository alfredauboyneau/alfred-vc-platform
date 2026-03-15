import type { FinancialAnalysis, Startup, VentureCapital } from "./supabase";

export type CanonicalStage = "pre-seed" | "seed" | "series-a" | "series-b" | "growth" | "other";

export type SectorFit = "exact" | "strong" | "broad" | "weak";
export type StageFit = "exact" | "adjacent" | "broad" | "weak";
export type TicketFit = "inside" | "near" | "stretch" | "outside";
export type FactorTone = "strong" | "good" | "mixed" | "weak";

export type MatchFitBreakdown = {
  sectorScore: number;
  stageScore: number;
  ticketScore: number;
  portfolioScore: number;
  financialScore?: number;
  sectorFit: SectorFit;
  stageFit: StageFit;
  ticketFit: TicketFit;
  hasPortfolioData: boolean;
  notableCompanies: string[];
  matchedKeywords: string[];
  keywordCoverage: number;
};

const NOISE_KEYWORDS = new Set([
  "about",
  "avec",
  "build",
  "building",
  "cette",
  "cible",
  "company",
  "companies",
  "digital",
  "digitale",
  "europe",
  "european",
  "europeenne",
  "europeennes",
  "europeens",
  "fonds",
  "focus",
  "french",
  "france",
  "future",
  "global",
  "growth",
  "invest",
  "investing",
  "investment",
  "investissements",
  "investit",
  "investor",
  "investors",
  "market",
  "markets",
  "modele",
  "modeles",
  "network",
  "plateforme",
  "platform",
  "product",
  "products",
  "scale",
  "scalable",
  "services",
  "solution",
  "solutions",
  "startup",
  "startups",
  "technology",
  "technologies",
  "tech",
  "venture",
  "worldwide",
]);

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function normalizeText(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function getKeywords(value: string) {
  return normalizeText(value)
    .split(/[\s\/,\-+()]+/)
    .filter((word) => word.length > 3);
}

function getDistinctiveKeywordEntries(value: string) {
  const rawWords = value.split(/[\s\/,\-+()]+/).filter((word) => word.length > 3);
  const entries = new Map<string, string>();

  for (const rawWord of rawWords) {
    const normalized = normalizeText(rawWord);
    if (normalized.length <= 3 || NOISE_KEYWORDS.has(normalized) || entries.has(normalized)) {
      continue;
    }
    entries.set(normalized, rawWord);
  }

  return [...entries.entries()].map(([normalized, label]) => ({ normalized, label }));
}

export function canonicalizeStage(value: string): CanonicalStage {
  const stage = normalizeText(value);

  if (stage.includes("pre-seed") || stage.includes("pre seed")) return "pre-seed";
  if (stage.includes("seed")) return "seed";
  if (stage.includes("serie a") || stage.includes("series a")) return "series-a";
  if (stage.includes("serie b") || stage.includes("series b")) return "series-b";
  if (stage.includes("growth") || stage.includes("late")) return "growth";

  return "other";
}

export function scoreSectorFit(startup: Startup, vc: VentureCapital) {
  const startupSector = normalizeText(startup.sector);
  const startupKeywords = getKeywords(startup.sector);
  const normalizedSectors = vc.sectors.map(normalizeText);
  const vcText = normalizeText(
    [...vc.sectors, vc.description, vc.investment_thesis, vc.notable_investments ?? ""].join(" ")
  );
  const isBroad = normalizedSectors.some(
    (sector) => sector.includes("tous secteurs") || sector.includes("all sectors")
  );

  if (
    normalizedSectors.some(
      (sector) =>
        sector.includes(startupSector) ||
        startupSector.includes(sector)
    )
  ) {
    return 100;
  }

  const keywordMatches = startupKeywords.filter((keyword) => vcText.includes(keyword)).length;

  if (keywordMatches >= Math.max(1, Math.ceil(startupKeywords.length * 0.6))) {
    return 88;
  }

  if (isBroad) {
    return 76;
  }

  if (keywordMatches >= 1) {
    return 66;
  }

  return 38;
}

export function scoreStageFit(startup: Startup, vc: VentureCapital) {
  const startupStage = canonicalizeStage(startup.stage);
  const vcStages = vc.stages.map(canonicalizeStage);
  const normalizedStages = vc.stages.map(normalizeText);

  if (vcStages.includes(startupStage)) {
    return 100;
  }

  const adjacentStages: Record<CanonicalStage, CanonicalStage[]> = {
    "pre-seed": ["seed"],
    seed: ["pre-seed", "series-a"],
    "series-a": ["seed", "series-b"],
    "series-b": ["series-a", "growth"],
    growth: ["series-b"],
    other: [],
  };

  if (adjacentStages[startupStage].some((stage) => vcStages.includes(stage))) {
    return 74;
  }

  if (normalizedStages.some((stage) => stage.includes("all") || stage.includes("tous"))) {
    return 70;
  }

  return 34;
}

export function scoreTicketFit(startup: Startup, vc: VentureCapital) {
  const amount = startup.amount_sought;

  if (amount >= vc.ticket_min && amount <= vc.ticket_max) {
    return 100;
  }

  if (amount >= vc.ticket_min * 0.75 && amount <= vc.ticket_max * 1.35) {
    return 80;
  }

  if (amount >= vc.ticket_min * 0.5 && amount <= vc.ticket_max * 2) {
    return 58;
  }

  return 28;
}

export function scorePortfolioNarrativeFit(startup: Startup, vc: VentureCapital) {
  return getPortfolioNarrativeInsights(startup, vc).score;
}

function getPortfolioNarrativeInsights(startup: Startup, vc: VentureCapital) {
  const startupNarrative = [
    startup.tagline,
    startup.sector,
    startup.problem,
    startup.solution,
    startup.market_size,
    startup.traction,
  ]
    .filter(Boolean)
    .join(" ");
  const vcNarrative = normalizeText(
    [vc.description, vc.investment_thesis, vc.notable_investments ?? "", ...vc.sectors].join(" ")
  );
  const keywords = getDistinctiveKeywordEntries(startupNarrative);

  if (keywords.length === 0) {
    return {
      score: 62,
      matchedKeywords: [] as string[],
      keywordCoverage: 0,
    };
  }

  const matchedKeywords = keywords
    .filter((keyword) => vcNarrative.includes(keyword.normalized))
    .map((keyword) => keyword.label)
    .slice(0, 4);
  const coverage = matchedKeywords.length / keywords.length;

  if (coverage >= 0.42) {
    return { score: 94, matchedKeywords, keywordCoverage: coverage };
  }
  if (coverage >= 0.3) {
    return { score: 86, matchedKeywords, keywordCoverage: coverage };
  }
  if (coverage >= 0.2) {
    return { score: 78, matchedKeywords, keywordCoverage: coverage };
  }
  if (coverage >= 0.12) {
    return { score: 68, matchedKeywords, keywordCoverage: coverage };
  }
  if (coverage >= 0.06) {
    return { score: 58, matchedKeywords, keywordCoverage: coverage };
  }

  return { score: 46, matchedKeywords, keywordCoverage: coverage };
}

export function scoreFinancialFit(financialAnalysis: FinancialAnalysis) {
  const readinessOffset =
    financialAnalysis.investment_readiness === "ready"
      ? 10
      : financialAnalysis.investment_readiness === "soon"
      ? 0
      : -14;

  const trajectoryOffset =
    financialAnalysis.growth_trajectory === "exceptional"
      ? 8
      : financialAnalysis.growth_trajectory === "strong"
      ? 5
      : financialAnalysis.growth_trajectory === "moderate"
      ? 0
      : -6;

  return clamp(financialAnalysis.financial_health_score + readinessOffset + trajectoryOffset, 25, 100);
}

export function getSectorFit(score: number): SectorFit {
  if (score >= 95) return "exact";
  if (score >= 84) return "strong";
  if (score >= 66) return "broad";
  return "weak";
}

export function getStageFit(score: number): StageFit {
  if (score >= 95) return "exact";
  if (score >= 74) return "adjacent";
  if (score >= 70) return "broad";
  return "weak";
}

export function getTicketFit(score: number): TicketFit {
  if (score >= 95) return "inside";
  if (score >= 80) return "near";
  if (score >= 58) return "stretch";
  return "outside";
}

export function getFactorTone(score: number): FactorTone {
  if (score >= 90) return "strong";
  if (score >= 75) return "good";
  if (score >= 60) return "mixed";
  return "weak";
}

function getNotableCompanies(notableInvestments: string | null) {
  if (!notableInvestments) return [];

  return notableInvestments
    .split(",")
    .map((company) => company.replace(/\s*\(.*?\)\s*/g, "").trim())
    .filter(Boolean)
    .slice(0, 3);
}

export function buildMatchFitBreakdown(
  startup: Startup,
  vc: VentureCapital,
  financialAnalysis?: FinancialAnalysis | null
): MatchFitBreakdown {
  const portfolioInsights = getPortfolioNarrativeInsights(startup, vc);
  const sectorScore = scoreSectorFit(startup, vc);
  const stageScore = scoreStageFit(startup, vc);
  const ticketScore = scoreTicketFit(startup, vc);
  const portfolioScore = portfolioInsights.score;

  return {
    sectorScore,
    stageScore,
    ticketScore,
    portfolioScore,
    financialScore: financialAnalysis ? scoreFinancialFit(financialAnalysis) : undefined,
    sectorFit: getSectorFit(sectorScore),
    stageFit: getStageFit(stageScore),
    ticketFit: getTicketFit(ticketScore),
    hasPortfolioData: Boolean(vc.notable_investments?.trim()),
    notableCompanies: getNotableCompanies(vc.notable_investments),
    matchedKeywords: portfolioInsights.matchedKeywords,
    keywordCoverage: portfolioInsights.keywordCoverage,
  };
}
