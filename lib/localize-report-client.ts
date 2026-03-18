import type { FinancialAnalysis } from "./supabase";

export type LocalizedReportItem = {
  id: string;
  financial_analysis?: FinancialAnalysis | null;
  match_analysis?: string | null;
};

export async function fetchLocalizedReportItems(
  items: LocalizedReportItem[],
  targetLang: "fr" | "en"
) {
  if (!items.length) {
    return [];
  }

  const response = await fetch("/api/localize-report", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      items,
      target_lang: targetLang,
    }),
  });

  if (!response.ok) {
    throw new Error("Unable to localize report content");
  }

  const data = await response.json();
  return Array.isArray(data.items) ? (data.items as LocalizedReportItem[]) : [];
}
