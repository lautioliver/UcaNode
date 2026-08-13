import { describe, it, expect } from "vitest";
import {
  EDIFICIOS_LISTA,
  EDIFICIOS_UCASAL,
  EDIFICIO_ID_MAX,
  EDIFICIO_ID_MIN,
  MAPA_CAMPUS,
  PUNTOS_CAMPUS,
  buscarPuntoPorZona,
  esEdificioValido,
  getEdificio,
} from "../campus/edificios";

describe("EDIFICIOS_UCASAL", () => {
  it("tiene los 21 edificios del mapa oficial sin huecos", () => {
    expect(EDIFICIOS_LISTA).toHaveLength(21);
    expect(EDIFICIOS_LISTA.map((e) => e.id)).toEqual(
      Array.from({ length: 21 }, (_, i) => i + 1),
    );
  });

  it("usa la clave del record como id del edificio", () => {
    for (const [clave, edificio] of Object.entries(EDIFICIOS_UCASAL)) {
      expect(edificio.id).toBe(Number(clave));
    }
  });

  it("tiene nombre y unidad académica en todos los edificios", () => {
    for (const edificio of EDIFICIOS_LISTA) {
      expect(edificio.nombre.trim().length).toBeGreaterThan(0);
      expect(edificio.unidadAcademica.trim().length).toBeGreaterThan(0);
    }
  });

  it("mantiene las coordenadas en porcentaje dentro del mapa", () => {
    for (const edificio of EDIFICIOS_LISTA) {
      expect(edificio.x).toBeGreaterThan(0);
      expect(edificio.x).toBeLessThan(100);
      expect(edificio.y).toBeGreaterThan(0);
      expect(edificio.y).toBeLessThan(100);
    }
  });

  it("no repite coordenadas entre edificios", () => {
    const claves = EDIFICIOS_LISTA.map((e) => `${e.x},${e.y}`);
    expect(new Set(claves).size).toBe(claves.length);
  });

  it("clasifica 1-11 como académicos y 12-21 como institucionales", () => {
    for (const edificio of EDIFICIOS_LISTA) {
      expect(edificio.categoria).toBe(
        edificio.id <= 11 ? "ACADEMICA" : "INSTITUCIONAL",
      );
    }
  });
});

describe("esEdificioValido", () => {
  it("acepta el rango del mapa", () => {
    expect(esEdificioValido(EDIFICIO_ID_MIN)).toBe(true);
    expect(esEdificioValido(EDIFICIO_ID_MAX)).toBe(true);
    expect(esEdificioValido(10)).toBe(true);
  });

  it("rechaza valores fuera de rango, decimales y no numéricos", () => {
    expect(esEdificioValido(0)).toBe(false);
    expect(esEdificioValido(22)).toBe(false);
    expect(esEdificioValido(3.5)).toBe(false);
    expect(esEdificioValido("3")).toBe(false);
    expect(esEdificioValido(null)).toBe(false);
    expect(esEdificioValido(undefined)).toBe(false);
  });
});

describe("getEdificio", () => {
  it("devuelve el edificio cuando el id es válido", () => {
    expect(getEdificio(3)?.nombre).toBe("Facultad de Ingeniería");
  });

  it("devuelve null para ids inválidos o vacíos", () => {
    expect(getEdificio(0)).toBeNull();
    expect(getEdificio(99)).toBeNull();
    expect(getEdificio(null)).toBeNull();
    expect(getEdificio(undefined)).toBeNull();
  });
});

describe("PUNTOS_CAMPUS", () => {
  it("no repite ids", () => {
    const ids = PUNTOS_CAMPUS.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("mantiene las coordenadas dentro del mapa", () => {
    for (const punto of PUNTOS_CAMPUS) {
      expect(punto.x).toBeGreaterThan(0);
      expect(punto.x).toBeLessThan(100);
      expect(punto.y).toBeGreaterThan(0);
      expect(punto.y).toBeLessThan(100);
    }
  });

  it("no comparte alias entre puntos distintos", () => {
    const vistos = new Map<string, string>();
    for (const punto of PUNTOS_CAMPUS) {
      for (const alias of punto.alias) {
        expect(vistos.get(alias)).toBeUndefined();
        vistos.set(alias, punto.id);
      }
    }
  });
});

describe("buscarPuntoPorZona", () => {
  it("matchea nombres exactos ignorando tildes y mayúsculas", () => {
    expect(buscarPuntoPorZona("BIBLIOTECA")?.id).toBe("biblioteca");
    expect(buscarPuntoPorZona("Confiteria")?.id).toBe("confiteria");
  });

  it("matchea por alias y por nombre parcial de zona", () => {
    expect(buscarPuntoPorZona("Buffet central")?.id).toBe("confiteria");
    expect(buscarPuntoPorZona("Gym")?.id).toBe("gimnasio");
    expect(buscarPuntoPorZona("Aula Magna - planta baja")?.id).toBe("aula-magna");
  });

  it("devuelve null cuando la zona no corresponde a ningún punto", () => {
    expect(buscarPuntoPorZona("Estacionamiento norte")).toBeNull();
    expect(buscarPuntoPorZona("")).toBeNull();
    expect(buscarPuntoPorZona("   ")).toBeNull();
  });
});

describe("MAPA_CAMPUS", () => {
  it("apunta al asset local con sus dimensiones reales", () => {
    expect(MAPA_CAMPUS.src).toBe("/images/mapa-ucasal-castanares.webp");
    expect(MAPA_CAMPUS.width).toBe(2111);
    expect(MAPA_CAMPUS.height).toBe(1123);
  });
});
