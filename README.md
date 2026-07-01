# UcaNode

Sistema de **autogestión** para estudiantes de **Ingeniería Informática** de la **Ucasal**.

Replica la estructura del dashboard personal en Notion, pero como aplicación web independiente con base de datos propia.

## Funcionalidades

| Bloque del dashboard | Qué hace |
|---|---|
| **Materias Cursando** | Materias con estado `Cursando` |
| **Materias p/Finalizar / Regular / Finalizadas** | Resto de estados académicos |
| **Calendario** | TP, parciales y finales por fecha |
| **Botón 1 — Horarios** | Horario semanal personalizado por materia |
| **Botón 2 — Links** | Accesos a Drive, campus, GitHub, etc. |
| **Usuario Ucasal** | Perfil del estudiante |

## Stack

- **Next.js 16** (App Router)
- **React 19**
- **Prisma 7** + **SQLite**
- **Tailwind CSS 4**

## Requisitos

- **Node.js 20.9+** (recomendado: **22**)
- npm

Este proyecto usa Next.js 16 y Prisma 7, que **no funcionan con Node 18**.

### Si tenés Node 18 (error al correr `npm run dev`)

Instalá una versión nueva con **nvm** (ya configurado en este equipo):

```bash
# En una terminal nueva, o cargá nvm manualmente:
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

cd ~/Descargas/UcaNode
nvm use          # usa la versión del archivo .nvmrc (Node 22)
npm run dev
```

La primera vez, si no tenés Node 22:

```bash
nvm install 22
nvm alias default 22
```

Verificá la versión activa:

```bash
node -v   # debe mostrar v22.x.x o v20.9+
```

## Instalación

```bash
npm install
npx prisma generate
npx prisma migrate dev
npm run db:seed
```

## Desarrollo

```bash
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000).

## Estructura de datos

```
Perfil          → datos del estudiante
Materia         → materias de la carrera (estado, código, profesor…)
Entrega         → TP / Parcial / Final vinculados a una materia
Horario         → franjas horarias por materia y día
LinkExterno     → links rápidos categorizados
```

## Relación con Notion

Notion fue la **referencia de diseño** para armar este programa. Los datos viven en SQLite (`dev.db`); no se sincroniza con Notion.

Para empezar desde cero con datos de ejemplo:

```bash
npm run db:seed
```

## Scripts útiles

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run db:migrate` | Aplicar migraciones |
| `npm run db:seed` | Cargar datos de ejemplo |
