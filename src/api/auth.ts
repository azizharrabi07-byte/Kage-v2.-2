import { apiRequest, setToken } from "./client";

export async function signup(email: string, password: string, name: string) {
  const result = await apiRequest<{ access_token: string; user: { id: string; email: string; name: string } }>("/api/auth/signup", {
    method: "POST",
    body: { email, password, name },
  });
  setToken(result.access_token);
  return result;
}

export async function login(email: string, password: string) {
  const result = await apiRequest<{ access_token: string; user: { id: string; email: string; name: string } }>("/api/auth/login", {
    method: "POST",
    body: { email, password },
  });
  setToken(result.access_token);
  return result;
}

export async function getMe() {
  return apiRequest<{ id: string; email: string; name: string }>("/api/auth/me");
}
