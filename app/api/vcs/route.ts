import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedRouteContext } from "@/lib/supabase-server";

export async function GET() {
  const { supabase, user } = await getAuthenticatedRouteContext();

  if (!user) {
    return NextResponse.json({ error: "Authentification requise" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("venture_capitals")
    .select("*")
    .eq("user_id", user.id)
    .order("name");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const { supabase, user } = await getAuthenticatedRouteContext();
  const body = await req.json();

  if (!user) {
    return NextResponse.json({ error: "Authentification requise" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("venture_capitals")
    .insert({
      ...body,
      user_id: user.id,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
