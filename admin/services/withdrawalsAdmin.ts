import { apiFetch } from "@/lib/backend";
import type { Paged, Withdrawal } from "@/types";

export async function listWithdrawals(
  token: string | null,
  opts: { page?: number; limit?: number; status?: string } = {}
): Promise<Paged<Withdrawal>> {
  const p = new URLSearchParams();
  p.set("page", String(opts.page ?? 1));
  p.set("limit", String(opts.limit ?? 20));
  if (opts.status) p.set("status", opts.status);
  const env = await apiFetch<Paged<Withdrawal> | Withdrawal[]>(`/api/withdrawals?${p}`, token);
  const d = env.data as Paged<Withdrawal>;
  if (Array.isArray(d)) return { items: d, page: 1, limit: d.length, total: d.length, totalPages: 1 };
  return { items: d.items || [], page: d.page ?? 1, limit: d.limit ?? 20, total: d.total ?? 0, totalPages: d.totalPages ?? 1 };
}

export async function updateWithdrawalStatus(
  token: string | null,
  id: string,
  action: "approve" | "success" | "reject" | "failed"
) {
  const env = await apiFetch(`/api/withdrawals/${encodeURIComponent(id)}/status`, token, {
    method: "PUT",
    body: JSON.stringify({ action }),
  });
  return env.data;
}
