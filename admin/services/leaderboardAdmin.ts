import { apiFetch } from "@/lib/backend";

export async function getLeaderboard(token: string | null, period = "fulltime") {
  const env = await apiFetch(`/api/leaderboard?period=${encodeURIComponent(period)}`, token);
  return env.data;
}
