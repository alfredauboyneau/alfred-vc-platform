import { anthropic } from "./claude";
import type { FinancialAnalysis } from "./supabase";

export type SupportedLanguage = "fr" | "en";

export type LocalizedReportItem = {
  id: string;
  financial_analysis?: FinancialAnalysis | null;
  match_analysis?: string | null;
};

const FRENCH_MARKERS = [
  " le ",
  " la ",
  " les ",
  " des ",
  " une ",
  " avec ",
  " pour ",
  " fonds ",
  " secteur ",
  " stade ",
  " ticket ",
  " historique ",
  " investissement ",
  " croissance ",
  " fourchette ",
  " comparables ",
  " déclar",
  " cohérent",
  " traction",
  " synthèse",
];

const ENGLISH_MARKERS = [
  " the ",
  " and ",
  " with ",
  " for ",
  " fund ",
  " funds ",
  " sector ",
  " stage ",
  " ticket ",
  " history ",
  " investment ",
  " growth ",
  " range ",
  " comparable ",
  " declared ",
  " aligned ",
  " traction ",
  " summary ",
];

function scoreMarkers(value: string, markers: string[]) {
  const normalized = ` ${value.toLowerCase()} `;

  return markers.reduce((total, marker) => {
    return total + (normalized.includes(marker) ? 1 : 0);
  }, 0);
}

function inferTextLanguage(value: string | null | undefined): SupportedLanguage {
  if (!value) return "fr";

  const trimmed = value.trim();
  if (!trimmed) return "fr";

  const accentScore = /[àâçéèêëîïôûùüÿœ]/i.test(trimmed) ? 2 : 0;
  const frenchScore = scoreMarkers(trimmed, FRENCH_MARKERS) + accentScore;
  const englishScore = scoreMarkers(trimmed, ENGLISH_MARKERS);

  if (englishScore > frenchScore) return "en";
  return "fr";
}

function inferAnalysisLanguage(analysis: FinancialAnalysis): SupportedLanguage {
  const combined = [
    analysis.summary,
    analysis.burn_efficiency,
    analysis.unit_economics?.assessment,
    analysis.unit_economics?.comment,
    ...(analysis.key_strengths ?? []),
    ...(analysis.key_risks ?? []),
  ]
    .filter(Boolean)
    .join(" ");

  return inferTextLanguage(combined);
}

function needsLocalization(item: LocalizedReportItem, targetLang: SupportedLanguage) {
  const financialAnalysisNeedsLocalization = item.financial_analysis
    ? inferAnalysisLanguage(item.financial_analysis) !== targetLang
    : false;

  const matchAnalysisNeedsLocalization = item.match_analysis
    ? inferTextLanguage(item.match_analysis) !== targetLang
    : false;

  return financialAnalysisNeedsLocalization || matchAnalysisNeedsLocalization;
}

function stripCodeFences(value: string) {
  const trimmed = value.trim();

  if (!trimmed.startsWith("```")) {
    return trimmed;
  }

  return trimmed.replace(/^```[\w]*\n?/, "").replace(/\n?```$/, "");
}

function chunkItems<T>(items: T[], size: number) {
  const chunks: T[][] = [];

  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }

  return chunks;
}

export async function localizeReportItems(
  items: LocalizedReportItem[],
  targetLang: SupportedLanguage
): Promise<LocalizedReportItem[]> {
  if (!items.length) return items;
  if (!process.env.ANTHROPIC_API_KEY?.trim()) return items;

  const itemsToTranslate = items.filter((item) => needsLocalization(item, targetLang));

  if (!itemsToTranslate.length) {
    return items.map((item) => ({
      ...item,
      financial_analysis: item.financial_analysis
        ? { ...item.financial_analysis, lang: targetLang }
        : item.financial_analysis,
    }));
  }

  const translatedById = new Map<string, LocalizedReportItem>();
  const targetLanguageLabel = targetLang === "en" ? "English" : "French";

  for (const chunk of chunkItems(itemsToTranslate, 8)) {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 5000,
      messages: [
        {
          role: "user",
          content: `You are a professional translator for venture capital reports.

Translate every human-readable field so the final result is entirely in ${targetLanguageLabel}.
Keep the meaning exact, keep the tone factual, and do not embellish.
Keep ids, numeric values, "growth_trajectory", "investment_readiness" and "ltv_cac_ratio" unchanged.
Do not add or remove fields.
If a value is already in ${targetLanguageLabel}, leave it as is.

Reply ONLY with valid JSON (no markdown, no backticks) in this exact format:
[
  {
    "id": "<same id>",
    "financial_analysis": {
      "financial_health_score": <same number>,
      "growth_trajectory": "<same enum>",
      "unit_economics": {
        "ltv_cac_ratio": <same number or null>,
        "assessment": "<translated text>",
        "comment": "<translated text>"
      },
      "burn_efficiency": "<translated text>",
      "key_strengths": ["<translated text>"],
      "key_risks": ["<translated text>"],
      "investment_readiness": "<same enum>",
      "summary": "<translated text>",
      "lang": "${targetLang}"
    },
    "match_analysis": "<translated text or null>"
  }
]

DATA:
${JSON.stringify(chunk)}`,
        },
      ],
    });

    const content = response.content[0];
    if (content.type !== "text") {
      throw new Error("Invalid translation response");
    }

    const parsed = JSON.parse(stripCodeFences(content.text)) as LocalizedReportItem[];

    for (const item of parsed) {
      translatedById.set(item.id, {
        ...item,
        financial_analysis: item.financial_analysis
          ? { ...item.financial_analysis, lang: targetLang }
          : item.financial_analysis,
      });
    }
  }

  return items.map((item) => {
    const translated = translatedById.get(item.id);

    if (!translated) {
      return {
        ...item,
        financial_analysis: item.financial_analysis
          ? { ...item.financial_analysis, lang: targetLang }
          : item.financial_analysis,
      };
    }

    return {
      ...item,
      ...translated,
      financial_analysis: translated.financial_analysis
        ? { ...translated.financial_analysis, lang: targetLang }
        : translated.financial_analysis,
    };
  });
}
