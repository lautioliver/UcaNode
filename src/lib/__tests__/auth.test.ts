import { describe, it, expect } from "vitest";
import {
  isPerfilRegistrado,
  isPerfilPendienteVerificacion,
  safeAuthRedirect,
} from "../auth";

describe("auth helpers", () => {
  it("detects verified registered profile", () => {
    expect(
      isPerfilRegistrado({
        emailUcasal: "juan@mail.com",
        password: "scrypt$abc$def",
        emailVerifiedAt: new Date("2026-01-01"),
      }),
    ).toBe(true);
  });

  it("detects pending verification profile", () => {
    expect(
      isPerfilPendienteVerificacion({
        emailUcasal: "juan@mail.com",
        password: "scrypt$abc$def",
        emailVerifiedAt: null,
      }),
    ).toBe(true);
    expect(
      isPerfilRegistrado({
        emailUcasal: "juan@mail.com",
        password: "scrypt$abc$def",
        emailVerifiedAt: null,
      }),
    ).toBe(false);
  });

  it("detects guest profile", () => {
    expect(
      isPerfilRegistrado({
        emailUcasal: null,
        password: null,
        emailVerifiedAt: null,
      }),
    ).toBe(false);
  });

  it("sanitizes redirect paths", () => {
    expect(safeAuthRedirect("/materias")).toBe("/materias");
    expect(safeAuthRedirect("//evil.com")).toBe("/");
    expect(safeAuthRedirect("/login")).toBe("/");
    expect(safeAuthRedirect("/verificar-email")).toBe("/");
  });
});
