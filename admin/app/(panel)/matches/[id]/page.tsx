import { redirect } from "next/navigation";
import DataTable from "@/components/DataTable";
import StatusPill from "@/components/StatusPill";
import { getAuthToken } from "@/lib/auth";
import { ApiError } from "@/lib/backend";
import { getMatch, getParticipants, updateMatch, updateMatchStatus } from "@/services/matchesAdmin";

async function saveAction(id: string, formData: FormData) {
  "use server";
  try {
    await updateMatch(getAuthToken(), id, {
      title: String(formData.get("title") || ""),
      timeDate: String(formData.get("timeDate") || ""),
    });
  } catch (e) {
    if (e instanceof ApiError && e.status === 401) redirect("/login?error=Unauthorized");
    throw e;
  }
  redirect(`/matches/${id}`);
}

async function resultAction(id: string, formData: FormData) {
  "use server";
  try {
    await updateMatchStatus(getAuthToken(), id, "result", {
      notice: String(formData.get("notice") || ""),
    });
  } catch (e) {
    if (e instanceof ApiError && e.status === 401) redirect("/login?error=Unauthorized");
    throw e;
  }
  redirect(`/matches/${id}`);
}

export default async function MatchDetailPage({ params }: { params: { id: string } }) {
  const token = getAuthToken();
  const match = await getMatch(token, params.id).catch((e) => {
    if (e instanceof ApiError && e.status === 401) redirect("/login?error=Unauthorized");
    throw e;
  });
  const participants = await getParticipants(token, params.id).catch(() => [] as unknown[]);
  const m = match as Record<string, unknown>;
  return (
    <div style={{ display: "grid", gap: 16 }}>
      <h1 style={{ margin: 0 }}>{String(m.title ?? params.id)}</h1>
      <StatusPill status={String(m.status ?? "—")} />
      <div className="card">Time: {String(m.timeDate ?? "—")}</div>
      <h2>Participants ({participants.length})</h2>
      <DataTable
        columns={["Participant"]}
        rows={participants.slice(0, 100).map((p) => [JSON.stringify(p).slice(0, 120)])}
        empty="No participants"
      />
      <h2>Edit</h2>
      <form action={saveAction.bind(null, params.id)} className="row">
        <input name="title" defaultValue={String(m.title ?? "")} required />
        <input name="timeDate" defaultValue={String(m.timeDate ?? "")} />
        <button type="submit">Save</button>
      </form>
      <h2>Publish result</h2>
      <form action={resultAction.bind(null, params.id)} className="row">
        <input name="notice" placeholder="result notice" />
        <button type="submit">Mark result</button>
      </form>
    </div>
  );
}
