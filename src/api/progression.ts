import { apiRequest } from "./client";

export async function fetchProgression() {
  return apiRequest<{
    total_xp: number; level: number; rank_index: number;
    streak: number; workouts_completed: number;
  }>("/api/progression");
}

export async function addXP(category: string, amount: number, source = "workout") {
  return apiRequest("/api/progression/xp", {
    method: "POST",
    body: { category, amount, source },
  });
}
