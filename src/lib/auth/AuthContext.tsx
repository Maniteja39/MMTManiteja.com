import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { authApi, AUTH_TOKEN_KEY, type MeResponse } from "@/lib/api";

/**
 * Single-admin auth — JWT stored in localStorage, refreshed via /auth/me on load.
 * Kept deliberately small; the admin is the only authenticated user on the site.
 */
interface AuthValue {
  user: MeResponse | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthValue | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<MeResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem(AUTH_TOKEN_KEY) !== null;
  });

  // On mount, if we have a token, validate it with /auth/me. If it's stale, clear.
  useEffect(() => {
    let cancelled = false;
    const token = typeof window !== "undefined"
      ? window.localStorage.getItem(AUTH_TOKEN_KEY)
      : null;

    if (!token) {
      setLoading(false);
      return;
    }

    authApi
      .me()
      .then((me) => {
        if (!cancelled) setUser(me);
      })
      .catch(() => {
        // 401 — api.ts already cleared the token. Just stay logged out.
        if (!cancelled) setUser(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    const res = await authApi.login(username, password);
    window.localStorage.setItem(AUTH_TOKEN_KEY, res.token);
    const me = await authApi.me();
    setUser(me);
  }, []);

  const logout = useCallback(() => {
    window.localStorage.removeItem(AUTH_TOKEN_KEY);
    setUser(null);
  }, []);

  const value = useMemo<AuthValue>(
    () => ({
      user,
      loading,
      login,
      logout,
      isAdmin: user?.role === "ADMIN",
    }),
    [user, loading, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within <AuthProvider>");
  }
  return ctx;
};
