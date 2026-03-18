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
  sharedSignals: string[];
  matchedSectors: string[];
  sectorBreadth: number;
  sectorKeywordMatches: number;
  sectorKeywordTotal: number;
  stageBreadth: number;
  stageExactListed: boolean;
  stageAdjacentListed: boolean;
  ticketInsideRange: boolean;
  ticketPositionRatio: number | null;
  ticketDistanceRatio: number;
};

type SectorFitInsights = {
  score: number;
  matchedSectors: string[];
  sectorBreadth: number;
  keywordMatches: number;
  keywordTotal: number;
  signalOverlap: number;
  isBroad: boolean;
};

type StageFitInsights = {
  score: number;
  stageBreadth: number;
  exactListed: boolean;
  adjacentListed: boolean;
  isBroad: boolean;
};

type TicketFitInsights = {
  score: number;
  insideRange: boolean;
  positionRatio: number | null;
  distanceRatio: number;
};

type NarrativeSignal = {
  label: string;
  patterns: string[];
};

const NOISE_KEYWORDS = new Set([
  "about",
  "across",
  "afin",
  "after",
  "ainsi",
  "allow",
  "allows",
  "apporte",
  "apportent",
  "around",
  "avec",
  "avoir",
  "based",
  "become",
  "built",
  "build",
  "building",
  "celle",
  "celles",
  "celui",
  "ceux",
  "cette",
  "chaque",
  "chez",
  "cible",
  "comment",
  "company",
  "companies",
  "contre",
  "dans",
  "depuis",
  "developpe",
  "developpent",
  "develops",
  "digital",
  "digitale",
  "elles",
  "entre",
  "europe",
  "european",
  "europeenne",
  "europeennes",
  "europeens",
  "for",
  "fonds",
  "focus",
  "french",
  "france",
  "future",
  "grace",
  "global",
  "growth",
  "helps",
  "into",
  "invest",
  "investing",
  "investment",
  "investissements",
  "investit",
  "investor",
  "investors",
  "leur",
  "leurs",
  "making",
  "market",
  "markets",
  "modele",
  "modeles",
  "network",
  "nous",
  "notre",
  "offre",
  "offrent",
  "over",
  "plateforme",
  "platform",
  "product",
  "products",
  "pour",
  "provides",
  "render",
  "sa",
  "scale",
  "scalable",
  "ses",
  "services",
  "solution",
  "solutions",
  "startup",
  "startups",
  "such",
  "sur",
  "technology",
  "technologies",
  "tech",
  "their",
  "through",
  "under",
  "venture",
  "vers",
  "votre",
  "with",
  "worldwide",
  "your",
]);

const NARRATIVE_SIGNALS: NarrativeSignal[] = [
  { label: "SaaS", patterns: ["saas", "software", "logiciel"] },
  { label: "B2B", patterns: ["b2b", "enterprise", "entreprise"] },
  { label: "B2C", patterns: ["b2c", "consumer"] },
  { label: "FinTech", patterns: ["fintech", "paiement", "payment", "payments", "banque", "bank", "credit", "lending"] },
  { label: "InsurTech", patterns: ["insurtech", "assurance", "insurance"] },
  { label: "HealthTech", patterns: ["healthtech", "medtech", "sante", "health"] },
  { label: "DeepTech", patterns: ["deeptech", "hardware", "scientifique", "scientific"] },
  { label: "AI", patterns: ["ia", "ai", "machine learning"] },
  { label: "Cybersecurity", patterns: ["cyber", "cybersecurity", "cybersecurite", "securite", "security"] },
  { label: "Marketplace", patterns: ["marketplace", "place de marche", "places de marche"] },
  { label: "E-commerce", patterns: ["e-commerce", "ecommerce", "commerce"] },
  { label: "Retail", patterns: ["retail"] },
  { label: "PropTech", patterns: ["proptech", "immobilier", "real estate"] },
  { label: "GreenTech", patterns: ["greentech", "cleantech", "climat", "climate", "decarbon", "decarbonation"] },
  { label: "Energy", patterns: ["energie", "energy"] },
  { label: "FoodTech", patterns: ["foodtech", "food", "restauration"] },
  { label: "AgriTech", patterns: ["agritech", "agri", "agriculture", "agricole"] },
  { label: "Mobility", patterns: ["mobilite", "mobility", "transport"] },
  { label: "Logistics", patterns: ["logistique", "logistics", "supply chain"] },
  { label: "Travel", patterns: ["travel", "voyage", "tourisme"] },
  { label: "Hospitality", patterns: ["hospitality", "hotel", "hotellerie"] },
  { label: "EdTech", patterns: ["edtech", "education", "formation"] },
  { label: "Media", patterns: ["media", "medias", "content", "contenu"] },
  { label: "Gaming", patterns: ["gaming", "game", "jeu video", "jeux video"] },
  { label: "Developer tools", patterns: ["api", "developer", "developpeur", "infra", "infrastructure", "devtools"] },
  { label: "Data", patterns: ["data", "donnees", "analytics"] },
  { label: "HR", patterns: ["rh", "recrutement", "recruiting", "talent"] },
  { label: "LegalTech", patterns: ["legaltech", "juridique", "legal"] },
  { label: "RegTech", patterns: ["regtech", "compliance", "regulation", "reglementaire"] },
  { label: "Biotech", patterns: ["biotech", "biologie", "therapeutique"] },
  { label: "Robotics", patterns: ["robot", "robotique", "robotics"] },
  { label: "Luxury", patterns: ["luxe", "luxury", "fashion", "mode"] },
  { label: "Beauty", patterns: ["beauty", "beaute", "cosmetique"] },
];

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

