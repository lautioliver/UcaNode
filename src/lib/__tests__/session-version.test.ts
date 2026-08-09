import { describe, it, expect } from "vitest";

function sessionVersionMatches(
  cookieVersion: number | undefined,
  expectedVersion: number,
) {
  if (cookieVersion === undefined) {
    return expectedVersion === 0;
  }
  return cookieVersion === expectedVersion;
}

describe("session version matching", () => {
  it("accepts legacy cookies at version 0", () => {
    expect(sessionVersionMatches(undefined, 0)).toBe(true);
  });

  it("rejects legacy cookies after password change", () => {
    expect(sessionVersionMatches(undefined, 1)).toBe(false);
  });

  it("accepts matching version cookies", () => {
    expect(sessionVersionMatches(2, 2)).toBe(true);
  });

  it("rejects stale version cookies", () => {
    expect(sessionVersionMatches(1, 2)).toBe(false);
  });
});
