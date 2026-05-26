import { getSupabase } from "@/lib/chotu/supabase";

// Sonnet 4.6 pricing (USD per 1M tokens):
//   input:           $3.00
//   cache write:     $3.75
//   cache read:      $0.30
//   output:          $15.00
// We bill in INR. USD→INR ~ 84.
const USD_INR = 84;

const PRICE_INPUT_PER_TOKEN = 3.0 / 1_000_000;
const PRICE_CACHE_WRITE_PER_TOKEN = 3.75 / 1_000_000;
const PRICE_CACHE_READ_PER_TOKEN = 0.30 / 1_000_000;
const PRICE_OUTPUT_PER_TOKEN = 15.0 / 1_000_000;

export const HARD_CAP_INR = 4500; // halt before INR 5000 budget
export const SOFT_CAP_INR = 4000; // warn over

type Usage = {
  input_tokens: number;
  output_tokens: number;
  cache_creation_input_tokens?: number | null;
  cache_read_input_tokens?: number | null;
};

export function usageCostINR(usage: Usage): number {
  const usd =
    usage.input_tokens * PRICE_INPUT_PER_TOKEN +
    (usage.cache_creation_input_tokens ?? 0) * PRICE_CACHE_WRITE_PER_TOKEN +
    (usage.cache_read_input_tokens ?? 0) * PRICE_CACHE_READ_PER_TOKEN +
    usage.output_tokens * PRICE_OUTPUT_PER_TOKEN;
  return usd * USD_INR;
}

export async function getCumulativeINR(): Promise<number> {
  const supabase = getSupabase();
  if (!supabase) return 0;
  const { data, error } = await supabase
    .from("vipassana_cost_tracker")
    .select("inr_total")
    .eq("id", 1)
    .maybeSingle();
  if (error || !data) return 0;
  return Number(data.inr_total) || 0;
}

export async function addCostINR(inr: number): Promise<number> {
  const supabase = getSupabase();
  if (!supabase) return 0;
  const current = await getCumulativeINR();
  const next = current + inr;
  const { error } = await supabase
    .from("vipassana_cost_tracker")
    .upsert({ id: 1, inr_total: next, updated_at: new Date().toISOString() });
  if (error) {
    console.error("cost tracker upsert failed", error);
  }
  return next;
}

export async function isOverHardCap(): Promise<boolean> {
  const current = await getCumulativeINR();
  return current >= HARD_CAP_INR;
}
