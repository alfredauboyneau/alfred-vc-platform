import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedRouteContext } from "@/lib/supabase-server";
import { sendReportEmail } from "@/lib/send-report";

type Lang = "fr" | "en";

export async function POST(req: NextRequest) {
  try {
    const { supabase, user } = await getAuthenticatedRouteContext();

    if (!user) {
      return NextResponse.json({ error: "Authentification requise" }, { status: 401 });
    }

    const { startup_id, lang = "fr" } = await req.json();
    const normalizedLang: Lang = lang === "en" ? "en" : "fr";

    if (!startup_id) {
      return NextResponse.json({ error: "startup_id requis" }, { status: 400 });
    }

    const { data: startup, error: startupError } = await supabase
      .from("startups")
      .select("*")
      .eq("id", startup_id)
      .eq("user_id", user.id)
      .single();

    if (startupError || !startup || !startup.financial_analysis) {
      return NextResponse.json({ error: "Startup introuvable" }, { status: 404 });
    }

    const { data: matches, error: matchesError } = await supabase
      .from("matches")
      .select("*, venture_capital:venture_capitals(*)")
      .eq("startup_id", startup_id)
      .order("score", { ascending: false });

    if (matchesError) {
      return NextResponse.json({ error: matchesError.message }, { status: 500 });
    }

    const result = await sendReportEmail({
      startup,
      matches: matches ?? [],
      financialAnalysis: startup.financial_analysis,
      lang: normalizedLang,
    });

    return NextResponse.json(result);
  } catch (err) {
    console.error("[send-report] Erreur:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erreur d'envoi de l'email" },
      { status: 500 }
    );
  }
}
