import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const { data, error } = await supabase
    .from("chotu_signups")
    .select("type");

  if (error) return NextResponse.json({ curious: 0, pay: 0 });

  const curious = data.filter((r) => r.type === "curious").length;
  const pay = data.filter((r) => r.type === "pay").length;

  return NextResponse.json({ curious, pay });
}

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

  const { error } = await supabase
    .from("chotu_signups")
    .upsert({ email: normalized, type }, { onConflict: "email" });

  if (error) return NextResponse.json({ error: "db_error" }, { status: 500 });

  return NextResponse.json({ ok: true });
}
