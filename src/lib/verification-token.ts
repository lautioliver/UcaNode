import { createHash, randomBytes } from "node:crypto";

export const TOKEN_BYTES = 32;
export const TOKEN_TTL_MS = 24 * 60 * 60 * 1000;
export const RESEND_COOLDOWN_MS = 60 * 1000;

export function hashVerificationToken(rawToken: string) {
  return createHash("sha256").update(rawToken).digest("hex");
}

export function createRawVerificationToken() {
  return randomBytes(TOKEN_BYTES).toString("base64url");
}
