# UcaNode

Sistema de autogestión para estudiantes de la Ucasal.

UcaNode toma como referencia un dashboard personal de Notion, pero funciona como una aplicación web independiente con PostgreSQL (Neon en producción). Permite organizar materias, entregas, horarios, links útiles y datos del perfil académico desde una interfaz hecha con Next.js.

Producción: [https://ucanode.app](https://ucanode.app)

## Funcionalidades

- Registro y login con verificación de email (Resend, dominio `mail.ucanode.app`).
- Onboarding inicial: selección de carrera y carga lazy del plan de estudios desde JSON.
- Dashboard con próximas entregas, clases del día, materias en curso y links favoritos.
- Gestión de materias en catálogo de tarjetas (año/semestre, estados y correlatividades).
- Calendario/listado de entregas por materia, tipo, fecha, prioridad y estado.
- Grilla semanal de horarios (materias en cursada / para finalizar).
- Concurrencia del campus en tiempo casi real vía CampuStatus.
- Administración de links externos frecuentes.
- Perfil del estudiante.
- Tema claro/oscuro y sidebar colapsable.

## Stack

| Capa | Tecnología |
|---|---|
| Framework | Next.js 16 App Router |
| UI | React 19 + Tailwind CSS 4 |
| ORM | Prisma 7 |
| Base de datos | PostgreSQL (Neon en producción) |
| Validación | Zod |
| Email | Resend (`mail.ucanode.app`) |
| Tests | Vitest |

## Instalación rápida

Requisitos:

- Node.js 20.9 o superior.
- npm.
- PostgreSQL (Neon recomendado; ver [Deploy](wiki/Deploy.md)).

El proyecto incluye `.nvmrc` con Node 22:

```bash
nvm use
cp .env.example .env   # DATABASE_URL, Resend (RESEND_API_KEY, EMAIL_FROM) y APP_URL
npm install
npx prisma generate
npm run db:migrate
npm run db:seed
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000).

## Scripts principales

| Comando | Descripción |
|---|---|
| `npm run dev` | Levanta el servidor de desarrollo |
| `npm run build` | Genera Prisma Client, aplica migraciones y compila producción |
| `npm run start` | Inicia el servidor de producción |
| `npm run lint` | Ejecuta ESLint |
| `npm run test` | Ejecuta tests con Vitest |
| `npm run validate:plan` | Valida un JSON de plan de estudio |
| `npm run db:migrate` | Crea/aplica migraciones de desarrollo |
| `npm run db:deploy` | Aplica migraciones en producción (también en build de Vercel) |
| `npm run db:seed` | Carga datos de ejemplo (solo desarrollo) |
| `npm run db:reset` | Reinicia migraciones y seed (solo desarrollo) |

## Documentación

La documentación técnica vive en la wiki del repo:

- [Inicio de la wiki](wiki/Home.md)
- [Arquitectura](wiki/Arquitectura.md)
- [Modelo de datos](wiki/Modelo-de-datos.md)
- [Rutas y flujos](wiki/Rutas-y-flujos.md)
- [Guía de desarrollo](wiki/Desarrollo.md)
- [Deploy en Vercel + Neon](wiki/Deploy.md)
- [Estructura del proyecto](wiki/Estructura-del-proyecto.md)

## Relación con Notion

Notion fue la referencia de diseño inicial. Los datos de UcaNode viven en PostgreSQL y no se sincronizan con Notion.

## Licencia

UcaNode se distribuye bajo la [Licencia MIT](LICENSE). Copyright (c) 2026 lautioliver.
