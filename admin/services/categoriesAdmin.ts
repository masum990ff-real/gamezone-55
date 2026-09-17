import { apiFetch } from "@/lib/backend";
import type { Category } from "@/types";

export async function listCategories(token: string | null): Promise<Category[]> {
  const env = await apiFetch<{ categories?: Category[] } | Category[]>("/api/categories", token);
  const d = env.data as { categories?: Category[] };
  if (Array.isArray(d)) return d;
  return d.categories || [];
}

export async function createCategory(token: string | null, name: string, img: string) {
  const env = await apiFetch("/api/categories", token, {
    method: "POST",
    body: JSON.stringify({ name, img }),
  });
  return env.data;
}

export async function updateCategory(token: string | null, id: string, name: string, img: string) {
  const env = await apiFetch(`/api/categories/${encodeURIComponent(id)}`, token, {
    method: "PUT",
    body: JSON.stringify({ name, img }),
  });
  return env.data;
}

export async function deleteCategory(token: string | null, id: string) {
  const env = await apiFetch(`/api/categories/${encodeURIComponent(id)}`, token, { method: "DELETE" });
  return env.data;
}
