import { NextRequest, NextResponse } from "next/server";
import { safeAuthRedirect } from "@/lib/auth";
import { clearSessionOnResponse } from "@/lib/session-response";

function logoutRedirect(request: NextRequest) {
  const next = request.nextUrl.searchParams.get("next");
  const url = new URL("/login", request.url);
  if (next) {
    url.searchParams.set("next", safeAuthRedirect(next));
  }
  const response = NextResponse.redirect(url);
  clearSessionOnResponse(response);
  return response;
}

export async function GET(request: NextRequest) {
  return logoutRedirect(request);
}

export async function POST(request: NextRequest) {
  return logoutRedirect(request);
}
