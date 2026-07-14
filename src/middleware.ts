import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { PERFIL_COOKIE } from "@/lib/session";

function shouldSkipSession(pathname: string) {
  return (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/registro") ||
    pathname.startsWith("/verificar-email") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml"
  );
}

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", `${pathname}${search}`);

  if (shouldSkipSession(pathname)) {
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  if (!request.cookies.get(PERFIL_COOKIE)?.value) {
    const url = request.nextUrl.clone();
    url.pathname = "/api/session";
    url.searchParams.set("next", `${pathname}${search}`);
    return NextResponse.redirect(url);
  }

  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
