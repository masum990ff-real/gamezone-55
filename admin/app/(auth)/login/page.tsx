import { redirect } from "next/navigation";
import { getAuthToken, loginAction } from "@/lib/auth";
import { decodeSession, isExpired } from "@/types/roles";

export default function LoginPage({
  searchParams,
}: {
  searchParams?: { error?: string; next?: string };
}) {
  const s = decodeSession(getAuthToken());
  if (s && !isExpired(s)) redirect(searchParams?.next || "/dashboard");
  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24 }}>
      <form
        action={loginAction}
        style={{ width: 360, background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 24, display: "grid", gap: 12 }}
      >
        <h1 style={{ margin: 0 }}>Admin login</h1>
        {searchParams?.error ? (
          <p role="alert" style={{ color: "#b91c1c", margin: 0 }}>
            {searchParams.error}
          </p>
        ) : null}
        <label style={{ display: "grid", gap: 4 }}>
          Email
          <input name="email" type="email" required autoComplete="username" />
        </label>
        <label style={{ display: "grid", gap: 4 }}>
          Password
          <input name="password" type="password" required autoComplete="current-password" />
        </label>
        <button type="submit">Login</button>
      </form>
    </main>
  );
}
