# UcaNode

Sistema de autogestión para estudiantes de Ingeniería Informática de la Ucasal.

UcaNode toma como referencia un dashboard personal de Notion, pero funciona como una aplicación web independiente con base de datos local en SQLite. Permite organizar materias, entregas, horarios, links útiles y datos del perfil académico desde una interfaz hecha con Next.js.

## Funcionalidades

- Dashboard con próximas entregas, clases del día, materias en curso y links favoritos.
- Gestión de materias con estados académicos, datos de cursada y correlatividades.
- Calendario/listado de entregas por materia, tipo, fecha, prioridad y estado.
- Grilla semanal de horarios.
- Administración de links externos frecuentes.
- Perfil del estudiante.
- Tema claro/oscuro y sidebar colapsable.

## Stack

| Capa | Tecnología |
|---|---|
| Framework | Next.js 16 App Router |
| UI | React 19 + Tailwind CSS 4 |
| ORM | Prisma 7 |
| Base de datos | SQLite |
| Validación | Zod |
| Tests | Vitest |

## Instalación rápida

Requisitos:

- Node.js 20.9 o superior.
- npm.

El proyecto incluye `.nvmrc` con Node 22:

```bash
nvm use
npm install
npx prisma generate
npx prisma migrate dev
npm run db:seed
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000).

## Scripts principales

| Comando | Descripción |
|---|---|
| `npm run dev` | Levanta el servidor de desarrollo |
| `npm run build` | Genera Prisma Client y compila producción |
| `npm run start` | Inicia el servidor de producción |
| `npm run lint` | Ejecuta ESLint |
| `npm run test` | Ejecuta tests con Vitest |
| `npm run db:migrate` | Crea/aplica migraciones de desarrollo |
| `npm run db:seed` | Carga datos de ejemplo |
| `npm run db:reset` | Reinicia migraciones y seed |

## Documentación

La documentación técnica vive en la wiki del repo:

- [Inicio de la wiki](wiki/Home.md)
- [Arquitectura](wiki/Arquitectura.md)
- [Modelo de datos](wiki/Modelo-de-datos.md)
- [Rutas y flujos](wiki/Rutas-y-flujos.md)
- [Guía de desarrollo](wiki/Desarrollo.md)
- [Estructura del proyecto](wiki/Estructura-del-proyecto.md)

## Relación con Notion

Notion fue la referencia de diseño inicial. Los datos de UcaNode viven en SQLite y no se sincronizan con Notion.
