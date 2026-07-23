# Estructura del proyecto

## Árbol principal

```text
UcaNode/
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts
│   └── migrations/
├── scripts/
│   └── validate-plan-estudio.ts
├── public/
├── src/
│   ├── app/
│   ├── components/
│   ├── data/
│   ├── generated/prisma/
│   └── lib/
│       └── planes-estudio/
├── wiki/
├── .env.example
├── package.json
├── prisma.config.ts
├── vitest.config.ts
└── README.md
```

## `src/app/`

| Archivo/carpeta | Rol |
|---|---|
| `layout.tsx` | Layout raíz, gate de onboarding, fuentes, sidebar, top bar, búsqueda global y tema inicial |
| `page.tsx` | Redirect a `/dashboard` |
| `materias/page.tsx` | Catálogo de materias en tarjetas (año/semestre destacados) |
| `materias/[id]/page.tsx` | Detalle de materia |
| `entregas/page.tsx` | Gestión de entregas |
| `horarios/page.tsx` | Grilla semanal de horarios (solo materias activas) |
| `concurrencia/page.tsx` | Concurrencia del campus vía CampuStatus |
| `links/page.tsx` | Catálogo de links con filtros por categoría |
| `perfil/page.tsx` | Perfil y configuración (información, académico, seguridad, apariencia) |
| `login/page.tsx`, `registro/page.tsx` | Acceso y alta de cuenta |
| `verificar-email/page.tsx` | Pantalla post-registro y reenvío de verificación |
| `api/auth/` | Login, registro, verificación, logout y reenvío de mail |
| `loading.tsx` | Estado de carga global |
| `error.tsx` | Error boundary |
| `not-found.tsx` | Página 404 general |
| `robots.ts` | Metadata para robots |
| `sitemap.ts` | Sitemap |

## `src/components/`

| Archivo | Rol |
|---|---|
| `layout.tsx` | Componentes base de UI (headers, tarjetas, KPIs, badges, filtros) |
| `layout-client.tsx` | Shell autenticado: sidebar + top bar + footer |
| `sidebar.tsx` | Navegación lateral agrupada (Menú / General), colapso y menú móvil |
| `topbar.tsx` | Barra superior con búsqueda, tema y menú de usuario |
| `global-search.tsx` | Command palette de búsqueda global; consulta `lib/search.ts` con debounce |
| `perfil-settings.tsx` | Formularios de perfil por sección (info, seguridad, apariencia) |
| `ui/` | Primitivas shadcn/ui (Button, Input, Card, Dialog, Sheet, etc.) |
| `forms.tsx` | Formularios client con `useActionState` |
| `item-actions.tsx` | Acciones inline para editar y eliminar |
| `materia-card.tsx` | Tarjetas/listados de materias (dashboard) |
| `onboarding-carrera.tsx` | Pantalla de selección de carrera (onboarding inicial) |
| `materia-catalog.tsx` | Catálogo de tarjetas en `/materias` |
| `entrega-card.tsx` | Tarjetas de entregas |
| `calendario.tsx` | Vista de calendario/agrupación de entregas |
| `links-catalog.tsx` | Catálogo de tarjetas en `/links` |
| `campustatus-workspace.tsx` | Vista de concurrencia del campus |
| `auth-forms.tsx`, `auth-shell.tsx` | Formularios y layout de auth |
| `logo.tsx` | Marca visual del proyecto |

## `src/lib/`

| Archivo | Rol |
|---|---|
| `actions.ts` | Server Actions y revalidación de rutas |
| `app-url.ts` | URL pública del sitio (`https://ucanode.app`) y base para mails |
| `auth-service.ts`, `auth.ts` | Registro, login y gate de cuenta verificada |
| `email.ts`, `email-verification.ts` | Envío de mails con Resend y tokens de verificación |
| `campustatus/` | Cliente y utilidades de CampuStatus |
| `perfil.ts` | Obtiene o crea el perfil del estudiante |
| `planes-estudio/` | Catálogo, fuente JSON, ingesta lazy, consultas y tipos del plan |
| `schemas.ts` | Schemas Zod para validar formularios |
| `search.ts` | Server Action de búsqueda global (materias, entregas, links) |
| `prisma.ts` | Cliente Prisma singleton |
| `labels.ts` | Etiquetas legibles y clases asociadas a enums |
| `entrega-utils.ts` | Helpers para fechas/estado de entregas |
| `correlatividades.ts` | Búsqueda y formateo de materias del plan |
| `rate-limit.ts` | Rate limit simple para Server Actions |
| `__tests__/` | Tests de lógica de dominio |

## Datos y generación

| Ruta | Uso |
|---|---|
| `src/data/correlatividades.json` | Plan de estudio de referencia (Informática 2015) |
| `src/data/planes/` | JSONs de planes adicionales (nuevas carreras) |
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
| `.cursor/agents/plan-estudio-ingesta.md` | Flujo para agregar carreras y planes de estudio |
