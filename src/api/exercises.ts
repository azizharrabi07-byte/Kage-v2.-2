import { apiRequest } from "./client";

export async function fetchExercises(category?: string, search?: string) {
  const params: Record<string, string | undefined> = {};
  if (category) params.category = category;
  if (search) params.search = search;
  return apiRequest<Array<{
    id: string; name: string; target: string;
    category: string; kanji: string;
    description: string; difficulty: string;
  }>>("/api/exercises", { params });
}

export async function fetchExercise(id: string) {
  return apiRequest<{
    id: string; name: string; target: string;
    category: string; kanji: string;
    description: string; difficulty: string;
  }>(`/api/exercises/${id}`);
}
