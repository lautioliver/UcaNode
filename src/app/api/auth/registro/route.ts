import { NextRequest, NextResponse } from "next/server";
import { safeAuthRedirect } from "@/lib/auth";
import { parseAuthForm, registerAccount } from "@/lib/auth-service";

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

  const url = new URL("/verificar-email", request.url);
  if (input.email) url.searchParams.set("email", input.email);
  if (input.next) url.searchParams.set("next", safeAuthRedirect(input.next));
  url.searchParams.set("sent", "1");
  return NextResponse.redirect(url);
}
