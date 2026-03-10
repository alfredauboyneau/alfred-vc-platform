import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { analyzeStartupFinancials } from "@/lib/analyze";

export async function POST(req: NextRequest) {
  try {
    const { startup_id } = await req.json();

    if (!startup_id) {
      return NextResponse.json({ error: "startup_id requis" }, { status: 400 });
    }

    // Récupérer la startup
    const { data: startup, error: fetchError } = await supabase
      .from("startups")
      .select("*")
      .eq("id", startup_id)
      .single();

    if (fetchError || !startup) {
      return NextResponse.json({ error: "Startup introuvable" }, { status: 404 });
    }

    // Générer l'analyse financière
    const analysis = await analyzeStartupFinancials(startup);

    // Sauvegarder en base
    const { error: updateError } = await supabase
      .from("startups")
      .update({ financial_analysis: analysis })
      .eq("id", startup_id);

    if (updateError) throw updateError;

    return NextResponse.json({ success: true, analysis });
  } catch (err) {
    console.error("[analyze] erreur:", err);
    return NextResponse.json(
      { error: "Erreur lors de l'analyse" },
      { status: 500 }
    );
  }
}
