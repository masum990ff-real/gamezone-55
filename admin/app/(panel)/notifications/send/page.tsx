import { redirect } from "next/navigation";
import { getAuthToken } from "@/lib/auth";
import { ApiError } from "@/lib/backend";
import { sendNotification } from "@/services/notificationsAdmin";

async function sendAction(formData: FormData) {
  "use server";
  try {
    await sendNotification(getAuthToken(), {
      title: String(formData.get("title") || ""),
      body: String(formData.get("body") || ""),
      imageUrl: String(formData.get("imageUrl") || ""),
    });
  } catch (e) {
    if (e instanceof ApiError && e.status === 401) redirect("/login?error=Unauthorized");
    throw e;
  }
  redirect("/notifications/history");
}

export default function SendNotificationPage() {
  return (
    <div style={{ display: "grid", gap: 16 }}>
      <h1 style={{ margin: 0 }}>Send notification (topic: all_users)</h1>
      <form action={sendAction} className="card" style={{ display: "grid", gap: 12, maxWidth: 560 }}>
        <label style={{ display: "grid", gap: 4 }}>
          Title (≤100)
          <input name="title" required maxLength={100} />
        </label>
        <label style={{ display: "grid", gap: 4 }}>
          Body (≤500)
          <textarea name="body" required maxLength={500} rows={4} />
        </label>
        <label style={{ display: "grid", gap: 4 }}>
          Image URL (optional https://)
          <input name="imageUrl" maxLength={500} placeholder="https://..." />
        </label>
        <div><button type="submit">Broadcast</button></div>
      </form>
    </div>
  );
}
