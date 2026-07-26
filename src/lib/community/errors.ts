import type { ActionResult } from "@/lib/actions";

export function formatActionError(result: ActionResult, fallback: string): string {
  if (result.errors) {
    const messages = Object.values(result.errors).flat().filter(Boolean);
    if (messages.length > 0) return messages.join(" · ");
  }
  return result.message ?? fallback;
}

export function isValidAttachmentUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}
