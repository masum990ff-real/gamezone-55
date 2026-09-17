import { redirect } from "next/navigation";
import DataTable from "@/components/DataTable";
import { getAuthToken } from "@/lib/auth";
import { ApiError } from "@/lib/backend";
import { banUser, listUsers, unbanUser } from "@/services/usersAdmin";

async function banAction(formData: FormData) {
  "use server";
  const uid = String(formData.get("uid") || "");
  const reason = String(formData.get("reason") || "");
  try {
    await banUser(getAuthToken(), uid, reason);
  } catch (e) {
    if (e instanceof ApiError && e.status === 401) redirect("/login?error=Unauthorized");
    throw e;
  }
  redirect("/users");
}

async function unbanAction(formData: FormData) {
  "use server";
  const uid = String(formData.get("uid") || "");
  try {
    await unbanUser(getAuthToken(), uid);
  } catch (e) {
    if (e instanceof ApiError && e.status === 401) redirect("/login?error=Unauthorized");
    throw e;
  }
  redirect("/users");
}

export default async function UsersPage({
  searchParams,
}: {
  searchParams?: { page?: string; q?: string; cursor?: string };
}) {
  const page = Math.max(1, parseInt(searchParams?.page || "1") || 1);
  const data = await listUsers(getAuthToken(), {
    page,
    limit: 20,
    q: searchParams?.q,
    cursor: searchParams?.cursor,
  }).catch((e) => {
    if (e instanceof ApiError && e.status === 401) redirect("/login?error=Unauthorized");
    throw e;
  });
  const rows = data.items.map((u) => {
    const uid = String(u.uid ?? u.id ?? "");
    const banned = Boolean(u.banned) || String(u.status || "").toLowerCase() === "banned";
    return { uid, name: String(u.username ?? u.email ?? uid), phone: String(u.phone ?? "—"), banned };
  });
  return (
    <div style={{ display: "grid", gap: 16 }}>
      <h1 style={{ margin: 0 }}>Users</h1>
      <form method="get" className="row">
        <input name="q" placeholder="Search username" defaultValue={searchParams?.q || ""} />
        <button type="submit">Search</button>
      </form>
      <DataTable
        columns={["User", "Phone", "Status", "Action"]}
        rows={rows.map((r) => [r.name, r.phone, bannedLabel(r.banned), r.uid])}
        empty="No users"
      />
      <div className="row">
        {page > 1 ? <a href={`/users?page=${page - 1}${searchParams?.q ? `&q=${encodeURIComponent(searchParams.q)}` : ""}`}>Prev</a> : null}
        <span>Page {data.page} of {Math.max(1, data.totalPages)} ({data.total} total)</span>
        {data.page < data.totalPages ? <a href={`/users?page=${page + 1}${searchParams?.q ? `&q=${encodeURIComponent(searchParams.q)}` : ""}`}>Next</a> : null}
        {data.nextCursor ? <a href={`/users?page=${page + 1}&cursor=${encodeURIComponent(data.nextCursor)}`}>Next (cursor)</a> : null}
      </div>
      <h2>Ban / Unban</h2>
      <div className="card" style={{ display: "grid", gap: 12 }}>
        <form action={banAction} className="row">
          <input name="uid" placeholder="uid" required />
          <input name="reason" placeholder="reason (≤200)" maxLength={200} style={{ minWidth: 240 }} />
          <button type="submit">Ban</button>
        </form>
        <form action={unbanAction} className="row">
          <input name="uid" placeholder="uid" required />
          <button type="submit">Unban</button>
        </form>
      </div>
    </div>
  );
}

function bannedLabel(_banned: boolean): string {
  return _banned ? "banned" : "active";
}

