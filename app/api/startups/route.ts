import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedRouteContext } from "@/lib/supabase-server";

export async function GET(req: NextRequest) {
  const { supabase, user } = await getAuthenticatedRouteContext();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!user) {
    return NextResponse.json({ error: "Authentification requise" }, { status: 401 });
  }

  if (id) {
    const { data, error } = await supabase
      .from("startups")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 404 });
    return NextResponse.json(data);
  }

  const { data, error } = await supabase
    .from("startups")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
