import { describe, it, expect } from "vitest";
import {
  autoInfoFromName,
  findMateriaByName,
  formatCorrelativas,
  normalize,
  planEstudio,
  semestreLabel,
} from "../correlatividades";

describe("normalize", () => {
  it("remueve tildes y pasa a lowercase", () => {
    expect(normalize("Álgebra Lineal I")).toBe("algebra lineal 1");
    expect(normalize("Análisis Matemático III")).toBe("analisis matematico 3");
  });

  it("colapsa espacios y remueve puntuación", () => {
    expect(normalize("  Bases  de,Datos.II ")).toBe("bases de datos 2");
  });

  it("convierte números romanos a arábigos", () => {
    expect(normalize("Lenguajes IV")).toBe("lenguajes 4");
    expect(normalize("Redes II")).toBe("redes 2");
  });
});

describe("findMateriaByName - matches directos", () => {
  it("encuentra por nombre exacto", () => {
    const m = findMateriaByName("Sistemas Operativos");
    expect(m?.codigo).toBe("35-0900");
    expect(m?.anio).toBe(3);
  });

  it("encuentra ignorando tildes y mayúsculas", () => {
    expect(findMateriaByName("algebra lineal ii")?.codigo).toBe("25-0560");
    expect(findMateriaByName("ANÁLISIS MATEMÁTICO III")?.codigo).toBe("25-1020");
  });

  it("encuentra por código formal", () => {
    expect(findMateriaByName("35-1050")?.nombre).toBe("Introducción a la Informática");
    expect(findMateriaByName("35 1050")?.nombre).toBe("Introducción a la Informática");
  });

  it("encuentra por abreviatura", () => {
    expect(findMateriaByName("EDA")?.nombre).toBe("Estructura de Datos y Algoritmos");
    expect(findMateriaByName("BD1")?.codigo).toBe("35-1170");
  });

  it("encuentra por aliases comunes de usuarios", () => {
    expect(findMateriaByName("intro info")?.codigo).toBe("35-1050");
    expect(findMateriaByName("bases de datos 2")?.codigo).toBe("35-1180");
    expect(findMateriaByName("calc avan")?.codigo).toBe("25-0881");
    expect(findMateriaByName("io 1")?.codigo).toBe("47-0210");
    expect(findMateriaByName("ing de software")?.codigo).toBe("35-0930");
    expect(findMateriaByName("proy inf ii")?.codigo).toBe("50-1490");
  });

  it("distingue Sistemas Operativos (3° año) de Introducción a los Sistemas Operativos (2° año)", () => {
    expect(findMateriaByName("sistemas operativos")?.codigo).toBe("35-0900");
    expect(findMateriaByName("introduccion a los sistemas operativos")?.codigo).toBe(
      "35-1740",
    );
    expect(findMateriaByName("iso")?.codigo).toBe("35-1740");
  });
});

describe("findMateriaByName - tolerancia a errores", () => {
  it("acepta typos leves", () => {
    expect(findMateriaByName("Algebra Lineall I")?.codigo).toBe("25-0550");
    expect(findMateriaByName("Fisiica II")?.codigo).toBe("40-0180");
  });

  it("retorna null para entradas vacías o irreconocibles", () => {
    expect(findMateriaByName("")).toBeNull();
    expect(findMateriaByName(null)).toBeNull();
    expect(findMateriaByName("materia que no existe zzzz")).toBeNull();
  });
});

describe("semestreLabel", () => {
  it("mapea correctamente cada valor", () => {
    expect(semestreLabel(0)).toBe("Anual");
    expect(semestreLabel(1)).toBe("1° Semestre");
    expect(semestreLabel(2)).toBe("2° Semestre");
    expect(semestreLabel(1, "Anual")).toBe("Anual");
  });
});

describe("autoInfoFromName", () => {
  it("devuelve info completa lista para llenar el formulario", () => {
    const info = autoInfoFromName("Sistemas Operativos");
    expect(info).toMatchObject({
      codigo: "35-0900",
      nombreOficial: "Sistemas Operativos",
      anio: 3,
      semestre: 0,
      semestreLabel: "Anual",
      cuatrimestre: null,
    });
    expect(info?.correlativas).toContain("Reg:");
    expect(info?.correlativas).toContain("Aprob:");
  });

  it("indica cuatrimestre solo cuando no es anual", () => {
    const info = autoInfoFromName("Bases de Datos I");
    expect(info?.anio).toBe(3);
    expect(info?.cuatrimestre).toBe(1);
  });
});

describe("formatCorrelativas", () => {
  it("lista abreviaturas de correlativas", () => {
    const sistOp = planEstudio.materias.find((m) => m.codigo === "35-0900")!;
    const texto = formatCorrelativas(sistOp);
    expect(texto).toMatch(/EDA/);
    expect(texto).toMatch(/ARQ/);
    expect(texto).toMatch(/ISO/);
    expect(texto).toMatch(/II/);
  });

  it("materias sin correlativas devuelven cadena vacía", () => {
    const filo = planEstudio.materias.find((m) => m.codigo === "05-0000")!;
    expect(formatCorrelativas(filo)).toBe("");
  });
});

describe("integridad del plan", () => {
  it("todos los códigos referenciados en correlativas existen", () => {
    const codigos = new Set(planEstudio.materias.map((m) => m.codigo));
    for (const m of planEstudio.materias) {
      for (const c of m.correlativasCursar.regularizadas) {
        expect(codigos.has(c), `regularizada ${c} en ${m.codigo}`).toBe(true);
      }
      for (const c of m.correlativasCursar.aprobadas) {
        expect(codigos.has(c), `aprobada ${c} en ${m.codigo}`).toBe(true);
      }
      for (const c of m.correlativasRendir) {
        expect(codigos.has(c), `rendir ${c} en ${m.codigo}`).toBe(true);
      }
    }
  });

  it("no hay códigos duplicados", () => {
    const codigos = planEstudio.materias.map((m) => m.codigo);
    expect(new Set(codigos).size).toBe(codigos.length);
  });
});
