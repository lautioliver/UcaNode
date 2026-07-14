import { describe, it, expect } from "vitest";
import { hashVerificationToken } from "../verification-token";

describe("email verification helpers", () => {
  it("hashes tokens deterministically", () => {
    const hashA = hashVerificationToken("token-abc");
    const hashB = hashVerificationToken("token-abc");
    const hashC = hashVerificationToken("token-xyz");

    expect(hashA).toBe(hashB);
    expect(hashA).not.toBe(hashC);
    expect(hashA).toHaveLength(64);
  });
});
