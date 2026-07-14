import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { resendVerificationForEmail } from "@/lib/email-verification";
import { checkRateLimit } from "@/lib/rate-limit";

const emailSchema = z
  .string()
  .trim()
  .email()
  .transform((value) => value.toLowerCase());

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for") ??
    request.headers.get("x-real-ip") ??
    "unknown";

  if (!checkRateLimit(ip)) {
    const url = new URL("/verificar-email", request.url);
    url.searchParams.set("error", "rate_limit");
    return NextResponse.redirect(url);
  }

  const formData = await request.formData();
  const rawEmail = formData.get("email");
  const parsed = emailSchema.safeParse(rawEmail);

  const url = new URL("/verificar-email", request.url);
  if (typeof rawEmail === "string" && rawEmail.trim()) {
    url.searchParams.set("email", rawEmail.trim().toLowerCase());
  }

  if (!parsed.success) {
    url.searchParams.set("error", "invalid_email");
    return NextResponse.redirect(url);
  }

  try {
    const result = await resendVerificationForEmail(parsed.data);
    if (!result.ok) {
      url.searchParams.set("error", "cooldown");
      return NextResponse.redirect(url);
    }
  } catch (e) {
    console.error("reenviar-verificacion", e);
    url.searchParams.set("error", "send_failed");
    return NextResponse.redirect(url);
  }

  url.searchParams.set("sent", "1");
  return NextResponse.redirect(url);
}
