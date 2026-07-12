import { NextRequest, NextResponse } from "next/server";
import { safeAuthRedirect } from "@/lib/auth";
import { parseAuthForm, registerAccount } from "@/lib/auth-service";
import { PERFIL_COOKIE, perfilCookieOptions } from "@/lib/session";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const input = parseAuthForm(formData);
  const result = await registerAccount(input);

  if (!result.ok) {
    const url = new URL("/registro", request.url);
    if (input.next) url.searchParams.set("next", safeAuthRedirect(input.next));
    url.searchParams.set("error", result.message);
    return NextResponse.redirect(url);
  }

  const response = NextResponse.redirect(
    new URL(safeAuthRedirect(input.next), request.url),
  );
  response.cookies.set(PERFIL_COOKIE, result.perfilId, perfilCookieOptions());
  return response;
}
