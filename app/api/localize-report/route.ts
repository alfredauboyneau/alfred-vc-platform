import { NextRequest, NextResponse } from "next/server";
import { localizeReportItems, type LocalizedReportItem, type SupportedLanguage } from "@/lib/report-localization";
import { getAuthenticatedRouteContext } from "@/lib/supabase-server";

export async function POST(req: NextRequest) {
  try {
    const { user } = await getAuthenticatedRouteContext();

    if (!user) {
      return NextResponse.json({ error: "Authentification requise" }, { status: 401 });
    }

    const { items = [], target_lang = "fr" } = await req.json();

    if (!Array.isArray(items)) {
      return NextResponse.json({ error: "items must be an array" }, { status: 400 });
    }

    if (target_lang !== "fr" && target_lang !== "en") {
      return NextResponse.json({ error: "target_lang invalide" }, { status: 400 });
    }

    const localizedItems = await localizeReportItems(
      items as LocalizedReportItem[],
      target_lang as SupportedLanguage
    );

    return NextResponse.json({ items: localizedItems });
  } catch (error) {
    console.error("[localize-report] error:", error);
    return NextResponse.json({ error: "Erreur de localisation du rapport" }, { status: 500 });
  }
}
