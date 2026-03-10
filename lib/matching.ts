import { anthropic } from "./claude";
import type { Startup, VentureCapital, FinancialAnalysis } from "./supabase";

export type MatchResult = {
  vc_id: string;
  score: number;
  analysis: string;
};

const MAX_VCS_FOR_CLAUDE = 35;

// Pré-filtre les VCs les plus pertinents avant d'envoyer à Claude
// Évite les prompts trop longs et les erreurs de token
function preFilterVCs(startup: Startup, vcs: VentureCapital[]): VentureCapital[] {
  const sectorWords = startup.sector
    .toLowerCase()
    .split(/[\s\/,\-]+/)
    .filter((w) => w.length > 3);

  const stage = startup.stage.toLowerCase();
  const amount = startup.amount_sought;

  const scored = vcs.map((vc) => {
    let score = 0;
    const vcText = [...vc.sectors, vc.investment_thesis].join(" ").toLowerCase();

    // Correspondance secteur
    for (const word of sectorWords) {
      if (vcText.includes(word)) score += 4;
    }
    if (vc.sectors.some((s) => s.toLowerCase().includes("tous secteurs"))) score += 2;

    // Correspondance stade
    const stageMap: Record<string, string[]> = {
      "pre-seed": ["pre-seed", "pré-seed", "pre seed"],
      "pré-seed": ["pre-seed", "pré-seed", "pre seed"],
      seed: ["seed"],
      "série a": ["série a", "series a", "série a"],
      "série b": ["série b", "series b", "série b", "série b+"],
      "série b+": ["série b+", "series b+", "série b", "growth"],
    };
    const matchStages = stageMap[stage] || [stage];
    for (const ms of matchStages) {
      if (vc.stages.some((s) => s.toLowerCase().includes(ms))) {
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
  financialAnalysis: FinancialAnalysis
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
        content: `Tu es un expert en venture capital français. Évalue la compatibilité de cette startup avec chaque fonds de VC.

=== PROFIL STARTUP ===
${startupProfile}

=== LISTE DES VCs (${relevantVCs.length} fonds pré-sélectionnés) ===
${vcsFormatted}

Pour chaque VC, évalue la compatibilité en tenant compte :
1. De l'adéquation secteur / thèse d'investissement (50% du score)
2. Du stade et du ticket demandé vs. ce que le VC investit (30% du score)
3. De l'attractivité financière et de la maturité de la startup (20% du score)

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

  return JSON.parse(jsonText) as MatchResult[];
}
