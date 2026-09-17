const COLORS: Record<string, string> = {
  upcoming: "#b45309",
  ongoing: "#047857",
  result: "#475569",
  pending: "#b45309",
  success: "#047857",
  approved: "#047857",
  rejected: "#b91c1c",
  failed: "#b91c1c",
  banned: "#b91c1c",
  active: "#047857",
};

export default function StatusPill({ status }: { status: string }) {
  const s = String(status || "—").toLowerCase();
  const color = COLORS[s] || "#475569";
  return (
    <span
      style={{
        display: "inline-block",
        padding: "2px 10px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 600,
        color,
        background: `${color}14`,
        border: `1px solid ${color}55`,
      }}
    >
      {status || "—"}
    </span>
  );
}
