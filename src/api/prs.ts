import { apiRequest } from "./client";

export async function fetchPRs(exercise_id?: string) {
  const params: Record<string, string | undefined> = {};
  if (exercise_id) params.exercise_id = exercise_id;
  return apiRequest<Array<Record<string, unknown>>>("/api/personal-records", { params });
}

export async function createPR(exercise_id: string, weight_kg: number, reps = 1) {
  return apiRequest("/api/personal-records", {
    method: "POST",
    body: { exercise_id, weight_kg, reps },
  });
}
