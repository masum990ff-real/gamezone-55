import { apiFetch } from "@/lib/backend";

export type PaymentConfig = { configured?: boolean; masked?: string; webhookUrl?: string; [k: string]: unknown };

export async function getPaymentConfig(token: string | null): Promise<PaymentConfig> {
  const env = await apiFetch<PaymentConfig>("/api/payment-config", token);
  return (env.data || {}) as PaymentConfig;
}

export async function savePaymentConfig(token: string | null, zapKey: string) {
  const env = await apiFetch("/api/payment-config", token, {
    method: "PUT",
    body: JSON.stringify({ zapKey }),
  });
  return env.data;
}
