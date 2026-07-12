import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scryptAsync = promisify(scrypt);

const PREFIX = "scrypt";
const SALT_BYTES = 16;
const KEY_LEN = 64;

export function isPasswordHashed(value: string): boolean {
  return value.startsWith(`${PREFIX}$`);
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(SALT_BYTES);
  const derived = (await scryptAsync(password, salt, KEY_LEN)) as Buffer;
  return `${PREFIX}$${salt.toString("base64url")}$${derived.toString("base64url")}`;
}

export async function verifyPassword(
  password: string,
  stored: string,
): Promise<boolean> {
  if (!isPasswordHashed(stored)) return false;

  const parts = stored.split("$");
  if (parts.length !== 3) return false;

  const salt = Buffer.from(parts[1], "base64url");
  const expected = Buffer.from(parts[2], "base64url");
  const derived = (await scryptAsync(password, salt, KEY_LEN)) as Buffer;

  if (expected.length !== derived.length) return false;
  return timingSafeEqual(expected, derived);
}
