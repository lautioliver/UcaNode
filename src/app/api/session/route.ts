import { NextRequest, NextResponse } from "next/server";
import { createPerfilSession } from "@/lib/perfil";
import { PERFIL_COOKIE, perfilCookieOptions } from "@/lib/session";

function safeNextPath(next: string | null): string {
  if (!next || !next.startsWith("/") || next.startsWith("//")) return "/";
  return next;
}

export async function GET(request: NextRequest) {
  const next = safeNextPath(request.nextUrl.searchParams.get("next"));
  const perfil = await createPerfilSession();

  const response = NextResponse.redirect(new URL(next, request.url));
  response.cookies.set(PERFIL_COOKIE, perfil.id, perfilCookieOptions());
  return response;
}
