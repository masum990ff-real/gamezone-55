import { redirect } from "next/navigation";
import DataTable from "@/components/DataTable";
import { getAuthToken } from "@/lib/auth";
import { ApiError } from "@/lib/backend";
import { createMatch, deleteMatch, listMatches, updateMatchStatus } from "@/services/matchesAdmin";
import { listCategories } from "@/services/categoriesAdmin";

async function createAction(formData: FormData) {
  "use server";
  const payload: Record<string, unknown> = {
    title: String(formData.get("title") || ""),
    matchNumber: String(formData.get("matchNumber") || ""),
    categoryId: String(formData.get("categoryId") || ""),
    timeDate: String(formData.get("timeDate") || ""),
    status: "upcoming",
  };
  try {
    await createMatch(getAuthToken(), payload);
  } catch (e) {
    if (e instanceof ApiError && e.status === 401) redirect("/login?error=Unauthorized");
    throw e;
  }
  redirect("/matches");
}

async function deleteAction(formData: FormData) {
  "use server";
  try {
    await deleteMatch(getAuthToken(), String(formData.get("id") || ""));
  } catch (e) {
    if (e instanceof ApiError && e.status === 401) redirect("/login?error=Unauthorized");
    throw e;
  }
  redirect("/matches");
}

async function ongoingAction(formData: FormData) {
  "use server";
  try {
    await updateMatchStatus(getAuthToken(), String(formData.get("id") || ""), "ongoing", {
      roomId: String(formData.get("roomId") || ""),
      roomPass: String(formData.get("roomPass") || ""),
      notice: String(formData.get("notice") || ""),
    });
  } catch (e) {
    if (e instanceof ApiError && e.status === 401) redirect("/login?error=Unauthorized");
    throw e;
  }
  redirect("/matches");
}

export default async function MatchesPage({
  searchParams,
}: {
  searchParams?: { categoryId?: string; status?: string };
}) {
  const token = getAuthToken();
  const [matches, categories] = await Promise.all([
    listMatches(token, { categoryId: searchParams?.categoryId, status: searchParams?.status }).catch((e) => {
      if (e instanceof ApiError && e.status === 401) redirect("/login?error=Unauthorized");
      throw e;
    }),
    listCategories(token).catch(() => []),
  ]);
  return (
    <div style={{ display: "grid", gap: 16 }}>
      <h1 style={{ margin: 0 }}>Matches</h1>
      <form method="get" className="row">
        <select name="categoryId" defaultValue={searchParams?.categoryId || ""}>
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <select name="status" defaultValue={searchParams?.status || ""}>
          <option value="">All statuses</option>
          <option value="upcoming">upcoming</option>
          <option value="ongoing">ongoing</option>
          <option value="result">result</option>
        </select>
        <button type="submit">Filter</button>
      </form>
      <DataTable
        columns={["Title", "Match #", "Category", "Time", "Status", "Open"]}
        rows={matches.map((m) => [
          String(m.title ?? "—"),
          String(m.matchNumber ?? "—"),
          String(m.categoryId ?? m.category ?? "—"),
          String(m.timeDate ?? "—"),
          String(m.status ?? "—"),
          `/matches/${m.id}`,
        ])}
        empty="No matches"
      />
      <h2>Create match</h2>
      <form action={createAction} className="card" style={{ display: "grid", gap: 8 }}>
        <div className="row">
          <input name="title" placeholder="Title (2-80)" required minLength={2} maxLength={80} />
          <input name="matchNumber" placeholder="Match number" required />
          <input name="categoryId" placeholder="categoryId" required />
          <input name="timeDate" type="datetime-local" required />
        </div>
        <div><button type="submit">Create</button></div>
      </form>
      <h2>Delete / Go ongoing</h2>
      <div className="card" style={{ display: "grid", gap: 12 }}>
        <form action={deleteAction} className="row">
          <input name="id" placeholder="match id" required />
          <button type="submit">Delete</button>
        </form>
        <form action={ongoingAction} className="row">
          <input name="id" placeholder="match id" required />
          <input name="roomId" placeholder="room id*" required />
          <input name="roomPass" placeholder="room pass*" required />
          <input name="notice" placeholder="notice (≤1000)" maxLength={1000} />
          <button type="submit">Mark ongoing</button>
        </form>
      </div>
    </div>
  );
}
