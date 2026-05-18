import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  const { email, type } = await request.json();

  if (!email || !type || !["curious", "pay"].includes(type)) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }

  const normalized = email.trim().toLowerCase();
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRe.test(normalized)) {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 });
  }

  const { data: existing } = await supabase
    .from("chotu_signups")
    .select("id, type")
    .eq("email", normalized)
    .maybeSingle();

  if (existing) {
    return NextResponse.json({ error: "already_signed_up", existing_type: existing.type }, { status: 409 });
  }

  const { error } = await supabase
    .from("chotu_signups")
    .insert({ email: normalized, type });

  if (error) {
    return NextResponse.json({ error: "db_error" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
