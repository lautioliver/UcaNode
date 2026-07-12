import { describe, it, expect } from "vitest";
import {
  computeAnalyticsKpis,
  entregasConNota,
  filterEntregas,
  topMateriasByEntregas,
  type EntregaAnalytics,
} from "../analytics-utils";

const baseEntrega = (
  overrides: Partial<EntregaAnalytics> & Pick<EntregaAnalytics, "id">,
): EntregaAnalytics => ({
  titulo: "Entrega",
  tipo: "TP",
  fecha: "2026-08-01",
  estado: "PENDIENTE",
  nota: null,
  fechaInicio: null,
  fechaCompletada: null,
  materia: { id: "m1", nombre: "Matemática", cuatrimestre: 1 },
  ...overrides,
});

describe("computeAnalyticsKpis", () => {
  it("calculates completion and on-time rates", () => {
    const entregas: EntregaAnalytics[] = [
      baseEntrega({
        id: "1",
        estado: "ENTREGADO",
        fecha: "2026-08-10",
        fechaCompletada: "2026-08-09",
        fechaInicio: "2026-08-01",
      }),
      baseEntrega({
        id: "2",
        estado: "ENTREGADO",
        fecha: "2026-08-05",
        fechaCompletada: "2026-08-06",
      }),
      baseEntrega({ id: "3", estado: "PENDIENTE" }),
    ];

    const kpis = computeAnalyticsKpis(entregas);
    expect(kpis.total).toBe(3);
    expect(kpis.completadas).toBe(2);
    expect(kpis.tasaCompletitud).toBeCloseTo(2 / 3);
    expect(kpis.aTiempo).toBe(1);
    expect(kpis.aTiempoBase).toBe(2);
    expect(kpis.duracionBase).toBe(1);
    expect(kpis.duracionPromedioDias).toBeCloseTo(8);
  });

  it("averages grades for parciales and finales", () => {
    const entregas: EntregaAnalytics[] = [
      baseEntrega({ id: "1", tipo: "PARCIAL", nota: 8 }),
      baseEntrega({ id: "2", tipo: "FINAL", nota: 6 }),
      baseEntrega({ id: "3", tipo: "TP", nota: 10 }),
    ];

    const kpis = computeAnalyticsKpis(entregas);
    expect(kpis.promedioNotas).toBe(7);
    expect(kpis.notasCargadas).toBe(2);
  });
});

describe("filterEntregas", () => {
  it("filters by materia and cuatrimestre", () => {
    const entregas: EntregaAnalytics[] = [
      baseEntrega({ id: "1", materia: { id: "m1", nombre: "A", cuatrimestre: 1 } }),
      baseEntrega({ id: "2", materia: { id: "m2", nombre: "B", cuatrimestre: 2 } }),
    ];

    expect(filterEntregas(entregas, { materiaId: "m2" })).toHaveLength(1);
    expect(filterEntregas(entregas, { cuatrimestre: 1 })).toHaveLength(1);
  });
});

describe("topMateriasByEntregas", () => {
  it("returns top materias sorted by total", () => {
    const entregas: EntregaAnalytics[] = [
      baseEntrega({ id: "1", materia: { id: "m1", nombre: "A", cuatrimestre: 1 } }),
      baseEntrega({ id: "2", materia: { id: "m1", nombre: "A", cuatrimestre: 1 }, estado: "ENTREGADO" }),
      baseEntrega({ id: "3", materia: { id: "m2", nombre: "B", cuatrimestre: 1 } }),
    ];

    const top = topMateriasByEntregas(entregas);
    expect(top[0]?.materiaId).toBe("m1");
    expect(top[0]?.total).toBe(2);
    expect(top[0]?.completadas).toBe(1);
  });
});

describe("entregasConNota", () => {
  it("lists graded parciales and finales", () => {
    const entregas: EntregaAnalytics[] = [
      baseEntrega({ id: "1", tipo: "PARCIAL", nota: 8 }),
      baseEntrega({ id: "2", tipo: "FINAL", nota: 7 }),
      baseEntrega({ id: "3", tipo: "TP", nota: null }),
    ];

    expect(entregasConNota(entregas)).toHaveLength(2);
  });
});
