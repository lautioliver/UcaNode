---
name: agregar-plan-estudio
description: Agrega carreras y planes de estudio UCASAL a UcaNode (JSON, catálogo, ingesta). Usar cuando el usuario pase un plan nuevo, pida sumar una carrera, correlatividades, o mencione el agente de planes de estudio.
---

# Agregar plan de estudio

Leé y seguí el agente del proyecto:

**`.cursor/agents/plan-estudio-ingesta.md`**

## Atajo

1. Normalizar insumo → JSON (`PlanEstudioFuente`)
2. Guardar en `src/data/planes/{slug}.json`
3. Registrar en `catalogo.ts` y `fuente.ts`
4. Validar: `npx tsx scripts/validate-plan-estudio.ts src/data/planes/{slug}.json`
5. `npm run test && npm run build`

Plantilla: `.cursor/agents/plan-estudio-plantilla.json`  
Referencia: `src/data/correlatividades.json`
