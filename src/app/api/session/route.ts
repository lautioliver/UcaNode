import { NextRequest, NextResponse } from "next/server";

function safeNextPath(next: string | null): string {
  if (!next || !next.startsWith("/") || next.startsWith("//")) return "/";
  return next;
}

/** @deprecated Guest sessions removed — redirects to login */
export async function GET(request: NextRequest) {
  const next = safeNextPath(request.nextUrl.searchParams.get("next"));
  const url = new URL("/login", request.url);
  if (next !== "/") url.searchParams.set("next", next);
  return NextResponse.redirect(url);
}
