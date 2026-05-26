import { getSupabase } from "@/lib/chotu/supabase";

export const MESSAGES_PER_IP_PER_DAY = 25;

function todayUTC(): string {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}

export async function incrementAndCheck(
  ip: string,
): Promise<{ allowed: boolean; count: number }> {
  const supabase = getSupabase();
  if (!supabase) return { allowed: true, count: 0 };
  const day = todayUTC();
  const { data, error } = await supabase
    .from("vipassana_rate_limit")
    .select("count")
    .eq("ip", ip)
    .eq("day", day)
    .maybeSingle();

  if (error) {
    console.error("rate limit select failed", error);
    return { allowed: true, count: 0 };
  }

  const count = (data?.count ?? 0) + 1;

  const { error: upsertErr } = await supabase
    .from("vipassana_rate_limit")
    .upsert(
      { ip, day, count, updated_at: new Date().toISOString() },
      { onConflict: "ip,day" },
    );
  if (upsertErr) {
    console.error("rate limit upsert failed", upsertErr);
  }

  return { allowed: count <= MESSAGES_PER_IP_PER_DAY, count };
}

export function getClientIP(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  const realIP = req.headers.get("x-real-ip");
  if (realIP) return realIP.trim();
  return "unknown";
}
