/**
 * Thin typed fetch wrapper for the mmtmaniteja-api backend.
 *
 * Base URL comes from VITE_API_BASE_URL at build time; falls back to
 * http://localhost:8080 for local dev.
 *
 * Auth: if a JWT is present in localStorage under AUTH_TOKEN_KEY, it is
 * automatically attached as a Bearer token. 401 responses clear the token.
 */

export const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, "") ||
  "http://localhost:8080";

export const AUTH_TOKEN_KEY = "mmt.authToken";

export class ApiError extends Error {
  constructor(
    public status: number,
    public body: unknown,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type Method = "GET" | "POST" | "PUT" | "DELETE";

interface RequestOptions {
  method?: Method;
  body?: unknown;
  signal?: AbortSignal;
  /** Skip auth header even if token is present (e.g., login endpoint). */
  noAuth?: boolean;
  /** Use navigator.sendBeacon for fire-and-forget (unload). Body required. */
  beacon?: boolean;
}

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(AUTH_TOKEN_KEY);
}

function clearToken() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(AUTH_TOKEN_KEY);
}

export async function apiRequest<T = unknown>(
  path: string,
  { method = "GET", body, signal, noAuth, beacon }: RequestOptions = {},
): Promise<T> {
  const url = `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;

  // Beacon path — one-shot, can't read the response. Returns success.
  if (beacon) {
    if (typeof navigator !== "undefined" && "sendBeacon" in navigator && body !== undefined) {
      const blob = new Blob([JSON.stringify(body)], { type: "application/json" });
      navigator.sendBeacon(url, blob);
      return undefined as T;
    }
    // Fall back to keepalive fetch if sendBeacon isn't available
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  if (!noAuth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
    signal,
    keepalive: beacon === true,
    credentials: "include",
  });

  // 401 → token is stale/rejected. Clear it so the UI falls back to anonymous.
  if (res.status === 401) {
    if (!noAuth) clearToken();
  }

  if (res.status === 204) return undefined as T;

  let payload: unknown = null;
  const contentType = res.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    payload = await res.json().catch(() => null);
  } else {
    payload = await res.text().catch(() => null);
  }

  if (!res.ok) {
    const message =
      (payload && typeof payload === "object" && "message" in payload &&
        typeof (payload as { message: unknown }).message === "string")
        ? (payload as { message: string }).message
        : `Request failed: ${res.status}`;
    throw new ApiError(res.status, payload, message);
  }

  return payload as T;
}

/* ──────────────────────────────────────────────
 * Typed wire shapes — kept in sync with backend DTOs.
 * ────────────────────────────────────────────── */

export interface PostSummary {
  id: number;
  slug: string;
  title: string;
  excerpt: string | null;
  tags: string | null;
  publishedAt: string | null;
}

export interface PostResponse {
  id: number;
  slug: string;
  title: string;
  excerpt: string | null;
  contentMd: string;
  tags: string | null;
  status: "DRAFT" | "PUBLISHED";
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PostWriteRequest {
  slug: string;
  title: string;
  excerpt?: string;
  contentMd: string;
  tags?: string;
  status: "DRAFT" | "PUBLISHED";
}

export interface ListResponse<T> {
  items: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface LoginResponse {
  token: string;
  expiresInSeconds: number;
  role: string;
}

export interface MeResponse {
  username: string;
  role: string;
}

export interface PathCount {
  path: string;
  views: number;
}

export interface AnalyticsSummary {
  rangeDays: number;
  totalViews: number;
  avgDwellMs: number | null;
  topPaths: PathCount[];
  topReferrers: PathCount[];
}

/* ──────────────────────────────────────────────
 * Typed endpoints
 * ────────────────────────────────────────────── */

export const postsApi = {
  listPublished: (page = 0, size = 10) =>
    apiRequest<ListResponse<PostSummary>>(`/api/posts?page=${page}&size=${size}`),
  get: (slug: string) => apiRequest<PostResponse>(`/api/posts/${encodeURIComponent(slug)}`),
  listAll: (page = 0, size = 20) =>
    apiRequest<ListResponse<PostResponse>>(`/api/posts/admin?page=${page}&size=${size}`),
  create: (body: PostWriteRequest) =>
    apiRequest<PostResponse>("/api/posts", { method: "POST", body }),
  update: (id: number, body: PostWriteRequest) =>
    apiRequest<PostResponse>(`/api/posts/${id}`, { method: "PUT", body }),
  remove: (id: number) =>
    apiRequest<void>(`/api/posts/${id}`, { method: "DELETE" }),
};

export const authApi = {
  login: (username: string, password: string) =>
    apiRequest<LoginResponse>("/api/auth/login", {
      method: "POST",
      body: { username, password },
      noAuth: true,
    }),
  me: () => apiRequest<MeResponse>("/api/auth/me"),
};

export const analyticsApi = {
  pageview: (sessionId: string, path: string, referrer: string) =>
    apiRequest<void>("/api/analytics/pageview", {
      method: "POST",
      body: { sessionId, path, referrer },
      noAuth: true,
    }),
  dwellBeacon: (sessionId: string, path: string, dwellMs: number) =>
    apiRequest<void>("/api/analytics/dwell", {
      method: "POST",
      body: { sessionId, path, dwellMs },
      noAuth: true,
      beacon: true,
    }),
  summary: (days = 30) =>
    apiRequest<AnalyticsSummary>(`/api/analytics/summary?days=${days}`),
};
