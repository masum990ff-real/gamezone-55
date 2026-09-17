import Link from "next/link";
import { logoutAction } from "@/lib/auth";
import type { Session } from "@/types/roles";
import { hasPermission, isMain } from "@/types/roles";

const LINKS = [
  { href: "/dashboard", label: "Dashboard", perm: null },
  { href: "/users", label: "Users", perm: null },
  { href: "/matches", label: "Matches", perm: null },
  { href: "/categories", label: "Categories", perm: null },
  { href: "/deposits", label: "Deposits", perm: null },
  { href: "/withdrawals", label: "Withdrawals", perm: "withdrawals" },
  { href: "/notifications/send", label: "Send Notification", perm: null },
  { href: "/notifications/history", label: "History", perm: null },
  { href: "/settings", label: "Settings", perm: null },
  { href: "/payment-config", label: "Payment Config", perm: null },
  { href: "/staff", label: "Staff", perm: "staff" },
] as const;

export default function Sidebar({ session }: { session: Session | null }) {
  const visible = LINKS.filter((l) => {
    if (!l.perm) return true;
    if (!session) return false;
    if (isMain(session)) return true;
    return hasPermission(session, l.perm);
  });
  return (
    <aside style={{ width: 220, borderRight: "1px solid #e5e7eb", padding: 16, display: "flex", flexDirection: "column", gap: 4 }}>
      <div style={{ fontWeight: 800, marginBottom: 12 }}>GameZone Admin</div>
      {visible.map((l) => (
        <Link key={l.href} href={l.href} style={{ padding: "8px 10px", borderRadius: 8, textDecoration: "none", color: "#0f172a" }}>
          {l.label}
        </Link>
      ))}
      <form action={logoutAction} style={{ marginTop: "auto" }}>
        <button type="submit" style={{ width: "100%", padding: "8px 10px" }}>
          Logout ({session?.email || "?"})
        </button>
      </form>
    </aside>
  );
}
