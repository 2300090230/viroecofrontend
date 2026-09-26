import { clearSession, getToken } from "./session";

export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:2420";

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message || `Request failed (${status})`);
    this.status = status;
  }
}

type Options = Omit<RequestInit, "body"> & {
  body?: unknown;
  auth?: boolean; // attach bearer token (default: true when a token exists)
};

/**
 * Single fetch wrapper for the Viroeco backend.
 * - Prefixes /api and the configured host.
 * - Attaches `Authorization: Bearer <token>` from the session cookie.
 * - Backend errors are plain text with HTTP 400/401/403 — surfaced as ApiError.message.
 * - On 401/403 the session is cleared so the UI can prompt a re-login (JWT is short-lived).
 */
export async function api<T>(path: string, opts: Options = {}): Promise<T> {
  const { body, auth, headers, ...rest } = opts;
  const token = getToken();
  const isForm = typeof FormData !== "undefined" && body instanceof FormData;

  const finalHeaders: Record<string, string> = { ...(headers as Record<string, string>) };
  if (body !== undefined && !isForm) finalHeaders["Content-Type"] = "application/json";
  if ((auth ?? true) && token) finalHeaders["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}/api${path}`, {
    ...rest,
    headers: finalHeaders,
    body: body === undefined ? undefined : isForm ? (body as FormData) : JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    if (res.status === 401 || res.status === 403) clearSession();
    throw new ApiError(res.status, text.trim());
  }

  // Success bodies are JSON for reads, plain strings for mutations.
  const ct = res.headers.get("content-type") ?? "";
  if (ct.includes("application/json")) return (await res.json()) as T;
  return (await res.text()) as unknown as T;
}
