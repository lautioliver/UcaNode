import { describe, it, expect } from "vitest";
import {
  claseDestacada,
  formatearEspera,
  minutosDeHora,
  momentoCampus,
} from "../horario-utils";

const clases = [
  { dia: "LUNES", horaInicio: "08:00", horaFin: "10:00", id: "temprana" },
  { dia: "LUNES", horaInicio: "16:00", horaFin: "18:00", id: "tarde" },
  { dia: "LUNES", horaInicio: "19:00", horaFin: "21:00", id: "noche" },
  { dia: "MARTES", horaInicio: "09:00", horaFin: "11:00", id: "otro-dia" },
];

describe("minutosDeHora", () => {
  it("convierte horas válidas", () => {
    expect(minutosDeHora("00:00")).toBe(0);
    expect(minutosDeHora("08:30")).toBe(510);
    expect(minutosDeHora("23:59")).toBe(1439);
    expect(minutosDeHora("9:05")).toBe(545);
  });

  it("devuelve null para valores inválidos", () => {
    expect(minutosDeHora("")).toBeNull();
    expect(minutosDeHora("24:00")).toBeNull();
    expect(minutosDeHora("10:60")).toBeNull();
    expect(minutosDeHora("mediodía")).toBeNull();
  });
});

describe("momentoCampus", () => {
  it("usa la zona del campus en lugar de la del proceso", () => {
    // 2026-08-13 02:30 UTC es el miércoles 12 a las 23:30 en Salta.
    const momento = momentoCampus(new Date("2026-08-13T02:30:00Z"));
    expect(momento.dia).toBe("MIERCOLES");
    expect(momento.minutos).toBe(23 * 60 + 30);
  });

  it("devuelve null los fines de semana", () => {
    expect(momentoCampus(new Date("2026-08-15T15:00:00Z")).dia).toBeNull();
    expect(momentoCampus(new Date("2026-08-16T15:00:00Z")).dia).toBeNull();
  });
});

describe("claseDestacada", () => {
  it("devuelve la clase en curso con los minutos que le quedan", () => {
    const resultado = claseDestacada(clases, { dia: "LUNES", minutos: 17 * 60 });
    expect(resultado?.horario.id).toBe("tarde");
    expect(resultado?.estado).toBe("EN_CURSO");
    expect(resultado?.minutos).toBe(60);
  });

  it("devuelve la siguiente clase cuando no hay ninguna en curso", () => {
    const resultado = claseDestacada(clases, {
      dia: "LUNES",
      minutos: 18 * 60 + 30,
    });
    expect(resultado?.horario.id).toBe("noche");
    expect(resultado?.estado).toBe("PROXIMA");
    expect(resultado?.minutos).toBe(30);
  });

  it("ignora las clases de otros días", () => {
    const resultado = claseDestacada(clases, { dia: "MARTES", minutos: 8 * 60 });
    expect(resultado?.horario.id).toBe("otro-dia");
  });

  it("devuelve null cuando ya terminaron todas las clases del día", () => {
    expect(claseDestacada(clases, { dia: "LUNES", minutos: 22 * 60 })).toBeNull();
  });

  it("devuelve null los fines de semana y sin clases", () => {
    expect(claseDestacada(clases, { dia: null, minutos: 600 })).toBeNull();
    expect(claseDestacada([], { dia: "LUNES", minutos: 600 })).toBeNull();
  });

  it("descarta horarios con horas inválidas", () => {
    const resultado = claseDestacada(
      [{ dia: "LUNES", horaInicio: "no-es-hora", horaFin: "10:00", id: "roto" }],
      { dia: "LUNES", minutos: 8 * 60 },
    );
    expect(resultado).toBeNull();
  });

  it("toma la clase que arranca primero cuando hay varias por delante", () => {
    const resultado = claseDestacada(clases, { dia: "LUNES", minutos: 6 * 60 });
    expect(resultado?.horario.id).toBe("temprana");
  });
});

describe("formatearEspera", () => {
  it("formatea minutos, horas y horas con resto", () => {
    expect(formatearEspera(0)).toBe("ahora");
    expect(formatearEspera(25)).toBe("en 25 min");
    expect(formatearEspera(60)).toBe("en 1 h");
    expect(formatearEspera(130)).toBe("en 2 h 10 min");
  });
});
