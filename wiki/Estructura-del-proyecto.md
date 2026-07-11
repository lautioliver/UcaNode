# Estructura del proyecto

## Árbol principal

```text
UcaNode/
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts
│   └── migrations/
├── public/
├── src/
│   ├── app/
│   ├── components/
│   ├── data/
│   ├── generated/prisma/
│   └── lib/
├── wiki/
├── dev.db
├── package.json
├── prisma.config.ts
├── vitest.config.ts
└── README.md
```

## `src/app/`

| Archivo/carpeta | Rol |
|---|---|
| `layout.tsx` | Layout raíz, fuentes, sidebar, tema inicial y perfil |
| `page.tsx` | Dashboard principal |
| `materias/page.tsx` | Catálogo de materias en tarjetas (año/semestre destacados) |
| `materias/[id]/page.tsx` | Detalle de materia |
| `entregas/page.tsx` | Gestión de entregas |
| `horarios/page.tsx` | Grilla semanal de horarios (solo materias activas) |
| `links/page.tsx` | Catálogo de links con filtros por categoría |
| `perfil/page.tsx` | Datos del estudiante |
| `loading.tsx` | Estado de carga global |
| `error.tsx` | Error boundary |
| `not-found.tsx` | Página 404 general |
| `robots.ts` | Metadata para robots |
| `sitemap.ts` | Sitemap |

## `src/components/`

| Archivo | Rol |
|---|---|
| `layout.tsx` | Componentes base de UI como headers, tarjetas, botones y estados vacíos |
| `sidebar.tsx` | Navegación lateral, tema, colapso y menú móvil |
| `forms.tsx` | Formularios client con `useActionState` |
| `item-actions.tsx` | Acciones inline para editar y eliminar |
| `materia-card.tsx` | Tarjetas/listados de materias (dashboard) |
| `materia-catalog.tsx` | Catálogo de tarjetas en `/materias` |
| `entrega-card.tsx` | Tarjetas de entregas |
| `calendario.tsx` | Vista de calendario/agrupación de entregas |
| `links-catalog.tsx` | Catálogo de tarjetas en `/links` |
| `logo.tsx` | Marca visual del proyecto |

## `src/lib/`

| Archivo | Rol |
|---|---|
| `actions.ts` | Server Actions y revalidación de rutas |
| `schemas.ts` | Schemas Zod para validar formularios |
| `prisma.ts` | Cliente Prisma singleton |
| `labels.ts` | Etiquetas legibles y clases asociadas a enums |
| `entrega-utils.ts` | Helpers para fechas/estado de entregas |
| `correlatividades.ts` | Búsqueda y formateo de materias del plan |
| `rate-limit.ts` | Rate limit simple para Server Actions |
| `__tests__/` | Tests de lógica de dominio |

## Datos y generación

| Ruta | Uso |
|---|---|
| `src/data/correlatividades.json` | Plan de estudio y correlatividades |
| `src/generated/prisma/` | Cliente Prisma generado |
| `prisma/schema.prisma` | Modelo de datos |
| `prisma/seed.ts` | Datos de ejemplo |
| `prisma/migrations/` | Migraciones SQL |

## Documentación

| Ruta | Uso |
|---|---|
| `README.md` | Introducción rápida, setup y enlaces |
| `wiki/` | Documentación técnica y funcional detallada |
| `AGENTS.md` | Reglas para agentes de IA en este repo |
