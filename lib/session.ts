import type { LoginResponse } from "./types";

// Profile snapshot (name, role, …) for the UI and the proxy's route gating. It is not an
// authorization boundary: Supabase Auth holds the real session and RLS enforces access.
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

