export const PERMISSIONS = [
  "dashboard",
  "send_notification",
  "history",
  "users",
  "categories",
  "matches",
  "settings",
  "payment-config",
  "deposits",
  "withdrawals",
  "staff",
] as const;

export type Permission = (typeof PERMISSIONS)[number];

export type Role = "main" | "staff";

export type Session = {
  email: string;
  role: Role;
  permissions: string[];
  exp?: number;
};

export function isMain(s: Session | null): boolean {
  return !!s && (s.role === "main" || s.permissions.includes("*"));
}

export function hasPermission(s: Session | null, perm: Permission): boolean {
  if (!s) return false;
  if (isMain(s)) return true;
  const p = s.permissions || [];
  return p.includes(perm) || p.includes("*") || p.includes("all");
}

export function decodeSession(token: string | null | undefined): Session | null {
  if (!token) return null;
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const b64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const json = Buffer.from(b64, "base64").toString("utf8");
    const p = JSON.parse(json);
    return {
      email: String(p.email || ""),
      role: p.role === "main" ? "main" : "staff",
      permissions: Array.isArray(p.permissions) ? p.permissions.map(String) : [],
      exp: typeof p.exp === "number" ? p.exp : undefined,
    };
  } catch {
    return null;
  }
}

export function isExpired(s: Session | null): boolean {
  if (!s || !s.exp) return false;
  return s.exp * 1000 <= Date.now();
}
