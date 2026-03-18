import { NextRequest, NextResponse } from "next/server";
import { analyzeStartupFinancials } from "@/lib/analyze";
import { getAuthenticatedRouteContext } from "@/lib/supabase-server";

export async function POST(req: NextRequest) {
  try {
    const { supabase, user } = await getAuthenticatedRouteContext();
    const { startup_id, lang = "fr" } = await req.json();

    if (!user) {
      return NextResponse.json({ error: "Authentification requise" }, { status: 401 });
    }

    if (!startup_id) {
      return NextResponse.json({ error: "startup_id requis" }, { status: 400 });
    }

    const { data: startup, error: fetchError } = await supabase
      .from("startups")
      .select("*")
      .eq("id", startup_id)
      .eq("user_id", user.id)
      .single();

    if (fetchError || !startup) {
      return NextResponse.json({ error: "Startup introuvable" }, { status: 404 });
    }

    const analysis = await analyzeStartupFinancials(startup, lang === "en" ? "en" : "fr");

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
