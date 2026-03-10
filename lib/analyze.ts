import { anthropic } from "./claude";
import type { Startup, FinancialAnalysis } from "./supabase";

export async function analyzeStartupFinancials(
  startup: Partial<Startup>
): Promise<FinancialAnalysis> {
  const financialData = `
Startup : ${startup.name}
Secteur : ${startup.sector}
Stade : ${startup.stage}
Montant recherché : ${startup.amount_sought ? `${startup.amount_sought.toLocaleString("fr-FR")} €` : "Non renseigné"}

--- DONNÉES FINANCIÈRES ---
MRR : ${startup.mrr ? `${startup.mrr.toLocaleString("fr-FR")} €` : "Non renseigné"}
ARR : ${startup.arr ? `${startup.arr.toLocaleString("fr-FR")} €` : "Non renseigné"}
Croissance MoM : ${startup.growth_mom !== null && startup.growth_mom !== undefined ? `${startup.growth_mom}%` : "Non renseignée"}
Burn rate mensuel : ${startup.burn_rate ? `${startup.burn_rate.toLocaleString("fr-FR")} €` : "Non renseigné"}
Runway : ${startup.runway_months ? `${startup.runway_months} mois` : "Non renseigné"}
CAC : ${startup.cac ? `${startup.cac.toLocaleString("fr-FR")} €` : "Non renseigné"}
LTV : ${startup.ltv ? `${startup.ltv.toLocaleString("fr-FR")} €` : "Non renseigné"}
Marge brute : ${startup.gross_margin !== null && startup.gross_margin !== undefined ? `${startup.gross_margin}%` : "Non renseignée"}
Clients actifs : ${startup.active_customers ?? "Non renseigné"}
CA année précédente : ${startup.revenue_last_year ? `${startup.revenue_last_year.toLocaleString("fr-FR")} €` : "Non renseigné"}

--- BUSINESS ---
Problème résolu : ${startup.problem}
Solution : ${startup.solution}
Taille de marché : ${startup.market_size}
Traction : ${startup.traction}
`;

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1500,
    messages: [
      {
        role: "user",
        content: `Tu es un analyste financier spécialisé en venture capital. Analyse cette startup et produis un rapport financier structuré destiné aux investisseurs.

${financialData}

Réponds UNIQUEMENT avec un JSON valide (sans markdown, sans backticks) dans ce format exact :
{
  "financial_health_score": <nombre entre 0 et 100>,
  "growth_trajectory": "<weak|moderate|strong|exceptional>",
  "unit_economics": {
    "ltv_cac_ratio": <nombre ou null si données manquantes>,
    "assessment": "<évaluation courte ex: Excellent (>5), Sain (3-5), Faible (<1)>",
    "comment": "<1-2 phrases d'explication>"
  },
  "burn_efficiency": "<1-2 phrases sur l'efficacité de la consommation de cash>",
  "key_strengths": ["<force 1>", "<force 2>", "<force 3 max>"],
  "key_risks": ["<risque 1>", "<risque 2>", "<risque 3 max>"],
  "investment_readiness": "<not_ready|soon|ready>",
  "summary": "<Résumé narratif de 3-4 phrases pour un investisseur VC, objectif et factuel>"
}`,
      },
    ],
  });

  const content = response.content[0];
  if (content.type !== "text") {
    throw new Error("Réponse Claude invalide");
  }

  return JSON.parse(content.text) as FinancialAnalysis;
}
