// Almacenamiento del token de sesión. Vive en localStorage (este es un sitio
// real fuera de la vista de conversación de Claude, así que localStorage es
// apropiado aquí) para que la sesión sobreviva a recargar la página.

const STORAGE_KEY = "flr_proptech_token";

export function getToken(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export function setToken(token: string): void {
  try {
    localStorage.setItem(STORAGE_KEY, token);
  } catch {
    /* almacenamiento no disponible: la sesión simplemente no persiste */
  }
}

export function clearToken(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* noop */
  }
  window.dispatchEvent(new Event("flr-auth-logout"));
}
