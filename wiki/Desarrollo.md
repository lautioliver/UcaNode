# Guía de desarrollo

## Requisitos

- Node.js 20.9 o superior.
- npm.
- PostgreSQL (Neon recomendado; ver [Deploy](Deploy.md)).

El proyecto incluye `.nvmrc` con Node 22.

## Setup inicial

```bash
nvm use
cp .env.example .env
npm install
npx prisma generate
npm run db:migrate
npm run db:seed
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000).

## Si todavía no tenés Node 22

```bash
nvm install 22
nvm alias default 22
nvm use
node -v
```

Next.js 16 y Prisma 7 requieren Node.js 20.9 o superior. Node 18 no alcanza para este stack.

## Scripts

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Genera Prisma Client, aplica migraciones y compila producción |
| `npm run start` | Servidor de producción |
| `npm run lint` | ESLint |
| `npm run test` | Tests con Vitest |
| `npm run validate:plan` | Valida estructura de un JSON de plan de estudios |
| `npm run db:migrate` | `prisma migrate dev` |
| `npm run db:deploy` | `prisma migrate deploy` (producción / build Vercel) |
| `npm run db:seed` | Ejecuta `prisma/seed.ts` con `tsx` (solo desarrollo) |
| `npm run db:reset` | Reinicia migraciones y ejecuta seed (solo desarrollo) |

## Base de datos

El datasource PostgreSQL se configura con `DATABASE_URL` en `.env` (ver `.env.example`).

Tareas habituales:

```bash
npx prisma generate
npm run db:migrate
npm run db:seed
```

Para volver a un estado limpio:

```bash
npm run db:reset
```

## Tests y calidad

```bash
npm run lint
npm run test
```

Los tests actuales cubren validaciones y lógica de correlatividades en `src/lib/__tests__/`.

## Variables y configuración

| Variable | Uso |
|---|---|
| `DATABASE_URL` | Connection string de PostgreSQL (Neon en producción) |
| `NEXT_PUBLIC_CARRERA_SOLICITUD_FORM_URL` | URL pública de un Google Form para solicitar carreras faltantes en onboarding |

La configuración de Prisma vive en:

- `prisma.config.ts`.
- `prisma/schema.prisma`.

El cliente Prisma se genera en `src/generated/prisma/`, por lo que no conviene editar manualmente archivos dentro de esa carpeta.

## Datos de ejemplo

`prisma/seed.ts` carga datos iniciales para trabajar localmente. El perfil se crea **sin** `carreraId` para que el onboarding aparezca en una instalación fresca. Si cambiás el modelo o necesitás regenerar datos, actualizá el seed junto con las migraciones.

## Planes de estudio

Para validar un JSON antes de sumarlo al catálogo:

```bash
npm run validate:plan -- src/data/correlatividades.json
```

Para incorporar una carrera nueva al onboarding, seguí el flujo del agente `.cursor/agents/plan-estudio-ingesta.md`.
