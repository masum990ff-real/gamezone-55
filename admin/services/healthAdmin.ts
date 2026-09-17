import { BACKEND_URL } from "@/lib/auth";

export async function getHealth(): Promise<Record<string, unknown>> {
  const res = await fetch(`${BACKEND_URL.replace(/\/$/, "")}/api/health`, { cache: "no-store" });
  try {
    return (await res.json()) as Record<string, unknown>;
  } catch {
    return { ok: res.ok };
  }
}
