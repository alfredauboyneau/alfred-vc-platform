import { NextRequest, NextResponse } from "next/server";
import { analyzeStartupFinancials } from "@/lib/analyze";
import { matchStartupWithVCs } from "@/lib/matching";
import { getAuthenticatedRouteContext } from "@/lib/supabase-server";
import { sendReportEmail } from "@/lib/send-report";

export async function POST(req: NextRequest) {
  try {
    const { supabase, user } = await getAuthenticatedRouteContext();
    const { startup_id, lang = "fr" } = await req.json();
    const normalizedLang = lang === "en" ? "en" : "fr";

    if (!user) {
      return NextResponse.json({ error: "Authentification requise" }, { status: 401 });
    }

    if (!startup_id) {
      return NextResponse.json({ error: "startup_id requis" }, { status: 400 });
    }

    const { data: startup, error: startupError } = await supabase
      .from("startups")
      .select("*")
      .eq("id", startup_id)
      .eq("user_id", user.id)
      .single();

    if (startupError || !startup) {
      return NextResponse.json({ error: "Startup introuvable" }, { status: 404 });
    }

    let financialAnalysis = startup.financial_analysis;
    if (!financialAnalysis) {
      financialAnalysis = await analyzeStartupFinancials(startup, normalizedLang);
      await supabase
        .from("startups")
        .update({ financial_analysis: financialAnalysis })
        .eq("id", startup_id);
    }

    const { data: vcs, error: vcsError } = await supabase
      .from("venture_capitals")
      .select("*");

    if (vcsError || !vcs || vcs.length === 0) {
      return NextResponse.json(
        { error: "Aucun VC disponible en base" },
        { status: 404 }
      );
    }

    const matchResults = await matchStartupWithVCs(startup, vcs, financialAnalysis, normalizedLang);

    await supabase.from("matches").delete().eq("startup_id", startup_id);

    const matchesPayload = matchResults.map((m) => ({
      startup_id,
      vc_id: m.vc_id,
      score: m.score,
      analysis: m.analysis,
      status: "pending" as const,
    }));

    const { error: insertError } = await supabase
      .from("matches")
      .insert(matchesPayload);

    if (insertError) throw insertError;

    try {
      const { data: fullMatches } = await supabase
        .from("matches")
        .select("*, venture_capital:venture_capitals(*)")
        .eq("startup_id", startup_id)
        .order("score", { ascending: false });

      await sendReportEmail({
        startup,
        matches: fullMatches ?? [],
        financialAnalysis,
        lang: normalizedLang,
      });
    } catch (emailErr) {
      console.warn("[match] Email non envoyé (non-bloquant):", emailErr);
    }

    return NextResponse.json({
      success: true,
      matches_count: matchResults.length,
      top_matches: matchResults.slice(0, 3),
    });
  } catch (err) {
    console.error("[match] erreur:", err);
    return NextResponse.json(
      { error: "Erreur lors du matching" },
      { status: 500 }
    );
  }
}
