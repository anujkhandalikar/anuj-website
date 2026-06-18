import VipassanaClient from "./Client";

export const metadata = {
  title: "Chotu — Anuj's digital proxy",
  description:
    "Chotu is Anuj's digital stand-in, built in his own words. Ask anything.",
};

// Vipassana: 27 May 2026 → 7 June 2026. Returns 8 June.
const VIPASSANA_START = new Date("2026-05-27T00:00:00+05:30");
const VIPASSANA_END = new Date("2026-06-07T23:59:59+05:30");
const RETURN_DATE = new Date("2026-06-08T00:00:00+05:30");

function dayStatus(now: Date) {
  const total = 12; // 27 May to 7 June inclusive
  if (now < VIPASSANA_START) {
    const ms = VIPASSANA_START.getTime() - now.getTime();
    const days = Math.ceil(ms / (24 * 3600 * 1000));
    return { phase: "before" as const, days, total };
  }
  if (now > VIPASSANA_END) {
    return { phase: "after" as const, days: 0, total };
  }
  const ms = now.getTime() - VIPASSANA_START.getTime();
  const day = Math.floor(ms / (24 * 3600 * 1000)) + 1;
  return { phase: "during" as const, days: day, total };
}

export default function VipassanaPage() {
  const now = new Date();
  const status = dayStatus(now);
  return (
    <VipassanaClient
      status={status}
      returnDateISO={RETURN_DATE.toISOString()}
    />
  );
}
