import { NextRequest, NextResponse } from "next/server";
import { safeAuthRedirect } from "@/lib/auth";
import { verifyToken } from "@/lib/email-verification";
import { prisma } from "@/lib/prisma";
import { setSessionOnResponse } from "@/lib/session-response";

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

  const perfil = await prisma.perfil.findUnique({
    where: { id: result.perfilId },
    select: { sessionVersion: true },
  });

  const response = NextResponse.redirect(new URL(next, request.url));
  setSessionOnResponse(response, result.perfilId, perfil?.sessionVersion ?? 0);
  return response;
}
