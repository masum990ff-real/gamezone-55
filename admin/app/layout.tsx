import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = { title: "GameZone Admin", description: "GameZone admin panel" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif", background: "#f1f5f9", color: "#0f172a" }}>
        {children}
      </body>
    </html>
  );
}
