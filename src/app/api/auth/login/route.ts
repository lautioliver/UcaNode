import { NextRequest, NextResponse } from "next/server";
import { safeAuthRedirect } from "@/lib/auth";
import { loginWithCredentials, parseAuthForm } from "@/lib/auth-service";
import { prisma } from "@/lib/prisma";
import { setSessionOnResponse } from "@/lib/session-response";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const input = parseAuthForm(formData);
  const result = await loginWithCredentials(input);

  if (!result.ok) {
    if (result.pendingVerification && input.email) {
      const url = new URL("/verificar-email", request.url);
      url.searchParams.set("email", input.email);
      if (input.next) url.searchParams.set("next", safeAuthRedirect(input.next));
      return NextResponse.redirect(url);
    }

    const url = new URL("/login", request.url);
    if (input.next) url.searchParams.set("next", safeAuthRedirect(input.next));
    url.searchParams.set("error", result.message);
    return NextResponse.redirect(url);
  }

  const perfil = await prisma.perfil.findUnique({
    where: { id: result.perfilId },
    select: { sessionVersion: true },
  });

  const response = NextResponse.redirect(
    new URL(safeAuthRedirect(input.next), request.url),
  );
  setSessionOnResponse(response, result.perfilId, perfil?.sessionVersion ?? 0);
  return response;
}
