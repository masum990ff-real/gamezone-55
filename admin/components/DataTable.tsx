export default function DataTable({
  columns,
  rows,
  empty = "No records",
}: {
  columns: string[];
  rows: (string | number | null | undefined)[][];
  empty?: string;
}) {
  const pageRows = rows.slice(0, 100);
  return (
    <div style={{ overflowX: "auto", border: "1px solid #e5e7eb", borderRadius: 8 }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
        <thead>
          <tr style={{ background: "#f8fafc", textAlign: "left" }}>
            {columns.map((c) => (
              <th key={c} style={{ padding: "10px 12px", borderBottom: "1px solid #e5e7eb" }}>
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {pageRows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} style={{ padding: 16, color: "#64748b" }}>
                {empty}
              </td>
            </tr>
          ) : (
            pageRows.map((r, i) => (
              <tr key={i} style={{ borderTop: "1px solid #f1f5f9" }}>
                {r.map((cell, j) => (
                  <td key={j} style={{ padding: "10px 12px" }}>
                    {cell ?? "—"}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
      <div style={{ padding: "8px 12px", fontSize: 12, color: "#64748b" }}>
        Showing {pageRows.length} of {rows.length} (cap 100/page)
      </div>
    </div>
  );
}
