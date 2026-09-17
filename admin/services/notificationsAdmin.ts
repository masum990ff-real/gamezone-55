import { apiFetch } from "@/lib/backend";
import type { NotificationItem, Paged } from "@/types";

export async function sendNotification(
  token: string | null,
  input: { title: string; body: string; imageUrl?: string }
) {
  const env = await apiFetch("/api/notifications/send", token, {
    method: "POST",
    body: JSON.stringify({ title: input.title, body: input.body, imageUrl: input.imageUrl || "" }),
  });
  return env.data;
}

export async function getHistory(
  token: string | null,
  opts: { page?: number; limit?: number; cursor?: string } = {}
): Promise<Paged<NotificationItem>> {
  const p = new URLSearchParams();
  p.set("page", String(opts.page ?? 1));
  p.set("limit", String(opts.limit ?? 20));
  if (opts.cursor) p.set("cursor", opts.cursor);
  const env = await apiFetch<Paged<NotificationItem>>(`/api/notifications/history?${p}`, token);
  return env.data;
}

export async function getStats(
  token: string | null
): Promise<{ devices: number; notifications: number; users: number }> {
  const env = await apiFetch<{ devices: number; notifications: number; users: number }>(
    "/api/notifications/stats",
    token
  );
  return env.data as { devices: number; notifications: number; users: number };
}
