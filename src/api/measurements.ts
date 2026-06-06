import { apiRequest } from "./client";

export async function fetchMeasurements(limit = 10) {
  return apiRequest<Array<Record<string, unknown>>>("/api/body-measurements", {
    params: { limit: String(limit) },
  });
}

export async function createMeasurement(data: Record<string, unknown>) {
  return apiRequest("/api/body-measurements", { method: "POST", body: data });
}
