import { NextResponse, type NextRequest } from "next/server";
import { readSessionCookie, SESSION_COOKIE } from "@/lib/session";

// Next.js 16 renamed `middleware` → `proxy` (nodejs runtime). Same job here:
// gate routes by session/role. The backend re-enforces authorization regardless —
// this is only for UX (redirect before rendering a page the user can't use).
const USER_PREFIXES = ["/cart", "/checkout", "/orders", "/account"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = readSessionCookie(request.cookies.get(SESSION_COOKIE)?.value);

  const needsAuth = USER_PREFIXES.some((p) => pathname.startsWith(p));
  const isAdminRoute = pathname.startsWith("/admin");

  if (isAdminRoute) {
    if (!session) return redirectTo("/login", pathname, request);
    if (session.role !== "ADMIN") return NextResponse.redirect(new URL("/", request.url));
  }

  if (needsAuth && !session) return redirectTo("/login", pathname, request);

  return NextResponse.next();
}

function redirectTo(to: string, from: string, request: NextRequest) {
  const url = new URL(to, request.url);
  url.searchParams.set("next", from);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/admin/:path*", "/cart/:path*", "/checkout/:path*", "/orders/:path*", "/account/:path*"],
};
