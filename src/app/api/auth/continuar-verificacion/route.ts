import { NextRequest, NextResponse } from "next/server";
import { safeAuthRedirect } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PERFIL_COOKIE, perfilCookieOptions } from "@/lib/session";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const next = safeAuthRedirect(
    formData.get("next") ? String(formData.get("next")) : null,
  );

  if (!email) {
    const url = new URL("/verificar-email", request.url);
    url.searchParams.set("error", "invalid_email");
    return NextResponse.redirect(url);
  }

  const perfil = await prisma.perfil.findUnique({ where: { emailUcasal: email } });

  if (!perfil?.emailVerifiedAt) {
    const url = new URL("/verificar-email", request.url);
    url.searchParams.set("email", email);
    url.searchParams.set("error", "not_verified");
    return NextResponse.redirect(url);
  }

  const cookieId = request.cookies.get(PERFIL_COOKIE)?.value;
  const cookieMatches =
    cookieId === perfil.id && perfil.emailVerifiedAt != null;

  if (cookieMatches) {
    return NextResponse.redirect(new URL(next, request.url));
  }

  const response = NextResponse.redirect(new URL(next, request.url));
  response.cookies.set(PERFIL_COOKIE, perfil.id, perfilCookieOptions());
  return response;
}
