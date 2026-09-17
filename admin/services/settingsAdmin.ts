import { apiFetch } from "@/lib/backend";

export async function getSettings(token: string | null): Promise<Record<string, unknown>> {
  const env = await apiFetch<Record<string, unknown>>("/api/settings", token);
  return (env.data || {}) as Record<string, unknown>;
}

export async function saveSettings(token: string | null, payload: Record<string, unknown>) {
  const env = await apiFetch("/api/settings", token, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  return env.data;
}
