import type { LoginResponse } from "./types";

// The session lives in HttpOnly cookies set by the backend (ve_at access, ve_rt refresh) that page
// scripts cannot read. The UI learns who is signed in from GET /api/auth/me; nothing about the
// user is kept in browser storage.
export type Session = LoginResponse;

/** Role hint cookie set by the backend; read only by the route proxy for redirects (not security). */
export const ROLE_COOKIE = "ve_role";
