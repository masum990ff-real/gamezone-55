import { redirect } from "next/navigation";
import DataTable from "@/components/DataTable";
import { getAuthToken } from "@/lib/auth";
import { ApiError } from "@/lib/backend";
import { listWithdrawals, updateWithdrawalStatus } from "@/services/withdrawalsAdmin";

async function statusAction(formData: FormData) {
  "use server";
  const id = String(formData.get("id") || "");
  const action = String(formData.get("action") || "") as "approve" | "success" | "reject" | "failed";
  try {
    await updateWithdrawalStatus(getAuthToken(), id, action);
  } catch (e) {
    if (e instanceof ApiError && e.status === 401) redirect("/login?error=Unauthorized");
    throw e;
  }
  redirect("/withdrawals");
}

export default async function WithdrawalsPage({
  searchParams,
}: {
  searchParams?: { page?: string; status?: string };
}) {
  const page = Math.max(1, parseInt(searchParams?.page || "1") || 1);
  const data = await listWithdrawals(getAuthToken(), {
    page,
    limit: 20,
    status: searchParams?.status,
  }).catch((e) => {
    if (e instanceof ApiError && e.status === 401) redirect("/login?error=Unauthorized");
    throw e;
  });
  return (
    <div style={{ display: "grid", gap: 16 }}>
      <h1 style={{ margin: 0 }}>Withdrawals</h1>
      <form method="get" className="row">
        <select name="status" defaultValue={searchParams?.status || ""}>
          <option value="">All</option>
          <option value="pending">pending</option>
          <option value="success">success</option>
          <option value="rejected">rejected</option>
        </select>
        <button type="submit">Filter</button>
      </form>
      <DataTable
        columns={["Date", "User", "Email", "UPI", "Amount", "Method", "Status", "ID"]}
        rows={data.items.map((w) => [
          String(w.createdAt ?? "—"),
          String(w.username ?? w.uid ?? "—"),
          String(w.email ?? "—"),
          String(w.upiId ?? "—"),
          String(w.amount ?? "—"),
          String(w.method ?? "—"),
          String(w.status ?? "—"),
          w.id,
        ])}
        empty="No withdrawals"
      />
      <div className="row">
        {page > 1 ? <a href={`/withdrawals?page=${page - 1}`}>Prev</a> : null}
        <span>Page {data.page} of {Math.max(1, data.totalPages)}</span>
        {data.page < data.totalPages ? <a href={`/withdrawals?page=${page + 1}`}>Next</a> : null}
      </div>
      <h2>Approve / Reject (pending only)</h2>
      <div className="card" style={{ display: "grid", gap: 8 }}>
        {(["approve", "success", "reject", "failed"] as const).map((a) => (
          <form key={a} action={statusAction} className="row">
            <input name="id" placeholder="withdrawal id" required />
            <input name="action" defaultValue={a} readOnly style={{ width: 90 }} />
            <button type="submit">{a}</button>
          </form>
        ))}
      </div>
    </div>
  );
}
