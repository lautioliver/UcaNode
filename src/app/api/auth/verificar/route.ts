import { NextRequest, NextResponse } from "next/server";
import { safeAuthRedirect } from "@/lib/auth";
import { verifyToken } from "@/lib/email-verification";
import { PERFIL_COOKIE, perfilCookieOptions } from "@/lib/session";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  const next = safeAuthRedirect(request.nextUrl.searchParams.get("next"));

  if (!token) {
    const url = new URL("/verificar-email", request.url);
    url.searchParams.set("error", "invalid");
    return NextResponse.redirect(url);
  }

  const result = await verifyToken(token);

  if (!result.ok) {
    const url = new URL("/verificar-email", request.url);
    url.searchParams.set("error", result.reason);
    return NextResponse.redirect(url);
  }

  const response = NextResponse.redirect(new URL(next, request.url));
  response.cookies.set(PERFIL_COOKIE, result.perfilId, perfilCookieOptions());
  return response;
}
