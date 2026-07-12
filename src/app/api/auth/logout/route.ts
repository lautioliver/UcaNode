import { NextRequest, NextResponse } from "next/server";
import { PERFIL_COOKIE } from "@/lib/session";

export async function POST(request: NextRequest) {
  const response = NextResponse.redirect(new URL("/login", request.url));
  response.cookies.delete(PERFIL_COOKIE);
  return response;
}
