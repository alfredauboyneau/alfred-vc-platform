import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { analyzeStartupFinancials } from "@/lib/analyze";
import { matchStartupWithVCs } from "@/lib/matching";

export async function POST(req: NextRequest) {
  try {
    const { startup_id, lang = "fr" } = await req.json();

    if (!startup_id) {
      return NextResponse.json({ error: "startup_id requis" }, { status: 400 });
    }

    // 1. Récupérer la startup
    const { data: startup, error: startupError } = await supabase
      .from("startups")
      .select("*")
      .eq("id", startup_id)
      .single();

    if (startupError || !startup) {
      return NextResponse.json({ error: "Startup introuvable" }, { status: 404 });
    }

    // 2. Analyse financière (si pas encore faite)
    let financialAnalysis = startup.financial_analysis;
    if (!financialAnalysis) {
      financialAnalysis = await analyzeStartupFinancials(startup, lang);
      await supabase
        .from("startups")
        .update({ financial_analysis: financialAnalysis })
        .eq("id", startup_id);
    }

    // 3. Récupérer tous les VCs
    const { data: vcs, error: vcsError } = await supabase
      .from("venture_capitals")
      .select("*");

    if (vcsError || !vcs || vcs.length === 0) {
      return NextResponse.json(
        { error: "Aucun VC disponible en base" },
        { status: 404 }
      );
    }

    // 4. Matching IA
    const matchResults = await matchStartupWithVCs(startup, vcs, financialAnalysis, lang);

    // 5. Supprimer les anciens matches pour cette startup
    await supabase.from("matches").delete().eq("startup_id", startup_id);

    // 6. Insérer les nouveaux matches
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

    // 7. Envoyer le rapport par email (non-bloquant)
    try {
      const { data: fullMatches } = await supabase
        .from("matches")
        .select("*, venture_capital:venture_capitals(*)")
        .eq("startup_id", startup_id)
        .order("score", { ascending: false });

      await fetch(`${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/api/send-report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          startup,
          matches: fullMatches ?? [],
          financial_analysis: financialAnalysis,
          lang,
        }),
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
