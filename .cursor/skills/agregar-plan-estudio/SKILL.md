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
4. **Login:** agregar ícono+color en `src/components/carrera-icons.tsx` (`CARRERA_VISUALS[{slug}]`); sincronizar `CARRERA_ICONS` en `onboarding-carrera.tsx`
5. **Login (6+ carreras):** sumar slot en `FLOAT_STYLES` de `floating-carreras.tsx`
6. Validar: `npx tsx scripts/validate-plan-estudio.ts src/data/planes/{slug}.json`
7. `npm run test && npm run build`
8. Verificar `/login` (desktop) y onboarding

Plantilla: `.cursor/agents/plan-estudio-plantilla.json`  
Referencia: `src/data/correlatividades.json`  
Íconos login: `src/components/carrera-icons.tsx`
