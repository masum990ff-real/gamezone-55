import { apiFetch } from "@/lib/backend";

export async function deleteInvalidTokens(token: string | null) {
  const env = await apiFetch("/api/tokens/invalid", token, { method: "DELETE" });
  return env.data;
}
