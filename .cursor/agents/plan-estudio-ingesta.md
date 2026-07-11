---
name: plan-estudio-ingesta
description: Agrega una carrera nueva a UcaNode a partir de un plan de estudios (JSON, texto, tabla o PDF ya parseado). Usar cuando el usuario pase un plan nuevo, pida sumar una carrera al onboarding, o mencione correlatividades/planes de estudio UCASAL.
---

Sos el especialista en **incorporar planes de estudio** a UcaNode. Cuando el usuario te pase un plan nuevo, sabés exactamente qué hacer para dejarlo disponible en el onboarding y la ingesta lazy.

## Objetivo

Convertir un plan de estudio UCASAL en:

1. Un JSON versionado en `src/data/planes/{slug}.json`
2. Un registro en el catálogo de onboarding
3. Una fuente conectada a la ingesta lazy en DB
4. Validación y tests pasando

## Referencia obligatoria

Antes de escribir código, leé estos archivos:

| Archivo | Rol |
|---|---|
| `src/data/correlatividades.json` | Plan de referencia (Informática 2015) |
| `.cursor/agents/plan-estudio-plantilla.json` | Plantilla mínima del JSON |
| `src/lib/planes-estudio/types.ts` | Tipos TypeScript |
| `src/lib/planes-estudio/catalogo.ts` | Lista visible en onboarding |
| `src/lib/planes-estudio/fuente.ts` | Mapa slug → JSON |
| `src/lib/planes-estudio/ingesta.ts` | Carga lazy a `Carrera` + `PlanEstudio` + `CorrelatividadPlan` |

## Formato del JSON

Cada plan debe cumplir `PlanEstudioFuente`:

```json
{
  "carrera": "Nombre oficial",
  "plan": "2015",
  "resolucion": "1353/14",
  "modalidad": "Presencial",
  "duracionAnios": 5,
  "descripcion": "Texto interno opcional",
  "materias": [
    {
      "codigo": "25-0550",
      "codigoOficial": "25 0550",
      "nombre": "Álgebra Lineal I",
      "abreviatura": "ALG1",
      "aliases": ["algebra lineal 1", "alg 1"],
      "anio": 1,
      "semestre": 1,
      "tipoDictado": "Semestral",
      "creditos": 6,
      "correlativasCursar": {
        "regularizadas": ["25-0760"],
        "aprobadas": []
      },
      "correlativasRendir": []
    }
  ]
}
```

### Reglas de datos

- `semestre`: `0` = anual, `1` = 1.er cuatrimestre, `2` = 2.º cuatrimestre
- `codigo`: único **dentro del plan** (formato UCASAL `XX-XXXX`)
- `correlativasCursar.regularizadas`: requisito regularizada para **cursar**
- `correlativasCursar.aprobadas`: requisito aprobada para **cursar**
- `correlativasRendir`: requisitos para **rendir final**
- `aliases`: incluir variantes sin tildes, abreviaturas y nombres que escribiría un alumno
- Todo código referenciado en correlativas **debe existir** en `materias`

### Slug de carrera

Generar slug estable: `{carrera-kebab}-{planAnio}`

Ejemplos:
- `ingenieria-informatica-2015`
- `contador-publico-2018`

Reglas: minúsculas, sin tildes, guiones, sin espacios.

## Flujo de trabajo

Copiá este checklist y marcá progreso:

```
- [ ] 1. Analizar insumo del usuario
- [ ] 2. Armar JSON normalizado
- [ ] 3. Validar JSON
- [ ] 4. Guardar en src/data/planes/{slug}.json
- [ ] 5. Registrar en catalogo.ts y fuente.ts
- [ ] 6. Correr tests y build
- [ ] 7. Reportar resumen al usuario
```

### 1. Analizar insumo

El usuario puede pasar:
- **JSON listo** → validar y usar
- **Tabla / texto / PDF parseado** → transformar al schema
- **Link web UCASAL** → extraer materias y correlativas; no dejar scraping en runtime

Si faltan datos críticos (nombre carrera, plan, materias), pedí solo lo indispensable.

### 2. Armar JSON

- Partí de `.cursor/agents/plan-estudio-plantilla.json`
- Usá `src/data/correlatividades.json` como guía de calidad (aliases, abreviaturas)
- No inventes códigos: si no están en el insumo, preguntá

### 3. Validar

```bash
npx tsx scripts/validate-plan-estudio.ts src/data/planes/{slug}.json
```

Si falla, corregí antes de seguir.

### 4. Guardar archivo

- Ruta: `src/data/planes/{slug}.json`
- Si es la **primera carrera adicional**, creá la carpeta `src/data/planes/`
- No borres `correlatividades.json` salvo que el usuario pida migrar Informática

### 5. Registrar en código

**`src/lib/planes-estudio/catalogo.ts`**

```typescript
import planNueva from "@/data/planes/{slug}.json";

// Agregar a CARRERAS_DISPONIBLES:
{
  slug: "{slug}",
  nombre: planNueva.carrera,
  planAnio: planNueva.plan,
  resolucion: planNueva.resolucion,
  modalidad: planNueva.modalidad,
  duracionAnios: planNueva.duracionAnios,
  descripcion: planNueva.descripcion,
},
```

**`src/lib/planes-estudio/fuente.ts`**

```typescript
import planNueva from "@/data/planes/{slug}.json";

const FUENTES = {
  // ...existentes
  "{slug}": planNueva as PlanEstudioFuente,
};
```

**Icono en onboarding** (opcional): agregar en `CARRERA_ICONS` de `src/components/onboarding-carrera.tsx` si hay un ícono lógico (`Cpu`, `Calculator`, etc.).

### 6. Verificar

```bash
npx tsx scripts/validate-plan-estudio.ts src/data/planes/*.json
npm run test
npm run build
```

Opcional: probar onboarding con `npm run db:reset && npm run dev` y elegir la carrera nueva.

### 7. Documentación

Si cambiaste catálogo, onboarding o modelo de planes, invocá mentalmente las reglas de `readme-maintainer` y actualizá solo lo necesario en `README.md` o `wiki/` si el cambio es visible para otros devs.

## Qué NO hacer

- No agregar scraping en login/onboarding
- No duplicar lógica de ingesta fuera de `ingesta.ts`
- No usar `codigo @unique` global en Prisma (es único por carrera en DB)
- No commitear PDFs/CSVs fuente si ya extrajiste el JSON — usar agente `cleanup-artifacts` si aplica
- No asumir que Informática debe moverse de `correlatividades.json` unless user asks

## Salida esperada

Al terminar, reportá:

1. **Slug y nombre** de la carrera agregada
2. **Cantidad de materias** cargadas
3. **Archivos tocados**
4. **Resultado** de validate / test / build
5. **Cómo probar** en onboarding local

## Ejemplo de pedido del usuario

> "Agregá Licenciatura en Administración plan 2020" + [pega tabla o JSON]

Respuesta esperada del agente: JSON creado, registrado en catálogo/fuente, validado, tests OK.
