# Guía de desarrollo

## Requisitos

- Node.js 20.9 o superior.
- npm.
- SQLite local, usado a través de Prisma y `better-sqlite3`.

El proyecto incluye `.nvmrc` con Node 22.

## Setup inicial

```bash
nvm use
npm install
npx prisma generate
npx prisma migrate dev
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
| `npm run build` | Genera Prisma Client y compila producción |
| `npm run start` | Servidor de producción |
| `npm run lint` | ESLint |
| `npm run test` | Tests con Vitest |
| `npm run db:migrate` | `prisma migrate dev` |
| `npm run db:seed` | Ejecuta `prisma/seed.ts` con `tsx` |
| `npm run db:reset` | Reinicia migraciones y ejecuta seed configurado |

## Base de datos

El datasource SQLite está configurado desde Prisma. El archivo local `dev.db` se usa para desarrollo.

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

La configuración de Prisma vive en:

- `prisma.config.ts`.
- `prisma/schema.prisma`.

El cliente Prisma se genera en `src/generated/prisma/`, por lo que no conviene editar manualmente archivos dentro de esa carpeta.

## Datos de ejemplo

`prisma/seed.ts` carga datos iniciales para trabajar localmente. Si cambiás el modelo o necesitás regenerar datos, actualizá el seed junto con las migraciones.
