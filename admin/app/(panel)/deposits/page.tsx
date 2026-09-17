import { redirect } from "next/navigation";
import DataTable from "@/components/DataTable";
import { getAuthToken } from "@/lib/auth";
import { ApiError } from "@/lib/backend";
import { listDeposits } from "@/services/depositsAdmin";

export default async function DepositsPage({
  searchParams,
}: {
  searchParams?: { page?: string; uid?: string };
}) {
  const page = Math.max(1, parseInt(searchParams?.page || "1") || 1);
  const data = await listDeposits(getAuthToken(), { page, limit: 20, uid: searchParams?.uid }).catch((e) => {
    if (e instanceof ApiError && e.status === 401) redirect("/login?error=Unauthorized");
    throw e;
  });
  return (
    <div style={{ display: "grid", gap: 16 }}>
      <h1 style={{ margin: 0 }}>Deposits (read-only)</h1>
      <form method="get" className="row">
        <input name="uid" placeholder="filter by uid" defaultValue={searchParams?.uid || ""} />
        <button type="submit">Filter</button>
      </form>
      <DataTable
        columns={["Date", "User", "Order ID", "Amount", "Status"]}
        rows={data.items.map((d) => [
          String(d.createdAt ?? "—"),
          String(d.username ?? d.email ?? d.uid ?? "—"),
          String(d.orderId ?? d.id ?? "—"),
          String(d.amount ?? "—"),
          String(d.status ?? "—"),
        ])}
        empty="No deposits"
      />
      <div className="row">
        {page > 1 ? <a href={`/deposits?page=${page - 1}`}>Prev</a> : null}
        <span>Page {data.page} of {Math.max(1, data.totalPages)}</span>
        {data.page < data.totalPages ? <a href={`/deposits?page=${page + 1}`}>Next</a> : null}
      </div>
    </div>
  );
}
