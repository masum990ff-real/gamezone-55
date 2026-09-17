import { apiFetch } from "@/lib/backend";
import type { AdminUser, Paged } from "@/types";

export async function listUsers(
  token: string | null,
  opts: { page?: number; limit?: number; q?: string; cursor?: string } = {}
): Promise<Paged<AdminUser>> {
  const p = new URLSearchParams();
  p.set("page", String(opts.page ?? 1));
  p.set("limit", String(opts.limit ?? 20));
  if (opts.q) p.set("q", opts.q);
  if (opts.cursor) p.set("cursor", opts.cursor);
  const env = await apiFetch<Paged<AdminUser> | AdminUser[]>(`/api/users?${p}`, token);
  const d = env.data as Paged<AdminUser>;
  if (Array.isArray(d)) return { items: d, page: 1, limit: d.length, total: d.length, totalPages: 1 };
  return { items: d.items || [], page: d.page ?? 1, limit: d.limit ?? 20, total: d.total ?? 0, totalPages: d.totalPages ?? 1, nextCursor: d.nextCursor };
}

export async function banUser(token: string | null, uid: string, reason: string) {
  const env = await apiFetch(`/api/users/${encodeURIComponent(uid)}/ban`, token, {
    method: "POST",
    body: JSON.stringify({ reason: reason || "" }),
  });
  return env.data;
}

export async function unbanUser(token: string | null, uid: string) {
  const env = await apiFetch(`/api/users/${encodeURIComponent(uid)}/unban`, token, {
    method: "POST",
    body: JSON.stringify({}),
  });
  return env.data;
}
