import StatCard from "@/components/StatCard";
import DataTable from "@/components/DataTable";
import { getAuthToken } from "@/lib/auth";
import { getHistory, getStats } from "@/services/notificationsAdmin";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams?: { error?: string };
}) {
  const token = getAuthToken();
  const stats = await getStats(token).catch(() => ({ devices: 0, notifications: 0, users: 0 }));
  const history = await getHistory(token, { page: 1, limit: 5 }).catch(() => ({ items: [], page: 1, limit: 5, total: 0, totalPages: 0 }));
  const items = (history as { items?: unknown[] }).items || [];
  return (
    <div style={{ display: "grid", gap: 16 }}>
      <h1 style={{ margin: 0 }}>Dashboard</h1>
      {searchParams?.error ? <p style={{ color: "#b91c1c" }}>Forbidden: missing permission</p> : null}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
        <StatCard label="Devices" value={stats.devices} />
        <StatCard label="Notifications" value={stats.notifications} />
        <StatCard label="Users" value={stats.users} />
      </div>
      <h2>Recent notifications</h2>
      <DataTable
        columns={["Title", "Message", "Reach"]}
        rows={items.map((n) => {
          const r = n as Record<string, unknown>;
          return [
            String(r.title ?? "—"),
            String(r.body ?? r.message ?? "—").slice(0, 80),
            String(r.successCount ?? r.reach ?? "—"),
          ];
        })}
      />
    </div>
  );
}
