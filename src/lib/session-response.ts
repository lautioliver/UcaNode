import type { NextResponse } from "next/server";
import { sessionCookieEntries } from "@/lib/session";

export function setSessionOnResponse(
  response: NextResponse,
  perfilId: string,
  sessionVersion: number,
) {
  for (const entry of sessionCookieEntries(perfilId, sessionVersion)) {
    response.cookies.set(entry.name, entry.value, entry.options);
  }
}

export function clearSessionOnResponse(response: NextResponse) {
  response.cookies.delete("ucanode_perfil_id");
  response.cookies.delete("ucanode_session_v");
}
