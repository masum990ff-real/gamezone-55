import { redirect } from "next/navigation";
import { BACKEND_URL, getAuthToken } from "@/lib/auth";
import { ApiError } from "@/lib/backend";
import { getPaymentConfig, savePaymentConfig } from "@/services/paymentConfigAdmin";

async function saveAction(formData: FormData) {
  "use server";
  try {
    await savePaymentConfig(getAuthToken(), String(formData.get("zapKey") || ""));
  } catch (e) {
    if (e instanceof ApiError && e.status === 401) redirect("/login?error=Unauthorized");
    throw e;
  }
  redirect("/settings/payment");
}

export default async function PaymentPage() {
  const cfg = await getPaymentConfig(getAuthToken()).catch((e) => {
    if (e instanceof ApiError && e.status === 401) redirect("/login?error=Unauthorized");
    throw e;
  });
  return (
    <div style={{ display: "grid", gap: 16 }}>
      <h1 style={{ margin: 0 }}>Payment config</h1>
      <div className="card" style={{ display: "grid", gap: 8 }}>
        <div>Configured: {String(cfg.configured ?? "—")}</div>
        <div>Masked: {String(cfg.masked ?? "—")}</div>
        <div>Webhook: {String(cfg.webhookUrl ?? `${BACKEND_URL}/api/payments/webhook`)}</div>
      </div>
      <form action={saveAction} className="card row" style={{ maxWidth: 560 }}>
        <input name="zapKey" placeholder="zapKey (10-200 chars)" required minLength={10} maxLength={200} style={{ minWidth: 280 }} />
        <button type="submit">Save</button>
      </form>
    </div>
  );
}
