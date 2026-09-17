import { apiFetch } from "@/lib/backend";
import type { Deposit, Paged } from "@/types";

export async function listDeposits(
  token: string | null,
  opts: { page?: number; limit?: number; uid?: string } = {}
): Promise<Paged<Deposit>> {
  const p = new URLSearchParams();
  p.set("page", String(opts.page ?? 1));
  p.set("limit", String(opts.limit ?? 20));
  if (opts.uid) p.set("uid", opts.uid);
  const env = await apiFetch<Paged<Deposit> | Deposit[]>(`/api/deposits?${p}`, token);
  const d = env.data as Paged<Deposit>;
  if (Array.isArray(d)) return { items: d, page: 1, limit: d.length, total: d.length, totalPages: 1 };
  return { items: d.items || [], page: d.page ?? 1, limit: d.limit ?? 20, total: d.total ?? 0, totalPages: d.totalPages ?? 1 };
}
