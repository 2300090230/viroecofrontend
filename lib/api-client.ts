// The only place the frontend talks to the Spring Boot backend.
// Responses use the envelope {success, message, data, errorCode, errors}.

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public code?: string,
    public fieldErrors?: Record<string, string>,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

interface Envelope<T> {
  success: boolean;
  message?: string;
  data?: T;
  errorCode?: string;
  errors?: Record<string, string>;
}

type Query = Record<string, string | number | boolean | undefined | null>;

export interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  query?: Query;
  /** Set for endpoints where a 401 must not trigger a session refresh (login, refresh itself…). */
  skipRefresh?: boolean;
  signal?: AbortSignal;
}

export const SESSION_EXPIRED_EVENT = "ve:session-expired";

const isServer = typeof window === "undefined";

// Server components call the backend directly; browsers go through the same-origin /api proxy.
function baseUrl(): string {
  return isServer ? (process.env.BACKEND_URL ?? "http://localhost:2420") : "";
}

function buildUrl(path: string, query?: Query): string {
  const url = `${baseUrl()}${path}`;
  if (!query) return url;
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(query)) {
    if (v !== undefined && v !== null && v !== "") params.set(k, String(v));
  }
  const qs = params.toString();
  return qs ? `${url}?${qs}` : url;
}

let refreshing: Promise<boolean> | null = null;

/** One refresh at a time, shared by every request that hit a 401 concurrently. */
function refreshSession(): Promise<boolean> {
  refreshing ??= fetch(buildUrl("/api/auth/refresh"), { method: "POST", credentials: "include" })
    .then((r) => r.ok)
    .catch(() => false)
    .finally(() => {
      refreshing = null;
    });
  return refreshing;
}

async function send<T>(path: string, opts: RequestOptions, retried: boolean): Promise<T> {
  const isForm = typeof FormData !== "undefined" && opts.body instanceof FormData;
  const headers: Record<string, string> = { Accept: "application/json" };
  if (opts.body !== undefined && !isForm) headers["Content-Type"] = "application/json";

  let res: Response;
  try {
    res = await fetch(buildUrl(path, opts.query), {
      method: opts.method ?? "GET",
      headers,
      credentials: "include",
      cache: "no-store",
      signal: opts.signal,
      body: opts.body === undefined ? undefined : isForm ? (opts.body as FormData) : JSON.stringify(opts.body),
    });
  } catch {
    throw new ApiError(0, "Can't reach the server. Check your connection and try again.", "NETWORK_ERROR");
  }

  if (res.status === 401 && !opts.skipRefresh && !retried && !isServer) {
    if (await refreshSession()) return send<T>(path, opts, true);
    window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT));
  }

  let payload: Envelope<T> | null = null;
  try {
    payload = (await res.json()) as Envelope<T>;
  } catch {
    // non-JSON (e.g. proxy error page)
  }

  if (!res.ok || !payload?.success) {
    throw new ApiError(
      res.status,
      payload?.message || (res.status >= 500 ? "Something went wrong. Please try again." : "Request failed"),
      payload?.errorCode,
      payload?.errors,
    );
  }
  return payload.data as T;
}

export function api<T>(path: string, opts: RequestOptions = {}): Promise<T> {
  return send<T>(path, opts, false);
}

/** For calls whose success message matters more than their data (e.g. "We sent a code"). */
export async function apiMessage(path: string, opts: RequestOptions = {}): Promise<string> {
  const isForm = typeof FormData !== "undefined" && opts.body instanceof FormData;
  const res = await fetch(buildUrl(path, opts.query), {
    method: opts.method ?? "POST",
    headers: opts.body !== undefined && !isForm ? { "Content-Type": "application/json" } : undefined,
    credentials: "include",
    body: opts.body === undefined ? undefined : isForm ? (opts.body as FormData) : JSON.stringify(opts.body),
  }).catch(() => {
    throw new ApiError(0, "Can't reach the server. Check your connection and try again.", "NETWORK_ERROR");
  });
  const payload = (await res.json().catch(() => null)) as Envelope<unknown> | null;
  if (!res.ok || !payload?.success) {
    throw new ApiError(res.status, payload?.message || "Request failed", payload?.errorCode, payload?.errors);
  }
  return payload.message ?? "";
}
