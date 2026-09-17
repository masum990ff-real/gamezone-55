import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type { Permission } from "./types/roles";

export const PERMISSIONS: Permission[] = [
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
];

type RouteRule = { method: string; path: string; perm: Permission | null; note: string };

export const ROUTE_MAP: RouteRule[] = [
  { method: "POST", path: "/api/auth/login", perm: null, note: "public loginLimiter" },
  { method: "POST", path: "/api/users/sync", perm: null, note: "firebaseAuth user" },
  { method: "GET", path: "/api/users/me", perm: null, note: "firebaseAuth user" },
  { method: "GET", path: "/api/users", perm: null, note: "auth-only parity (any staff can list)" },
  { method: "POST", path: "/api/users/:uid/ban", perm: "users", note: "requirePermission users" },
  { method: "POST", path: "/api/users/:uid/unban", perm: "users", note: "requirePermission users" },
  { method: "POST", path: "/api/matches", perm: null, note: "auth-only parity" },
  { method: "PUT", path: "/api/matches/:id", perm: null, note: "auth-only parity" },
  { method: "DELETE", path: "/api/matches/:id", perm: null, note: "auth-only parity" },
  { method: "PUT", path: "/api/matches/:id/status", perm: null, note: "auth-only parity" },
  { method: "POST", path: "/api/matches/:id/join", perm: null, note: "firebaseAuth player" },
  { method: "GET", path: "/api/matches*", perm: null, note: "public catLimiter" },
  { method: "ALL", path: "/api/categories", perm: null, note: "write auth-only parity; GET public" },
  { method: "GET", path: "/api/categories", perm: null, note: "public" },
  { method: "GET", path: "/api/deposits", perm: null, note: "auth-only parity" },
  { method: "GET", path: "/api/withdrawals", perm: "withdrawals", note: "requirePermission withdrawals" },
  { method: "PUT", path: "/api/withdrawals/:id/status", perm: "withdrawals", note: "requirePermission withdrawals" },
  { method: "POST", path: "/api/withdrawals", perm: null, note: "firebaseAuth player" },
  { method: "POST", path: "/api/notifications/send", perm: null, note: "auth-only parity" },
  { method: "GET", path: "/api/notifications/history|stats", perm: null, note: "auth-only parity" },
  { method: "PUT", path: "/api/settings", perm: null, note: "auth-only parity" },
  { method: "GET", path: "/api/settings", perm: null, note: "public" },
  { method: "ALL", path: "/api/payment-config", perm: null, note: "auth-only parity (perm unenforced upstream)" },
  { method: "ALL", path: "/api/staff", perm: "staff", note: "requirePermission staff" },
  { method: "GET", path: "/api/leaderboard", perm: null, note: "public catLimiter" },
  { method: "POST", path: "/api/payments/*", perm: null, note: "user/webhook" },
  { method: "DELETE", path: "/api/tokens/invalid", perm: null, note: "auth-only parity" },
];

type Payload = { email?: string; role?: string; permissions?: string[]; exp?: number };

function decodePayload(token: string): Payload | null {
  try {
    const seg = token.split(".")[1];
    if (!seg) return null;
    const b64 = seg.replace(/-/g, "+").replace(/_/g, "/");
    const pad = b64.length % 4 === 0 ? "" : "=".repeat(4 - (b64.length % 4));
    const bin = atob(b64 + pad);
    const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
    return JSON.parse(new TextDecoder().decode(bytes));
  } catch {
    return null;
  }
}

function hasPerm(p: Payload | null, perm: Permission): boolean {
  if (!p) return false;
  if (p.role === "main") return true;
  const arr = Array.isArray(p.permissions) ? p.permissions : [];
  return arr.includes(perm) || arr.includes("*") || arr.includes("all");
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname === "/login" || pathname.startsWith("/_next") || pathname === "/favicon.ico") {
    return NextResponse.next();
  }
  const token = req.cookies.get("gz_token")?.value;
  const loginUrl = new URL("/login", req.url);
  if (!token) {
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }
  const payload = decodePayload(token);
  if (!payload) {
    const r = NextResponse.redirect(loginUrl);
    r.cookies.delete("gz_token");
    return r;
  }
  if (typeof payload.exp === "number" && payload.exp * 1000 <= Date.now()) {
    const r = NextResponse.redirect(loginUrl);
    r.cookies.delete("gz_token");
    return r;
  }
  if (pathname.startsWith("/staff") && !hasPerm(payload, "staff")) {
    return NextResponse.redirect(new URL("/dashboard?error=forbidden", req.url));
  }
  if (pathname.startsWith("/withdrawals") && !hasPerm(payload, "withdrawals")) {
    return NextResponse.redirect(new URL("/dashboard?error=forbidden", req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard", "/users/:path*", "/matches/:path*", "/categories", "/deposits", "/withdrawals/:path*", "/notifications/:path*", "/settings/:path*", "/payment-config", "/staff/:path*"],
};
