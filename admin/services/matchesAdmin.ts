import { apiFetch } from "@/lib/backend";
import type { Match } from "@/types";

export async function listMatches(
  token: string | null,
  opts: { categoryId?: string; status?: string } = {}
): Promise<Match[]> {
  const p = new URLSearchParams();
  if (opts.categoryId) p.set("categoryId", opts.categoryId);
  if (opts.status) p.set("status", opts.status);
  const q = p.toString() ? `?${p}` : "";
  const env = await apiFetch<{ matches?: Match[] } | Match[]>(`/api/matches${q}`, token);
  const d = env.data as { matches?: Match[] };
  if (Array.isArray(d)) return d;
  return d.matches || [];
}

export async function getMatch(token: string | null, id: string): Promise<Match> {
  const env = await apiFetch<Match>(`/api/matches/${encodeURIComponent(id)}`, token);
  return env.data;
}

export async function createMatch(token: string | null, payload: Record<string, unknown>) {
  const env = await apiFetch("/api/matches", token, { method: "POST", body: JSON.stringify(payload) });
  return env.data;
}

export async function updateMatch(token: string | null, id: string, payload: Record<string, unknown>) {
  const env = await apiFetch(`/api/matches/${encodeURIComponent(id)}`, token, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  return env.data;
}

export async function deleteMatch(token: string | null, id: string) {
  const env = await apiFetch(`/api/matches/${encodeURIComponent(id)}`, token, { method: "DELETE" });
  return env.data;
}

export async function getParticipants(token: string | null, id: string) {
  const env = await apiFetch<{ participants?: unknown[] } | unknown[]>(
    `/api/matches/${encodeURIComponent(id)}/participants`,
    token
  );
  const d = env.data as { participants?: unknown[] };
  return Array.isArray(d) ? d : d.participants || [];
}

export async function updateMatchStatus(
  token: string | null,
  id: string,
  status: "ongoing" | "result",
  extra: Record<string, unknown> = {}
) {
  const env = await apiFetch(`/api/matches/${encodeURIComponent(id)}/status`, token, {
    method: "PUT",
    body: JSON.stringify({ status, ...extra }),
  });
  return env.data;
}
