import { BACKEND_URL } from "./auth";
import type { ApiEnvelope } from "./envelope";

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export async function apiFetch<T>(
  path: string,
  token: string | null,
  init?: RequestInit
): Promise<ApiEnvelope<T>> {
  const url = `${BACKEND_URL.replace(/\/$/, "")}${path}`;
  const res = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers || {}),
    },
    cache: "no-store",
  });
  let body: ApiEnvelope<T>;
  try {
    body = (await res.json()) as ApiEnvelope<T>;
  } catch {
    throw new ApiError(res.status, res.status === 401 ? "Unauthorized" : "Server error");
  }
  if (res.status === 401) throw new ApiError(401, body.message || "Unauthorized");
  if (!body.success) throw new ApiError(res.status, body.message || "Request failed");
  return body;
}
