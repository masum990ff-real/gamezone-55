import { redirect } from "next/navigation";
import DataTable from "@/components/DataTable";
import { getAuthToken } from "@/lib/auth";
import { ApiError } from "@/lib/backend";
import { getHistory } from "@/services/notificationsAdmin";

export default async function HistoryPage({
  searchParams,
}: {
  searchParams?: { page?: string; cursor?: string };
}) {
  const page = Math.max(1, parseInt(searchParams?.page || "1") || 1);
  const data = await getHistory(getAuthToken(), { page, limit: 20, cursor: searchParams?.cursor }).catch((e) => {
    if (e instanceof ApiError && e.status === 401) redirect("/login?error=Unauthorized");
    throw e;
  });
  return (
    <div style={{ display: "grid", gap: 16 }}>
      <h1 style={{ margin: 0 }}>Notification history</h1>
      <DataTable
        columns={["Date", "Title", "Message", "Reach"]}
        rows={data.items.map((n) => [
          String(n.sentAt ?? "—"),
          String(n.title ?? "—"),
          String(n.body ?? n.message ?? "—").slice(0, 80),
          String(n.successCount ?? n.reach ?? "—"),
        ])}
        empty="No history"
      />
      <div className="row">
        {page > 1 ? <a href={`/notifications/history?page=${page - 1}`}>Prev</a> : null}
        <span>Page {data.page} of {Math.max(1, data.totalPages)}</span>
        {data.nextCursor ? (
          <a href={`/notifications/history?page=${page + 1}&cursor=${encodeURIComponent(data.nextCursor)}`}>
            Next (cursor)
          </a>
        ) : data.page < data.totalPages ? (
          <a href={`/notifications/history?page=${page + 1}`}>Next</a>
        ) : null}
      </div>
    </div>
  );
}
