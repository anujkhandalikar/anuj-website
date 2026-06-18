import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/chotu/supabase";

export const runtime = "nodejs";

type Body = {
  conversation_id?: string;
  name?: string;
  email?: string;
};

/**
 * Persist a name/email onto an existing conversation row when the visitor
 * fills the identify panel mid-chat. Voluntary — both fields optional.
 * (At session creation, /start already captures whatever was provided.)
 */
export async function POST(request: Request) {
  let body: Body = {};
  try {
    body = await request.json();
  } catch {
    // ignore — handled by the validation below
  }

  const conversationId = body.conversation_id;
  if (!conversationId) {
    return NextResponse.json({ error: "missing_conversation_id" }, { status: 400 });
  }

  const name = body.name?.trim() || null;
  const email = body.email?.trim().toLowerCase() || null;

  if (email) {
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!ok) {
      return NextResponse.json({ error: "invalid_email" }, { status: 400 });
    }
  }

  // nothing to persist
  if (!name && !email) {
    return NextResponse.json({ ok: true });
  }

  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json({ error: "db_not_configured" }, { status: 503 });
  }

  const patch: { name?: string; email?: string } = {};
  if (name) patch.name = name;
  if (email) patch.email = email;

  const { error } = await supabase
    .from("vipassana_conversations")
    .update(patch)
    .eq("id", conversationId);

  if (error) {
    console.error("identify failed", error);
    return NextResponse.json({ error: "db_error" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
