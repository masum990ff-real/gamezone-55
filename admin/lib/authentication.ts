import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { decodeSession, isExpired, type Session } from "@/types/roles";

export const TOKEN_COOKIE = "gz_token";
export const TOKEN_MAX_AGE = 12 * 60 * 60;
// TODO: নতুন backend URL Render env BACKEND_URL-এ বসান (২ জায়গার ২: অ্যাডমিন)। ফলব্যাক শুধু placeholder।
export const BACKEND_URL =
  process.env.BACKEND_URL || "https://TODO-NEW-BACKEND-URL";

export function getAuthToken(): string | null {
  return cookies().get(TOKEN_COOKIE)?.value || null;
}

export function getSession(): Session | null {
  return decodeSession(getAuthToken());
}

export function requireSession(): Session {
  const s = getSession();
  if (!s || isExpired(s)) redirect("/login");
  return s;
}

export function backend(path: string): string {
  return `${BACKEND_URL.replace(/\/$/, "")}${path.startsWith("/") ? path : `/${path}`}`;
}

export async function loginAction(formData: FormData): Promise<void> {
  "use server";
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const res = await fetch(backend("/api/auth/login"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    cache: "no-store",
  });
  let body: { success?: boolean; data?: { token?: string }; message?: string } = {};
  try {
    body = await res.json();
  } catch {
    body = {};
  }
  if (!res.ok || !body.success || !body.data?.token) {
    const msg = res.status === 401 ? "Invalid credentials" : body.message || "Login failed";
    redirect(`/login?error=${encodeURIComponent(msg)}`);
  }
  cookies().set(TOKEN_COOKIE, String(body.data.token), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: TOKEN_MAX_AGE,
  });
  redirect("/dashboard");
}

export async function logoutAction(): Promise<void> {
  "use server";
  cookies().delete(TOKEN_COOKIE);
  redirect("/login");
}
