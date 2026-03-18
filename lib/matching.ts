import { anthropic } from "./claude";
import type { Startup, VentureCapital, FinancialAnalysis } from "./supabase";
import {
  clamp,
  scoreFinancialFit,
  scorePortfolioNarrativeFit,
  scoreSectorFit,
  scoreStageFit,
  scoreTicketFit,
} from "./match-fit";

export type MatchResult = {
  vc_id: string;
  score: number;
  analysis: string;
};

type RawMatchResult = MatchResult & {
  portfolio_fit?: number;
};

const MAX_VCS_FOR_CLAUDE = 35;

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

function calibrateMatchScore(
  rawScore: number,
  startup: Startup,
  vc: VentureCapital,
  financialAnalysis: FinancialAnalysis,
  portfolioFit?: number
) {
  const sectorScore = scoreSectorFit(startup, vc);
  const stageScore = scoreStageFit(startup, vc);
  const ticketScore = scoreTicketFit(startup, vc);
  const financialScore = scoreFinancialFit(financialAnalysis);
  const narrativePortfolioScore = scorePortfolioNarrativeFit(startup, vc);
  const hasPortfolioData = Boolean(vc.notable_investments?.trim());
  const safePortfolioFit =
    typeof portfolioFit === "number" && Number.isFinite(portfolioFit)
      ? clamp(Math.round(portfolioFit), 0, 100)
      : undefined;
  const portfolioScore =
    safePortfolioFit === undefined
      ? narrativePortfolioScore
      : hasPortfolioData
      ? Math.round(safePortfolioFit * 0.7 + narrativePortfolioScore * 0.3)
      : Math.round(safePortfolioFit * 0.4 + narrativePortfolioScore * 0.6);

  const objectiveScore = Math.round(
    sectorScore * 0.35 +
      stageScore * 0.2 +
      ticketScore * 0.2 +
      financialScore * 0.1 +
      portfolioScore * 0.15
  );

  let maxScore = 93;

  if (
    sectorScore >= 90 &&
    stageScore >= 88 &&
    ticketScore >= 88 &&
    financialScore >= 92 &&
    portfolioScore >= 92
  ) {
    maxScore = 98;
  } else if (
    sectorScore >= 86 &&
    stageScore >= 84 &&
    ticketScore >= 84 &&
    financialScore >= 88 &&
    portfolioScore >= 82
  ) {
    maxScore = 96;
  } else if (
    sectorScore >= 78 &&
    stageScore >= 74 &&
    ticketScore >= 74 &&
    financialScore >= 80 &&
    portfolioScore >= 74
  ) {
    maxScore = 94;
  }

  if (financialAnalysis.investment_readiness === "not_ready") {
    maxScore = Math.min(maxScore, 82);
  } else if (financialAnalysis.investment_readiness === "soon") {
    maxScore = Math.min(maxScore, 88);
  }

  if (sectorScore < 60) maxScore = Math.min(maxScore, 69);
  if (stageScore < 60) maxScore = Math.min(maxScore, 74);
  if (ticketScore < 52) maxScore = Math.min(maxScore, 78);
  if (stageScore < 45 || ticketScore < 45) maxScore = Math.min(maxScore, 66);
  if (objectiveScore < 60) maxScore = Math.min(maxScore, 70);
  if (hasPortfolioData && portfolioScore < 68) maxScore = Math.min(maxScore, 84);
  if (hasPortfolioData && portfolioScore < 55) maxScore = Math.min(maxScore, 76);
  if (hasPortfolioData && portfolioScore < 40) maxScore = Math.min(maxScore, 68);

  const blendedScore = Math.round(clamp(rawScore, 0, 100) * 0.45 + objectiveScore * 0.55);

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
    const vcText = normalizeText(
      [...vc.sectors, vc.description, vc.investment_thesis, vc.notable_investments ?? ""].join(" ")
    );

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

    // Similarite avec le comportement d'investissement historique
    score += Math.round(scorePortfolioNarrativeFit(startup, vc) / 25);

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
Description : ${vc.description}
Secteurs : ${vc.sectors.join(", ")}
Stades : ${vc.stages.join(", ")}
Ticket : ${vc.ticket_min.toLocaleString("fr-FR")} € — ${vc.ticket_max.toLocaleString("fr-FR")} €
Thèse : ${vc.investment_thesis.slice(0, 320)}
Investissements notables : ${vc.notable_investments || "Non renseigné"}`
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
1. Sector / stated thesis alignment (35% of score)
2. Stage and ticket requested vs. what the VC actually invests (25% of score)
3. Consistency with the fund's past investments and real portfolio pattern (25% of score)
4. Financial attractiveness and fundraising readiness (15% of score)

Strict scoring anchors:
- 95-100 = exceptional and rare, only when thesis, stage, ticket and historical portfolio pattern are all strongly aligned
- 85-94 = very strong fit, with at most one minor caveat
- 70-84 = credible but imperfect fit
- 55-69 = partial fit
- 0-54 = weak fit

Do not hand out 90+ by default. Use the full scale.
Use past investments as evidence of actual investing behavior, not just stated marketing copy.
If a fund has previously invested in companies that are genuinely similar in stage, vertical, business model or go-to-market, reflect it in the score.
If the portfolio history contradicts the match, pull the score down even if the stated thesis sounds broad.
If everything truly lines up, a genuine perfect match is allowed.
If stage or ticket is clearly misaligned, the score cannot exceed 74.
If sector / thesis alignment is weak, the score cannot exceed 69.
If the startup is not ready to raise, avoid scores above 84 unless the fit is truly exceptional.

Reply ONLY with valid JSON (no markdown, no backticks) in this exact format:
[
  {
    "vc_id": "<exact VC id>",
    "score": <integer between 0 and 100>,
    "portfolio_fit": <integer between 0 and 100>,
    "analysis": "<2-3 sentences explaining why this VC matches (or not) this startup, in English>"
  }
]

Include ALL ${relevantVCs.length} VCs in the response, sorted by descending score.
When relevant, mention the portfolio pattern or notable investments in the analysis.`
          : `Tu es un expert en venture capital français. Évalue la compatibilité de cette startup avec chaque fonds de VC.

=== PROFIL STARTUP ===
${startupProfile}

=== LISTE DES VCs (${relevantVCs.length} fonds pré-sélectionnés) ===
${vcsFormatted}

Pour chaque VC, évalue la compatibilité en tenant compte :
1. De l'adéquation secteur / thèse d'investissement affichée (35% du score)
2. Du stade et du ticket demandé vs. ce que le VC investit vraiment (25% du score)
3. De la cohérence avec les investissements passés du fonds et son portefeuille historique (25% du score)
4. De l'attractivité financière et de la maturité de levée (15% du score)

Barème strict :
- 95-100 = exceptionnel et rare, réservé aux cas où thèse, stade, ticket et historique d'investissement sont tous fortement alignés
- 85-94 = très bon fit, avec au plus une réserve mineure
- 70-84 = fit crédible mais imparfait
- 55-69 = fit partiel
- 0-54 = fit faible

N'utilise pas 90+ par défaut. Utilise toute l'échelle.
Prends les investissements passés comme un signal du comportement réel d'investissement, pas seulement comme du marketing.
Si le fonds a déjà investi dans des startups vraiment proches en vertical, modèle économique, stade ou go-to-market, cela doit se voir dans le score.
Si le portefeuille historique contredit le match, baisse le score même si la thèse affichée semble large.
Si tout est vraiment aligné, un perfect match est autorisé.
Si le stade ou le ticket est clairement décalé, le score ne peut pas dépasser 74.
Si l'adéquation secteur / thèse est faible, le score ne peut pas dépasser 69.
Si la startup n'est pas prête à lever, évite les scores supérieurs à 84 sauf cas vraiment exceptionnel.

Réponds UNIQUEMENT avec un JSON valide (sans markdown, sans backticks) dans ce format exact :
[
  {
    "vc_id": "<id exact du VC>",
    "score": <nombre entier entre 0 et 100>,
    "portfolio_fit": <nombre entier entre 0 et 100>,
    "analysis": "<2-3 phrases expliquant pourquoi ce VC correspond (ou non) à cette startup, en français>"
  }
]

Inclus TOUS les ${relevantVCs.length} VCs dans la réponse, triés par score décroissant.
Quand c'est pertinent, cite le pattern du portefeuille ou des investissements notables dans l'analyse.`,
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

  const rawMatches = JSON.parse(jsonText) as RawMatchResult[];
  const vcById = new Map(relevantVCs.map((vc) => [vc.id, vc]));

  const calibratedMatches = rawMatches.map((match) => {
    const vc = vcById.get(match.vc_id);
    const safeRawScore = clamp(Math.round(match.score), 0, 100);
    const safePortfolioFit =
      typeof match.portfolio_fit === "number" && Number.isFinite(match.portfolio_fit)
        ? clamp(Math.round(match.portfolio_fit), 0, 100)
        : undefined;

    if (!vc) {
      return {
        vc_id: match.vc_id,
        analysis: match.analysis,
        score: safeRawScore,
      };
    }

    return {
      vc_id: match.vc_id,
      analysis: match.analysis,
      score: calibrateMatchScore(safeRawScore, startup, vc, financialAnalysis, safePortfolioFit),
    };
  });

  calibratedMatches.sort((a, b) => b.score - a.score);
  return calibratedMatches;
}
