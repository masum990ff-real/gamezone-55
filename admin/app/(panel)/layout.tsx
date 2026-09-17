import Sidebar from "@/components/Sidebar";
import { getSession } from "@/lib/auth";

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  const session = getSession();
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar session={session} />
      <main style={{ flex: 1, padding: 24, maxWidth: 1200 }}>{children}</main>
    </div>
  );
}
