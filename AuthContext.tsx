import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { fetchMe, login as apiLogin, type AuthUser } from "@/api/auth";
import { clearToken, getToken, setToken } from "@/api/authToken";

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  async function hydrate() {
    const token = getToken();
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }
    try {
      const me = await fetchMe(token);
      setUser(me);
    } catch {
      clearToken();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    hydrate();

    // El cliente HTTP dispara este evento cuando cualquier request recibe un
    // 401 (token vencido/inválido) -- aquí lo reflejamos en el estado global.
    const onLogout = () => setUser(null);
    window.addEventListener("flr-auth-logout", onLogout);
    return () => window.removeEventListener("flr-auth-logout", onLogout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function login(email: string, password: string) {
    const token = await apiLogin(email, password);
    setToken(token);
    const me = await fetchMe(token);
    setUser(me);
  }

  function logout() {
    clearToken();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
}