function getNarrativeSignals(value: string) {
  const normalizedValue = normalizeText(value);

  return NARRATIVE_SIGNALS.filter((signal) =>
    signal.patterns.some((pattern) => normalizedValue.includes(normalizeText(pattern)))
  ).map((signal) => signal.label);
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
  return getSectorFitInsights(startup, vc).score;
}

export function scoreStageFit(startup: Startup, vc: VentureCapital) {
  return getStageFitInsights(startup, vc).score;
}

export function scoreTicketFit(startup: Startup, vc: VentureCapital) {
  return getTicketFitInsights(startup, vc).score;
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
  const startupSignals = getNarrativeSignals(startupNarrative);
  const vcSignals = new Set(
    getNarrativeSignals([vc.description, vc.investment_thesis, vc.notable_investments ?? "", ...vc.sectors].join(" "))
  );
  const sharedSignals = startupSignals.filter((signal, index) => startupSignals.indexOf(signal) === index && vcSignals.has(signal)).slice(0, 4);

  if (keywords.length === 0) {
    return {
      score: 62,
      matchedKeywords: [] as string[],
      keywordCoverage: 0,
      sharedSignals,
    };
  }

  const matchedKeywords = keywords
    .filter((keyword) => vcNarrative.includes(keyword.normalized))
    .map((keyword) => keyword.label)
    .slice(0, 4);
  const coverage = matchedKeywords.length / keywords.length;

  if (coverage >= 0.42) {
    return { score: 94, matchedKeywords, keywordCoverage: coverage, sharedSignals };
  }
  if (coverage >= 0.3) {
    return { score: 86, matchedKeywords, keywordCoverage: coverage, sharedSignals };
  }
  if (coverage >= 0.2) {
    return { score: 78, matchedKeywords, keywordCoverage: coverage, sharedSignals };
  }
  if (coverage >= 0.12) {
    return { score: 68, matchedKeywords, keywordCoverage: coverage, sharedSignals };
  }
  if (coverage >= 0.06) {
    return { score: 58, matchedKeywords, keywordCoverage: coverage, sharedSignals };
  }

  return { score: 46, matchedKeywords, keywordCoverage: coverage, sharedSignals };
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
  if (score >= 88) return "exact";
  if (score >= 76) return "strong";
  if (score >= 60) return "broad";
  return "weak";
}

export function getStageFit(score: number): StageFit {
  if (score >= 86) return "exact";
  if (score >= 68) return "adjacent";
  if (score >= 60) return "broad";
  return "weak";
}

export function getTicketFit(score: number): TicketFit {
  if (score >= 88) return "inside";
  if (score >= 72) return "near";
  if (score >= 52) return "stretch";
  return "outside";
}

export function getFactorTone(score: number): FactorTone {
  if (score >= 90) return "strong";
  if (score >= 75) return "good";
  if (score >= 60) return "mixed";
  return "weak";
}

function getSectorFitInsights(startup: Startup, vc: VentureCapital): SectorFitInsights {
  const startupSector = normalizeText(startup.sector);
  const startupKeywords = [...new Set(getKeywords(startup.sector))];
  const vcNarrative = [vc.description, vc.investment_thesis, vc.notable_investments ?? "", ...vc.sectors].join(" ");
  const vcText = normalizeText(vcNarrative);
  const startupSignals = getNarrativeSignals(startup.sector);
  const vcSignals = new Set(getNarrativeSignals(vcNarrative));
  const normalizedSectors = vc.sectors.map(normalizeText);
  const matchedSectors = vc.sectors.filter((sector) => {
    const normalized = normalizeText(sector);
    return normalized.includes(startupSector) || startupSector.includes(normalized);
  });
  const isBroad = normalizedSectors.some(
    (sector) => sector.includes("tous secteurs") || sector.includes("all sectors")
  );
  const keywordMatches = startupKeywords.filter((keyword) => vcText.includes(keyword)).length;
  const signalOverlap = startupSignals.filter((signal) => vcSignals.has(signal)).length;
  const breadthPenalty = Math.min(12, Math.max(0, vc.sectors.length - 1) * 2);

  let score = 30;

  if (matchedSectors.length > 0) {
    score = clamp(92 - breadthPenalty + Math.min(4, signalOverlap * 2), 82, 96);
  } else {
    const keywordCoverage = startupKeywords.length > 0 ? keywordMatches / startupKeywords.length : 0;

    if (keywordCoverage >= 0.6 || signalOverlap >= 2) {
      score = clamp(80 - Math.min(6, breadthPenalty / 2) + Math.min(6, signalOverlap * 2), 72, 88);
    } else if (keywordCoverage >= 0.3 || signalOverlap >= 1) {
      score = 62;
    } else if (isBroad) {
      score = 58;
    } else if (keywordMatches >= 1) {
      score = 52;
    }
  }

  return {
    score,
    matchedSectors,
    sectorBreadth: vc.sectors.length,
    keywordMatches,
    keywordTotal: startupKeywords.length,
    signalOverlap,
    isBroad,
  };
}

