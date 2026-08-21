const buckets = new Map<string, { count: number; resetAt: number }>();

const WINDOW_MS = 60_000;
const MAX_REQUESTS = 20;

export type RateLimitOptions = {
  key?: string;
  max?: number;
  windowMs?: number;
};

export function checkRateLimit(
  ip: string,
  options: RateLimitOptions = {},
): boolean {
  const now = Date.now();
  const max = options.max ?? MAX_REQUESTS;
  const windowMs = options.windowMs ?? WINDOW_MS;
  const bucketKey = `${options.key ?? "default"}:${ip}`;
  const entry = buckets.get(bucketKey);

  if (!entry || now > entry.resetAt) {
    buckets.set(bucketKey, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (entry.count >= max) {
    return false;
  }

  entry.count++;
  return true;
}
