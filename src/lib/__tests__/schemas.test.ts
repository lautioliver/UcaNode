import { describe, it, expect } from "vitest";
import {
  materiaSchema,
  entregaSchema,
  horarioSchema,
  linkSchema,
  perfilSchema,
  loginSchema,
  registroSchema,
} from "../schemas";

describe("materiaSchema", () => {
  it("accepts valid materia", () => {
    const result = materiaSchema.safeParse({ nombre: "Álgebra" });
    expect(result.success).toBe(true);
  });

  it("rejects empty nombre", () => {
    const result = materiaSchema.safeParse({ nombre: "" });
    expect(result.success).toBe(false);
  });

  it("defaults estado to CURSANDO", () => {
    const result = materiaSchema.parse({ nombre: "Álgebra" });
    expect(result.estado).toBe("CURSANDO");
  });
});

describe("entregaSchema", () => {
  it("accepts valid entrega", () => {
    const result = entregaSchema.safeParse({
      titulo: "TP 1",
      tipo: "TP",
      fecha: "2026-08-01",
      materiaId: "abc123",
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing titulo", () => {
    const result = entregaSchema.safeParse({
      tipo: "TP",
      fecha: "2026-08-01",
      materiaId: "abc123",
    });
    expect(result.success).toBe(false);
  });

  it("accepts a parcial with nota within range", () => {
    const result = entregaSchema.safeParse({
      titulo: "Parcial 1",
      tipo: "PARCIAL",
      fecha: "2026-08-01",
      materiaId: "abc123",
      nota: 8,
    });
    expect(result.success).toBe(true);
  });

  it("allows nota to be null", () => {
    const result = entregaSchema.safeParse({
      titulo: "Parcial 1",
      tipo: "PARCIAL",
      fecha: "2026-08-01",
      materiaId: "abc123",
      nota: null,
    });
    expect(result.success).toBe(true);
  });

  it("accepts a final with nota within range", () => {
    const result = entregaSchema.safeParse({
      titulo: "Final",
      tipo: "FINAL",
      fecha: "2026-08-01",
      materiaId: "abc123",
      nota: 7,
    });
    expect(result.success).toBe(true);
  });

  it("rejects nota greater than 10", () => {
    const result = entregaSchema.safeParse({
      titulo: "Parcial 1",
      tipo: "PARCIAL",
      fecha: "2026-08-01",
      materiaId: "abc123",
      nota: 11,
    });
    expect(result.success).toBe(false);
  });
});

describe("linkSchema", () => {
  it("accepts valid link", () => {
    const result = linkSchema.safeParse({
      nombre: "GitHub",
      url: "https://github.com",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid url", () => {
    const result = linkSchema.safeParse({
      nombre: "GitHub",
      url: "not-a-url",
    });
    expect(result.success).toBe(false);
  });
});

describe("perfilSchema", () => {
  it("accepts valid perfil", () => {
    const result = perfilSchema.safeParse({
      nombre: "Juan",
      emailUcasal: "juan@ucasal.edu.ar",
      anioIngreso: 2024,
    });
    expect(result.success).toBe(true);
  });

  it("accepts perfil without email", () => {
    const result = perfilSchema.safeParse({
      nombre: "Juan",
      emailUcasal: "",
      anioIngreso: 2024,
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.emailUcasal).toBeNull();
    }
  });

  it("rejects invalid email", () => {
    const result = perfilSchema.safeParse({
      nombre: "Juan",
      emailUcasal: "not-email",
      anioIngreso: 2024,
    });
    expect(result.success).toBe(false);
  });
});

describe("loginSchema", () => {
  it("accepts valid login", () => {
    const result = loginSchema.safeParse({
      email: "Juan@Mail.COM",
      password: "secret123",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBe("juan@mail.com");
    }
  });
});

describe("registroSchema", () => {
  it("accepts matching passwords", () => {
    const result = registroSchema.safeParse({
      nombre: "Juan",
      email: "juan@mail.com",
      password: "secret123",
      confirmPassword: "secret123",
    });
    expect(result.success).toBe(true);
  });

  it("rejects mismatched passwords", () => {
    const result = registroSchema.safeParse({
      nombre: "Juan",
      email: "juan@mail.com",
      password: "secret123",
      confirmPassword: "other",
    });
    expect(result.success).toBe(false);
  });
});

describe("horarioSchema", () => {
  it("accepts valid horario", () => {
    const result = horarioSchema.safeParse({
      dia: "LUNES",
      horaInicio: "18:00",
      horaFin: "22:00",
      materiaId: "abc123",
    });
    expect(result.success).toBe(true);
  });
});
