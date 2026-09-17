import { apiFetch } from "@/lib/backend";
import type { Staff } from "@/types";

export async function listStaff(token: string | null): Promise<Staff[]> {
  const env = await apiFetch<{ staffs?: Staff[] } | Staff[]>("/api/staff", token);
  const d = env.data as { staffs?: Staff[] };
  if (Array.isArray(d)) return d;
  return d.staffs || [];
}

export async function createStaff(
  token: string | null,
  input: { email: string; password: string; permissions: string[] }
) {
  const env = await apiFetch("/api/staff", token, { method: "POST", body: JSON.stringify(input) });
  return env.data;
}

export async function updateStaff(token: string | null, id: string, payload: Record<string, unknown>) {
  const env = await apiFetch(`/api/staff/${encodeURIComponent(id)}`, token, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  return env.data;
}

export async function deleteStaff(token: string | null, id: string) {
  const env = await apiFetch(`/api/staff/${encodeURIComponent(id)}`, token, { method: "DELETE" });
  return env.data;
}
