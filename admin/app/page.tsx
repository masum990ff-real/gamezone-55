import { redirect } from "next/navigation";
import { getAuthToken } from "@/lib/auth";
import { decodeSession, isExpired } from "@/types/roles";

export default function IndexPage() {
  const s = decodeSession(getAuthToken());
  if (s && !isExpired(s)) redirect("/dashboard");
  redirect("/login");
}
