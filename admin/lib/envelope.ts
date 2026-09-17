export type ApiEnvelope<T> = { success: boolean; data: T; message: string };

export function ok<T>(data: T, message = ""): ApiEnvelope<T> {
  return { success: true, data, message };
}

export function fail<T>(message: string, data?: T): ApiEnvelope<T> {
  return { success: false, data: (data ?? ({} as T)), message };
}

export function unwrap<T>(env: ApiEnvelope<T>): T {
  if (!env || env.success !== true) throw new Error(env?.message || "Request failed");
  return env.data;
}
