import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rate-limit";
import { PERFIL_COOKIE } from "@/lib/session";

export async function GET(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  if (!checkRateLimit(ip)) {
    return NextResponse.json({ verified: false, error: "rate_limit" }, { status: 429 });
  }

  const email = request.nextUrl.searchParams.get("email")?.trim().toLowerCase();
  const cookieId = request.cookies.get(PERFIL_COOKIE)?.value;

  let perfil = null;

  if (cookieId) {
    perfil = await prisma.perfil.findUnique({ where: { id: cookieId } });
  }

  if (!perfil && email) {
    perfil = await prisma.perfil.findUnique({ where: { emailUcasal: email } });
  }

  if (!perfil) {
    return NextResponse.json({ verified: false });
  }

  return NextResponse.json({ verified: perfil.emailVerifiedAt != null });
}