function getStageFitInsights(startup: Startup, vc: VentureCapital): StageFitInsights {
  const startupStage = canonicalizeStage(startup.stage);
  const vcStages = [...new Set(vc.stages.map(canonicalizeStage))];
  const normalizedStages = vc.stages.map(normalizeText);
  const adjacentStages: Record<CanonicalStage, CanonicalStage[]> = {
    "pre-seed": ["seed"],
    seed: ["pre-seed", "series-a"],
    "series-a": ["seed", "series-b"],
    "series-b": ["series-a", "growth"],
    growth: ["series-b"],
    other: [],
  };
  const exactListed = vcStages.includes(startupStage);
  const adjacentListed = adjacentStages[startupStage].some((stage) => vcStages.includes(stage));
  const isBroad = normalizedStages.some((stage) => stage.includes("all") || stage.includes("tous"));
  const breadthPenalty = Math.min(10, Math.max(0, vcStages.length - 1) * 3);

  let score = 32;

  if (exactListed) {
    score = clamp(92 - breadthPenalty, 82, 96);
  } else if (adjacentListed) {
    score = clamp(74 - Math.max(0, vcStages.length - 2) * 2, 66, 78);
  } else if (isBroad) {
    score = 60;
  }

  return {
    score,
    stageBreadth: vcStages.length,
    exactListed,
    adjacentListed,
    isBroad,
  };
}

function getTicketFitInsights(startup: Startup, vc: VentureCapital): TicketFitInsights {
  const amount = startup.amount_sought;
  const min = Math.max(vc.ticket_min, 1);
  const max = Math.max(vc.ticket_max, min + 1);

  if (amount >= min && amount <= max) {
    const logMin = Math.log(min);
    const logMax = Math.log(max);
    const span = Math.max(0.0001, logMax - logMin);
    const positionRatio = clamp((Math.log(amount) - logMin) / span, 0, 1);
    const centerComfort = 1 - Math.min(1, Math.abs(positionRatio - 0.5) * 2);
    const rangeMultiple = max / min;
    const widthPenalty = rangeMultiple > 30 ? 5 : rangeMultiple > 15 ? 3 : rangeMultiple > 8 ? 1 : 0;
    const score = Math.round(clamp(78 + centerComfort * 15 - widthPenalty, 74, 94));

    return {
      score,
      insideRange: true,
      positionRatio,
      distanceRatio: 0,
    };
  }

  const distanceRatio =
    amount < min ? (min - amount) / min : (amount - max) / max;

  let score = 32;
  if (distanceRatio <= 0.15) score = 72;
  else if (distanceRatio <= 0.35) score = 62;
  else if (distanceRatio <= 1) score = 50;

  return {
    score,
    insideRange: false,
    positionRatio: null,
    distanceRatio,
  };
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
  const sectorInsights = getSectorFitInsights(startup, vc);
  const stageInsights = getStageFitInsights(startup, vc);
  const ticketInsights = getTicketFitInsights(startup, vc);
  const sectorScore = sectorInsights.score;
  const stageScore = stageInsights.score;
  const ticketScore = ticketInsights.score;
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
    sharedSignals: portfolioInsights.sharedSignals,
    matchedSectors: sectorInsights.matchedSectors,
    sectorBreadth: sectorInsights.sectorBreadth,
    sectorKeywordMatches: sectorInsights.keywordMatches,
    sectorKeywordTotal: sectorInsights.keywordTotal,
    stageBreadth: stageInsights.stageBreadth,
    stageExactListed: stageInsights.exactListed,
    stageAdjacentListed: stageInsights.adjacentListed,
    ticketInsideRange: ticketInsights.insideRange,
    ticketPositionRatio: ticketInsights.positionRatio,
    ticketDistanceRatio: ticketInsights.distanceRatio,
  };
}
