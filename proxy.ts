import { NextResponse, type NextRequest } from "next/server";
import { ROLE_COOKIE } from "@/lib/session";

// Next.js 16 `proxy` (formerly middleware): redirect before rendering pages the visitor can't use.
// UX only — the Spring Boot backend independently checks authentication and role on every API call.
const USER_PREFIXES = ["/cart", "/checkout", "/orders", "/account", "/profile"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const role = request.cookies.get(ROLE_COOKIE)?.value;

  if (pathname.startsWith("/admin")) {
    if (!role) return redirectToLogin(pathname, request);
    if (role !== "ADMIN") return NextResponse.redirect(new URL("/", request.url));
  }

  if (USER_PREFIXES.some((p) => pathname.startsWith(p)) && !role) {
    return redirectToLogin(pathname, request);
  }

  return NextResponse.next();
}

function redirectToLogin(from: string, request: NextRequest) {
  const url = new URL("/login", request.url);
  url.searchParams.set("next", from);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/admin/:path*", "/cart/:path*", "/checkout/:path*", "/orders/:path*", "/account/:path*", "/profile/:path*"],
};
