import { describe, it, expect } from "vitest";
import {
  applyEstadoTimestamps,
  notaForTipo,
} from "../entrega-tracking";

describe("notaForTipo", () => {
  it("keeps nota for parcial and final", () => {
    expect(notaForTipo("PARCIAL", 8)).toBe(8);
    expect(notaForTipo("FINAL", 7)).toBe(7);
  });

  it("discards nota for tp", () => {
    expect(notaForTipo("TP", 8)).toBeNull();
  });
});

describe("applyEstadoTimestamps", () => {
  const now = new Date("2026-07-12T12:00:00.000Z");

  it("sets fechaInicio when moving to en curso", () => {
    const patch = applyEstadoTimestamps(
      "PENDIENTE",
      "EN_CURSO",
      { fechaInicio: null, fechaCompletada: null },
      now,
    );
    expect(patch.fechaInicio).toEqual(now);
  });

  it("does not overwrite existing fechaInicio", () => {
    const existingStart = new Date("2026-07-10T12:00:00.000Z");
    const patch = applyEstadoTimestamps(
      "PENDIENTE",
      "EN_CURSO",
      { fechaInicio: existingStart, fechaCompletada: null },
      now,
    );
    expect(patch.fechaInicio).toBeUndefined();
  });

  it("sets fechaCompletada when delivered", () => {
    const patch = applyEstadoTimestamps(
      "EN_CURSO",
      "ENTREGADO",
      { fechaInicio: now, fechaCompletada: null },
      now,
    );
    expect(patch.fechaCompletada).toEqual(now);
  });

  it("clears timestamps when reverting delivery", () => {
    const patch = applyEstadoTimestamps(
      "ENTREGADO",
      "PENDIENTE",
      { fechaInicio: now, fechaCompletada: now },
      now,
    );
    expect(patch.fechaCompletada).toBeNull();
  });

  it("clears fechaInicio when leaving en curso", () => {
    const patch = applyEstadoTimestamps(
      "EN_CURSO",
      "PENDIENTE",
      { fechaInicio: now, fechaCompletada: null },
      now,
    );
    expect(patch.fechaInicio).toBeNull();
  });
});
