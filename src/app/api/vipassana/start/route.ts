import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/chotu/supabase";
import { getClientIP } from "@/lib/chotu/rate-limit";

export const runtime = "nodejs";

type Body = {
  name?: string;
  email?: string;
};

export async function POST(request: Request) {
  let body: Body = {};
  try {
    body = await request.json();
  } catch {
    // empty body is fine — name + email are optional
  }

  const name = body.name?.trim() || null;
  const email = body.email?.trim().toLowerCase() || null;

  if (email) {
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!ok) {
      return NextResponse.json({ error: "invalid_email" }, { status: 400 });
    }
  }

  const ip = getClientIP(request);
  const ua = request.headers.get("user-agent") || null;

  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json({ error: "db_not_configured" }, { status: 503 });
  }

  const { data, error } = await supabase
    .from("vipassana_conversations")
    .insert({ name, email, ip, user_agent: ua })
    .select("id")
    .single();

  if (error || !data) {
    console.error("start failed", error);
    return NextResponse.json({ error: "db_error" }, { status: 500 });
  }

  return NextResponse.json({ conversation_id: data.id });
}
