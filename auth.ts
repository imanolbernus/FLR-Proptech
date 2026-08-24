// El login usa el flujo estándar OAuth2 "password" que espera FastAPI:
// formulario x-www-form-urlencoded con "username" (= email) y "password".
// El resto del cliente HTTP (api/client.ts) usa JSON; este endpoint es la
// única excepción, así que hace su propio fetch en vez de usar apiClient.

const API_BASE_URL: string =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? "http://127.0.0.1:8000/api/v1";

export interface AuthUser {
  id: string;
  nombre: string;
  email: string;
  rol: "admin" | "property_manager" | "viewer";
  telefono: string | null;
  activo: boolean;
}

export class LoginError extends Error {}

export async function login(email: string, password: string): Promise<string> {
  const body = new URLSearchParams();
  body.set("username", email);
  body.set("password", password);

  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new LoginError(
      (data && typeof data === "object" && "detail" in data && String(data.detail)) ||
        "No se pudo iniciar sesión."
    );
  }

  const data = (await res.json()) as { access_token: string };
  return data.access_token;
}

export async function fetchMe(token: string): Promise<AuthUser> {
  const res = await fetch(`${API_BASE_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    throw new LoginError("Sesión inválida o expirada.");
  }
  return (await res.json()) as AuthUser;
}
