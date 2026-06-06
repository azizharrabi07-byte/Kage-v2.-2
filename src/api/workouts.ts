import { apiRequest } from "./client";

export async function fetchTemplates() {
  return apiRequest<Array<Record<string, unknown>>>("/api/workout-templates");
}

export async function createTemplate(data: Record<string, unknown>) {
  return apiRequest("/api/workout-templates", { method: "POST", body: data });
}

export async function fetchSessions(limit = 20, offset = 0) {
  return apiRequest<{ items: Array<Record<string, unknown>>; total: number }>(
    "/api/workout-sessions",
    { params: { limit: String(limit), offset: String(offset) } }
  );
}

export async function createSession(data: Record<string, unknown>) {
  return apiRequest("/api/workout-sessions", { method: "POST", body: data });
}

export async function fetchSession(id: string) {
  return apiRequest(`/api/workout-sessions/${id}`);
}
