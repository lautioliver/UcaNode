import { NextRequest, NextResponse } from "next/server";
import { clearSessionOnResponse } from "@/lib/session-response";

export async function POST(request: NextRequest) {
  const response = NextResponse.redirect(new URL("/login", request.url));
  clearSessionOnResponse(response);
  return response;
}
