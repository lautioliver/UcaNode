import { describe, it, expect } from "vitest";
import { isPerfilRegistrado, safeAuthRedirect } from "../auth";

describe("auth helpers", () => {
  it("detects registered profile", () => {
    expect(
      isPerfilRegistrado({
        emailUcasal: "juan@mail.com",
        password: "scrypt$abc$def",
      }),
    ).toBe(true);
  });

  it("detects guest profile", () => {
    expect(isPerfilRegistrado({ emailUcasal: null, password: null })).toBe(false);
  });

  it("sanitizes redirect paths", () => {
    expect(safeAuthRedirect("/materias")).toBe("/materias");
    expect(safeAuthRedirect("//evil.com")).toBe("/");
    expect(safeAuthRedirect("/login")).toBe("/");
  });
});
