import { redirect } from "next/navigation";
import { getAuthToken } from "@/lib/auth";
import { ApiError } from "@/lib/backend";
import { getSettings, saveSettings } from "@/services/settingsAdmin";

async function saveAction(formData: FormData) {
  "use server";
  const keys = [
    "supportUrl", "announcement", "rules", "referCoins", "downloadUrl", "latestVersion",
    "faq", "about", "privacy", "terms", "matchRules",
  ];
  const payload: Record<string, unknown> = {};
  for (const k of keys) {
    const v = formData.get(k);
    if (v !== null) payload[k] = k === "referCoins" ? Number(v) : String(v);
  }
  try {
    const bannersRaw = String(formData.get("banners") || "");
    if (bannersRaw) {
      try {
        payload.banners = JSON.parse(bannersRaw);
      } catch {
        redirect("/settings?error=bad-banners");
      }
    }
    await saveSettings(getAuthToken(), payload);
  } catch (e) {
    if (e instanceof ApiError && e.status === 401) redirect("/login?error=Unauthorized");
    throw e;
  }
  redirect("/settings");
}

const FIELDS = [
  "supportUrl", "announcement", "rules", "referCoins", "downloadUrl", "latestVersion",
  "faq", "about", "privacy", "terms", "matchRules",
];

export default async function SettingsPage() {
  const s = (await getSettings(getAuthToken()).catch((e) => {
    if (e instanceof ApiError && e.status === 401) redirect("/login?error=Unauthorized");
    throw e;
  })) as Record<string, unknown>;
  return (
    <div style={{ display: "grid", gap: 16 }}>
      <h1 style={{ margin: 0 }}>Settings (GET public, PUT authed)</h1>
      <form action={saveAction} className="card" style={{ display: "grid", gap: 12, maxWidth: 720 }}>
        {FIELDS.map((f) => (
          <label key={f} style={{ display: "grid", gap: 4 }}>
            {f}
            {["rules", "faq", "about", "privacy", "terms", "matchRules"].includes(f) ? (
              <textarea name={f} defaultValue={String(s[f] ?? "")} rows={3} />
            ) : (
              <input name={f} defaultValue={String(s[f] ?? "")} />
            )}
          </label>
        ))}
        <label style={{ display: "grid", gap: 4 }}>
          banners (JSON array ≤5, img+link https)
          <textarea name="banners" defaultValue={JSON.stringify(s.banners ?? [], null, 2)} rows={4} />
        </label>
        <div><button type="submit">Save</button></div>
      </form>
    </div>
  );
}
