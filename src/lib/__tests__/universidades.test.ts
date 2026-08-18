import { describe, expect, it } from "vitest";
import {
  getUniversidad,
  getUniversidadNovedades,
  listUniversidades,
  listUniversidadesPublicas,
  UNIVERSIDAD_DEFAULT_SLUG,
} from "@/lib/universidades/catalogo";
import {
  CARRERAS_DISPONIBLES,
  listCarrerasByUniversidad,
} from "@/lib/planes-estudio/catalogo";

describe("catálogo de universidades", () => {
  it("incluye UCASAL activa y UNSa en construcción", () => {
    const ucasal = getUniversidad("ucasal");
    const unsa = getUniversidad("unsa");

    expect(ucasal?.estado).toBe("activa");
    expect(ucasal?.nombreCorto).toBe("UCASAL");
    expect(unsa?.estado).toBe("en_construccion");
    expect(unsa?.nombreCorto).toBe("UNSa");
    expect(listUniversidades().map((u) => u.slug)).toEqual(["ucasal", "unsa"]);
  });

  it("devuelve null si el slug no existe", () => {
    expect(getUniversidad("unju")).toBeNull();
  });

  it("lista como públicas solo las universidades en construcción", () => {
    expect(listUniversidadesPublicas().map((u) => u.slug)).toEqual(["unsa"]);
  });

  it("ordena novedades de más reciente a más antigua", () => {
    const universidad = {
      slug: "demo",
      nombre: "Demo",
      nombreCorto: "Demo",
      estado: "en_construccion" as const,
      tagline: "",
      descripcion: "",
      novedades: [
        { fecha: "2026-01-01", titulo: "Primera", cuerpo: "" },
        { fecha: "2026-08-18", titulo: "Última", cuerpo: "" },
      ],
    };

    expect(getUniversidadNovedades(universidad).map((n) => n.titulo)).toEqual([
      "Última",
      "Primera",
    ]);
  });
});

describe("carreras por universidad", () => {
  it("asocia todas las carreras actuales a UCASAL", () => {
    expect(CARRERAS_DISPONIBLES.length).toBeGreaterThan(0);
    expect(
      CARRERAS_DISPONIBLES.every((c) => c.universidadSlug === UNIVERSIDAD_DEFAULT_SLUG),
    ).toBe(true);
    expect(listCarrerasByUniversidad("ucasal")).toHaveLength(
      CARRERAS_DISPONIBLES.length,
    );
    expect(listCarrerasByUniversidad("unsa")).toEqual([]);
  });
});
