import type { LoginResponse } from "./types";

// ponytail: session stored in a JS-readable cookie (not httpOnly) because the backend
// authenticates via the Authorization header, so the token must be reachable from JS.
// The proxy (middleware) also reads this cookie to gate routes. Acceptable for this app;
// upgrade path is a backend cookie-auth mode + httpOnly if XSS surface grows.
export const SESSION_COOKIE = "ve_session";

export type Session = LoginResponse;

export function readSessionCookie(raw: string | undefined): Session | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Session;
  } catch {
    try {
      return JSON.parse(decodeURIComponent(raw)) as Session;
    } catch {
      return null;
    }
  }
}

export function getSession(): Session | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find((c) => c.startsWith(`${SESSION_COOKIE}=`));
  return readSessionCookie(match?.split("=").slice(1).join("="));
}

export function setSession(session: Session) {
  if (typeof document === "undefined") return;
  const value = encodeURIComponent(JSON.stringify(session));
  // 24h to match the backend JWT expiry
  document.cookie = `${SESSION_COOKIE}=${value}; path=/; max-age=${60 * 60 * 24}; samesite=lax`;
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("ve_session_change"));
  }
}

export function clearSession() {
  if (typeof document === "undefined") return;
  document.cookie = `${SESSION_COOKIE}=; path=/; max-age=0; samesite=lax`;
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("ve_session_change"));
  }
}

export function getToken(): string | null {
  return getSession()?.token ?? null;
}

