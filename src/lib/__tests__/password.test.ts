import { describe, expect, it } from "vitest";
import { hashPassword, isPasswordHashed, verifyPassword } from "@/lib/password";

describe("password", () => {
  it("hashea y verifica correctamente", async () => {
    const hash = await hashPassword("mi-clave-secreta");
    expect(isPasswordHashed(hash)).toBe(true);
    expect(await verifyPassword("mi-clave-secreta", hash)).toBe(true);
    expect(await verifyPassword("otra-clave", hash)).toBe(false);
  });

  it("genera hashes distintos para la misma contraseña", async () => {
    const a = await hashPassword("repetida");
    const b = await hashPassword("repetida");
    expect(a).not.toBe(b);
    expect(await verifyPassword("repetida", a)).toBe(true);
    expect(await verifyPassword("repetida", b)).toBe(true);
  });

  it("rechaza texto plano legacy en verify", async () => {
    expect(isPasswordHashed("texto-plano")).toBe(false);
    expect(await verifyPassword("texto-plano", "texto-plano")).toBe(false);
  });
});
