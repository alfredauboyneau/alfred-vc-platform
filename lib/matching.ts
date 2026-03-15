import { anthropic } from "./claude";
import type { Startup, VentureCapital, FinancialAnalysis } from "./supabase";

export type MatchResult = {
  vc_id: string;
  score: number;
  analysis: string;
};

const MAX_VCS_FOR_CLAUDE = 35;

type CanonicalStage = "pre-seed" | "seed" | "series-a" | "series-b" | "growth" | "other";

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function getKeywords(value: string) {
  return normalizeText(value)
    .split(/[\s\/,\-+()]+/)
    .filter((word) => word.length > 3);
}

function canonicalizeStage(value: string): CanonicalStage {
  const stage = normalizeText(value);

  if (stage.includes("pre-seed") || stage.includes("pre seed")) return "pre-seed";
  if (stage.includes("seed")) return "seed";
  if (stage.includes("serie a") || stage.includes("series a")) return "series-a";
  if (stage.includes("serie b") || stage.includes("series b")) return "series-b";
  if (stage.includes("growth") || stage.includes("late")) return "growth";

  return "other";
}

function scoreSectorFit(startup: Startup, vc: VentureCapital) {
  const startupSector = normalizeText(startup.sector);
  const startupKeywords = getKeywords(startup.sector);
  const normalizedSectors = vc.sectors.map(normalizeText);
  const vcText = normalizeText([...vc.sectors, vc.investment_thesis].join(" "));
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

function scoreStageFit(startup: Startup, vc: VentureCapital) {
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

function scoreTicketFit(startup: Startup, vc: VentureCapital) {
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

function scoreFinancialFit(financialAnalysis: FinancialAnalysis) {
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

function calibrateMatchScore(
  rawScore: number,
  startup: Startup,
  vc: VentureCapital,
  financialAnalysis: FinancialAnalysis
) {
  const sectorScore = scoreSectorFit(startup, vc);
  const stageScore = scoreStageFit(startup, vc);
  const ticketScore = scoreTicketFit(startup, vc);
  const financialScore = scoreFinancialFit(financialAnalysis);

  const objectiveScore = Math.round(
    sectorScore * 0.45 +
      stageScore * 0.2 +
      ticketScore * 0.2 +
      financialScore * 0.15
  );

  let maxScore = 94;

  if (
    sectorScore >= 95 &&
    stageScore >= 95 &&
    ticketScore >= 95 &&
    financialScore >= 90
  ) {
    maxScore = 96;
  }

  if (financialAnalysis.investment_readiness === "not_ready") {
    maxScore = Math.min(maxScore, 82);
  } else if (financialAnalysis.investment_readiness === "soon") {
    maxScore = Math.min(maxScore, 88);
  }

  if (sectorScore < 70) maxScore = Math.min(maxScore, 69);
  if (stageScore < 70) maxScore = Math.min(maxScore, 74);
  if (ticketScore < 70) maxScore = Math.min(maxScore, 78);
  if (stageScore < 50 || ticketScore < 50) maxScore = Math.min(maxScore, 66);
  if (objectiveScore < 60) maxScore = Math.min(maxScore, 70);

  const blendedScore = Math.round(clamp(rawScore, 0, 100) * 0.4 + objectiveScore * 0.6);

  return clamp(Math.min(blendedScore, maxScore), 0, 100);
}

// Pré-filtre les VCs les plus pertinents avant d'envoyer à Claude
// Évite les prompts trop longs et les erreurs de token
function preFilterVCs(startup: Startup, vcs: VentureCapital[]): VentureCapital[] {
  const sectorWords = getKeywords(startup.sector);
  const stage = normalizeText(startup.stage);
  const amount = startup.amount_sought;

  const scored = vcs.map((vc) => {
    let score = 0;
    const vcText = normalizeText([...vc.sectors, vc.investment_thesis].join(" "));

    // Correspondance secteur
    for (const word of sectorWords) {
      if (vcText.includes(word)) score += 4;
    }
    if (
      vc.sectors.some((s) => {
        const normalized = normalizeText(s);
        return normalized.includes("tous secteurs") || normalized.includes("all sectors");
      })
    ) {
      score += 2;
    }

    // Correspondance stade
    const stageMap: Record<string, string[]> = {
      "pre-seed": ["pre-seed", "pre seed"],
      seed: ["seed"],
      "serie a": ["serie a", "series a"],
      "serie b": ["serie b", "series b"],
      "serie b+": ["serie b+", "series b+", "growth"],
    };
    const matchStages = stageMap[stage] || [stage];
    for (const ms of matchStages) {
      if (vc.stages.some((s) => normalizeText(s).includes(normalizeText(ms)))) {
        score += 5;
        break;
      }
    }

    // Correspondance ticket
    if (amount >= vc.ticket_min * 0.3 && amount <= vc.ticket_max * 3) score += 2;
    if (amount >= vc.ticket_min && amount <= vc.ticket_max) score += 3;

    return { vc, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, MAX_VCS_FOR_CLAUDE).map((s) => s.vc);
}

export async function matchStartupWithVCs(
  startup: Startup,
  vcs: VentureCapital[],
  financialAnalysis: FinancialAnalysis,
  lang: "fr" | "en" = "fr"
): Promise<MatchResult[]> {
  // Pré-filtrer pour n'envoyer que les VCs les plus pertinents à Claude
  const relevantVCs = preFilterVCs(startup, vcs);

  const startupProfile = `
NOM : ${startup.name}
TAGLINE : ${startup.tagline}
SECTEUR : ${startup.sector}
STADE : ${startup.stage}
MONTANT RECHERCHÉ : ${startup.amount_sought.toLocaleString("fr-FR")} €
ANNÉE DE CRÉATION : ${startup.founded_year}
TAILLE DE L'ÉQUIPE : ${startup.team_size} personnes

PROBLÈME RÉSOLU : ${startup.problem}
SOLUTION : ${startup.solution}
TAILLE DE MARCHÉ : ${startup.market_size || "Non renseigné"}
TRACTION : ${startup.traction || "Non renseigné"}

--- ANALYSE FINANCIÈRE (générée par IA) ---
Score de santé financière : ${financialAnalysis.financial_health_score}/100
Trajectoire de croissance : ${financialAnalysis.growth_trajectory}
Investment readiness : ${financialAnalysis.investment_readiness}
Forces clés : ${financialAnalysis.key_strengths.join(", ")}
Risques clés : ${financialAnalysis.key_risks.join(", ")}
Résumé : ${financialAnalysis.summary}
`;

  const vcsFormatted = relevantVCs
    .map(
      (vc) => `VC_ID: ${vc.id}
Nom : ${vc.name}
Secteurs : ${vc.sectors.join(", ")}
Stades : ${vc.stages.join(", ")}
Ticket : ${vc.ticket_min.toLocaleString("fr-FR")} € — ${vc.ticket_max.toLocaleString("fr-FR")} €
Thèse : ${vc.investment_thesis.slice(0, 250)}`
    )
    .join("\n---\n");

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 8192,
    messages: [
      {
        role: "user",
        content: lang === "en"
          ? `You are an expert in French venture capital. Evaluate the compatibility of this startup with each VC fund.

=== STARTUP PROFILE ===
${startupProfile}

=== VC LIST (${relevantVCs.length} pre-selected funds) ===
${vcsFormatted}

For each VC, evaluate compatibility taking into account:
1. Sector / investment thesis alignment (50% of score)
2. Stage and ticket requested vs. what the VC invests (30% of score)
3. Financial attractiveness and startup maturity (20% of score)

Strict scoring anchors:
- 95-100 = exceptional and rare, only when thesis, stage and ticket fit with no material reservation
- 85-94 = very strong fit, with at most one minor caveat
- 70-84 = credible but imperfect fit
- 55-69 = partial fit
- 0-54 = weak fit

Do not hand out 90+ by default. Use the full scale.
If stage or ticket is clearly misaligned, the score cannot exceed 74.
If sector / thesis alignment is weak, the score cannot exceed 69.
If the startup is not ready to raise, avoid scores above 84 unless the fit is truly exceptional.

Reply ONLY with valid JSON (no markdown, no backticks) in this exact format:
[
  {
    "vc_id": "<exact VC id>",
    "score": <integer between 0 and 100>,
    "analysis": "<2-3 sentences explaining why this VC matches (or not) this startup, in English>"
  }
]

Include ALL ${relevantVCs.length} VCs in the response, sorted by descending score.`
          : `Tu es un expert en venture capital français. Évalue la compatibilité de cette startup avec chaque fonds de VC.

=== PROFIL STARTUP ===
${startupProfile}

=== LISTE DES VCs (${relevantVCs.length} fonds pré-sélectionnés) ===
${vcsFormatted}

Pour chaque VC, évalue la compatibilité en tenant compte :
1. De l'adéquation secteur / thèse d'investissement (50% du score)
2. Du stade et du ticket demandé vs. ce que le VC investit (30% du score)
3. De l'attractivité financière et de la maturité de la startup (20% du score)

Barème strict :
- 95-100 = exceptionnel et rare, réservé aux cas où thèse, stade et ticket sont alignés sans réserve importante
- 85-94 = très bon fit, avec au plus une réserve mineure
- 70-84 = fit crédible mais imparfait
- 55-69 = fit partiel
- 0-54 = fit faible

N'utilise pas 90+ par défaut. Utilise toute l'échelle.
Si le stade ou le ticket est clairement décalé, le score ne peut pas dépasser 74.
Si l'adéquation secteur / thèse est faible, le score ne peut pas dépasser 69.
Si la startup n'est pas prête à lever, évite les scores supérieurs à 84 sauf cas vraiment exceptionnel.

Réponds UNIQUEMENT avec un JSON valide (sans markdown, sans backticks) dans ce format exact :
[
  {
    "vc_id": "<id exact du VC>",
    "score": <nombre entier entre 0 et 100>,
    "analysis": "<2-3 phrases expliquant pourquoi ce VC correspond (ou non) à cette startup, en français>"
  }
]

Inclus TOUS les ${relevantVCs.length} VCs dans la réponse, triés par score décroissant.`,
      },
    ],
  });

  const content = response.content[0];
  if (content.type !== "text") {
    throw new Error("Réponse Claude invalide");
  }

  // Nettoyer les éventuels blocs markdown
  let jsonText = content.text.trim();
  if (jsonText.startsWith("```")) {
    jsonText = jsonText.replace(/^```[\w]*\n?/, "").replace(/\n?```$/, "");
  }

  const rawMatches = JSON.parse(jsonText) as MatchResult[];
  const vcById = new Map(relevantVCs.map((vc) => [vc.id, vc]));

  const calibratedMatches = rawMatches.map((match) => {
    const vc = vcById.get(match.vc_id);

    if (!vc) {
      return {
        ...match,
        score: clamp(Math.round(match.score), 0, 100),
      };
    }

    return {
      ...match,
      score: calibrateMatchScore(match.score, startup, vc, financialAnalysis),
    };
  });

  calibratedMatches.sort((a, b) => b.score - a.score);
  return calibratedMatches;
}
