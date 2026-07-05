# UcaNode

Sistema de **autogestión** para estudiantes de **Ingeniería Informática** de la **Ucasal**.

Replica la estructura del dashboard personal en Notion, pero como aplicación web independiente con base de datos propia (SQLite).

---

## Tabla de contenidos

- [Funcionalidades](#funcionalidades)
- [Stack tecnológico](#stack-tecnológico)
- [Arquitectura general](#arquitectura-general)
- [Diagrama de archivos](#diagrama-de-archivos)
- [Modelo de datos](#modelo-de-datos)
- [Flujo de lectura y escritura](#flujo-de-lectura-y-escritura)
- [Rutas de la aplicación](#rutas-de-la-aplicación)
- [Instalación y desarrollo](#instalación-y-desarrollo)
- [Scripts útiles](#scripts-útiles)

---

## Funcionalidades

| Bloque del dashboard | Qué hace |
|---|---|
| **Materias Cursando** | Materias con estado `CURSANDO` |
| **Materias p/Finalizar / Regular / Finalizadas** | Resto de estados académicos |
| **Calendario** | TP, parciales y finales agrupados por fecha |
| **Botón 1 — Horarios** | Horario semanal personalizado por materia |
| **Botón 2 — Links** | Accesos a Drive, campus, GitHub, etc. |
| **Usuario Ucasal** | Perfil del estudiante |

---

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | React 19 + Tailwind CSS 4 |
| ORM | Prisma 7 |
| Base de datos | SQLite (`dev.db`) |
| Validación | Zod |
| Fechas | date-fns |
| Iconos | lucide-react |

---

## Arquitectura general

UcaNode sigue el patrón **Server Components + Server Actions** de Next.js, con validación en servidor y feedback en cliente:

1. Las **páginas** (`src/app/**/page.tsx`) son Server Components: leen datos directamente con Prisma en el servidor. Cada ruta tiene su propio `loading.tsx` (spinner) y `error.tsx` (boundary con reintento).
2. Los **formularios** son componentes Client (`src/components/forms.tsx`) que usan `useActionState`: muestran pending state, errores de validación inline y mensajes de éxito/error.
3. Cada formulario invoca una **Server Action** (`src/lib/actions.ts`). Antes de tocar la DB, valida con **Zod** (`src/lib/schemas.ts`). Si falla la validación, devuelve errores por campo. Si hay un error inesperado, captura con try/catch y responde con mensaje amigable.
4. Las acciones usan **revalidación granular**: solo invalidan las rutas que realmente cambiaron (ej: `createEntrega` revalida `/`, `/entregas` y `/materias/[id]`).
5. Los **componentes** (`src/components/`) solo reciben props ya resueltas; no acceden a la base de datos.
6. **`src/lib/labels.ts`** centraliza las etiquetas y colores de los enums de Prisma.
7. **`prisma/schema.prisma`** define el modelo; el cliente generado vive en `src/generated/prisma/`.

```mermaid
flowchart TB
    subgraph Browser["Navegador"]
        UI["Páginas<br/>Server Components"]
        FormsUI["Formularios Client<br/>useActionState"]
        Loading["loading.tsx / error.tsx"]
    end

    subgraph NextServer["Servidor Next.js"]
        Pages["src/app/**/page.tsx"]
        Actions["Server Actions<br/>src/lib/actions.ts"]
        Schemas["Validación Zod<br/>src/lib/schemas.ts"]
        PrismaLib["Cliente Prisma<br/>src/lib/prisma.ts"]
    end

    subgraph Data["Persistencia"]
        SchemaDef["schema.prisma"]
        DB[("dev.db<br/>SQLite")]
        Seed["prisma/seed.ts"]
    end

    UI --> Pages
    FormsUI -->|"useActionState<br/>action={createX}"| Actions
    Actions -->|"parsed.safeParse()"| Schemas
    Schemas -->|"ok / fail"| Actions
    Actions -->|"prisma.*"| PrismaLib
    Pages -->|"prisma.*"| PrismaLib
    PrismaLib --> DB
    SchemaDef --> PrismaLib
    Seed --> DB
    Loading --> UI & FormsUI
```

---

## Diagrama de archivos

Relación entre carpetas y módulos del proyecto:

```mermaid
flowchart LR
    subgraph AppRouter["src/app/ (rutas)"]
        Layout["layout.tsx<br/>Nav global"]
        Home["page.tsx<br/>Dashboard /"]
        Materias["materias/page.tsx"]
        MateriaId["materias/[id]/page.tsx"]
        Entregas["entregas/page.tsx"]
        Horarios["horarios/page.tsx"]
        Links["links/page.tsx"]
        Perfil["perfil/page.tsx"]
        Loading["loading.tsx<br/>Spinner global"]
        Error["error.tsx<br/>Error boundary"]
        NotFound["materias/[id]/not-found.tsx<br/>404 materia"]
    end

    subgraph Components["src/components/"]
        LayoutComp["layout.tsx<br/>AppHeader, SectionCard…"]
        MateriaCard["materia-card.tsx<br/>MateriaList, MateriaCard"]
        Calendario["calendario.tsx<br/>CalendarioMes, EntregaRow"]
        Forms["forms.tsx<br/>Formularios Client<br/>useActionState"]
        ItemActions["item-actions.tsx<br/>Editar / Eliminar"]
    end

    subgraph Lib["src/lib/"]
        Prisma["prisma.ts"]
        Actions["actions.ts<br/>Server Actions"]
        Labels["labels.ts"]
        Schemas["schemas.ts<br/>Zod schemas"]
    end

    subgraph PrismaLayer["prisma/"]
        Schema["schema.prisma"]
        Migration["migrations/"]
        SeedFile["seed.ts"]
    end

    Generated["src/generated/prisma/<br/>(cliente auto-generado)"]

    Layout --> Home & Materias & Entregas & Horarios & Links & Perfil
    Home --> LayoutComp & MateriaCard & Calendario
    Materias --> MateriaCard
    MateriaId --> Calendario & NotFound

    Entregas & Horarios & Links & Perfil --> Forms
    Materias --> Forms

    Forms --> Actions
    Actions --> Schemas
    Forms --> ItemActions
    ItemActions --> Actions

    Home & Materias & MateriaId & Entregas & Horarios & Links & Perfil --> Prisma
    Actions --> Prisma
    Prisma --> Generated
    Labels --> Generated
    MateriaCard & Calendario --> Labels
    Schema --> Generated
    SeedFile --> Generated
```

### Responsabilidad de cada archivo

| Archivo | Rol |
|---|---|
| `src/app/layout.tsx` | Layout raíz: fuentes, nav principal, estilos globales |
| `src/app/page.tsx` | Dashboard: materias por estado + calendario de entregas |
| `src/app/materias/page.tsx` | CRUD de materias (alta) + listado completo |
| `src/app/materias/[id]/page.tsx` | Detalle de una materia: entregas y horarios asociados |
| `src/app/entregas/page.tsx` | Alta de entregas + calendario + lista |
| `src/app/horarios/page.tsx` | Alta de horarios + grilla semanal por día |
| `src/app/links/page.tsx` | Alta y tarjetas de links externos |
| `src/app/perfil/page.tsx` | Formulario de perfil del estudiante |
| `src/app/loading.tsx` | Spinner de carga global |
| `src/app/error.tsx` | Error boundary con botón de reintento |
| `src/app/materias/[id]/not-found.tsx` | Página 404 para materia inexistente |
| `src/lib/actions.ts` | Server Actions: `createMateria`, `createEntrega`, `createHorario`, `createLink`, `updatePerfil`. Validan con Zod, devuelven `ActionResult`, revalidan granularmente. |
| `src/lib/schemas.ts` | Schemas Zod para cada entidad: validación de tipos, requeridos, rangos, formato URL/email |
| `src/lib/prisma.ts` | Singleton del cliente Prisma con adapter SQLite |
| `src/lib/labels.ts` | Mapas de enums → texto legible y clases CSS |
| `src/components/layout.tsx` | UI reutilizable: header del dashboard, tarjetas, estados vacíos |
| `src/components/materia-card.tsx` | Tarjetas clicables que llevan al detalle de materia |
| `src/components/calendario.tsx` | Vista de entregas agrupadas por fecha |
| `src/components/forms.tsx` | Formularios Client con `useActionState`: pending state, errores inline, feedback de éxito/error |
| `src/components/item-actions.tsx` | Botones de editar/eliminar inline con confirmación |
| `prisma/schema.prisma` | Definición de modelos y enums |
| `prisma/seed.ts` | Datos de ejemplo para desarrollo |

---

## Modelo de datos

Entidades y relaciones definidas en `prisma/schema.prisma`:

```mermaid
erDiagram
    Perfil {
        String id PK
        String nombre
        String emailUcasal UK
        String carrera
        Int anioIngreso
        String legajo
    }

    Materia {
        String id PK
        String nombre
        String codigo
        EstadoMateria estado
        Int cuatrimestre
        Int anio
        String profesor
        String correlativas
        String notas
        Boolean promocional
        String semestre
    }

    Entrega {
        String id PK
        String titulo
        TipoEntrega tipo
        DateTime fecha
        EstadoEntrega estado
        String recurso
        String prioridad
        String materiaId FK
    }

    Horario {
        String id PK
        DiaSemana dia
        String horaInicio
        String horaFin
        Modalidad modalidad
        String aulaLink
        String materiaId FK
    }

    LinkExterno {
        String id PK
        String nombre
        String url
        CategoriaLink categoria
        Boolean favorito
    }

    Materia ||--o{ Entrega : "tiene"
    Materia ||--o{ Horario : "tiene"
```

**Enums principales:**

- `EstadoMateria`: `CURSANDO`, `PARA_FINALIZAR`, `REGULAR`, `FINALIZADA`
- `TipoEntrega`: `TP`, `PARCIAL`, `FINAL`
- `EstadoEntrega`: `PENDIENTE`, `EN_CURSO`, `ENTREGADO`
- `DiaSemana`: `LUNES` … `VIERNES`
- `Modalidad`: `PRESENCIAL`, `VIRTUAL`
- `CategoriaLink`: `GOOGLE_DRIVE`, `PLATAFORMA_UCASAL`, `GITHUB`, `OTRO`

---

## Flujo de lectura y escritura

### Lectura (GET — Server Component)

```mermaid
sequenceDiagram
    participant U as Usuario
    participant P as page.tsx
    participant Pr as prisma.ts
    participant DB as SQLite

    U->>P: Visita /materias
    P->>Pr: prisma.materia.findMany()
    Pr->>DB: SELECT *
    DB-->>Pr: filas
    Pr-->>P: Materia[]
    P->>P: Renderiza MateriaList
    P-->>U: HTML con datos
```

### Escritura (POST — Server Action con validación)

```mermaid
sequenceDiagram
    participant U as Usuario
    participant F as Formulario Client
    participant A as actions.ts
    participant S as schemas.ts
    participant Pr as prisma.ts
    participant DB as SQLite
    participant C as Caché Next.js

    U->>F: Completa y envía formulario
    F->>F: useActionState → pending=true
    F->>A: createMateria(prevState, formData)
    A->>S: materiaSchema.safeParse(data)
    alt Datos inválidos
        S-->>A: { success: false, errors }
        A-->>F: { success: false, message, errors }
        F->>F: Muestra errores inline
        F-->>U: Feedback visual
    else Datos válidos
        S-->>A: parsed.data
        A->>Pr: prisma.materia.create(parsed.data)
        alt Error DB
            Pr-->>A: throw
            A->>A: console.error + catch
            A-->>F: { success: false, message }
            F->>F: pending=false
            F-->>U: Mensaje de error
        else Éxito
            Pr->>DB: INSERT
            DB-->>Pr: OK
            A->>C: revalidatePath("/materias")
            A->>C: revalidatePath("/")
            A-->>F: { success: true, message }
            F->>F: pending=false
            F-->>U: "Materia creada"
        end
    end
```

Cada acción valida los datos con Zod antes de escribir. En caso de éxito, revalida solo las rutas afectadas y devuelve un mensaje. Los errores de validación se muestran por campo en el formulario.

---

## Rutas de la aplicación

```mermaid
flowchart TD
    Root["/  Dashboard"]
    Mat["/materias  Listado + alta"]
    MatId["/materias/[id]  Detalle"]
    Ent["/entregas  Calendario + alta"]
    Hor["/horarios  Grilla semanal"]
    Lnk["/links  Links externos"]
    Per["/perfil  Datos del estudiante"]
    Err["error.tsx  Error boundary"]
    Ld["loading.tsx  Spinner"]

    Root -->|"Ver todas"| Mat
    Root -->|"+ Entregas"| Ent
    Root -->|"Botón 1"| Hor
    Root -->|"Botón 2"| Lnk
    Root -->|"Usuario Ucasal"| Per
    Mat -->|"click en tarjeta"| MatId
    MatId -->|"← Volver"| Mat

    Root & Mat & MatId & Ent & Hor & Lnk & Per -.->|"error"| Err
    Root & Mat & MatId & Ent & Hor & Lnk & Per -.->|"carga"| Ld
```

| Ruta | Consultas Prisma | Acciones disponibles |
|---|---|---|
| `/` | `perfil`, `materia` (por estado), `entrega` + materia | — |
| `/materias` | `materia.findMany` | `createMateria` |
| `/materias/[id]` | `materia.findUnique` + entregas + horarios | — |
| `/entregas` | `entrega` + materia, `materia.findMany` | `createEntrega` |
| `/horarios` | `horario` + materia, `materia`, `perfil` | `createHorario` |
| `/links` | `linkExterno`, `perfil` | `createLink` |
| `/perfil` | `perfil.findFirst` | `updatePerfil` |

---

## Instalación y desarrollo

### Requisitos

- **Node.js 20.9+** (recomendado: **22**)
- npm

Este proyecto usa Next.js 16 y Prisma 7, que **no funcionan con Node 18**.

### Si tenés Node 18

```bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

cd ~/Descargas/UcaNode
nvm use          # usa la versión del archivo .nvmrc (Node 22)
npm run dev
```

La primera vez:

```bash
nvm install 22
nvm alias default 22
node -v   # debe mostrar v22.x.x o v20.9+
```

### Setup inicial

```bash
npm install
npx prisma generate
npx prisma migrate dev
npm run db:seed
```

### Desarrollo

```bash
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000).

---

## Scripts útiles

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Genera Prisma client + build de producción |
| `npm run start` | Servidor de producción |
| `npm run lint` | ESLint |
| `npm run db:migrate` | Aplicar migraciones |
| `npm run db:seed` | Cargar datos de ejemplo |
| `npm run db:reset` | Resetear DB + migraciones + seed |

---

## Relación con Notion

Notion fue la **referencia de diseño** para armar este programa. Los datos viven en SQLite (`dev.db`); **no se sincroniza con Notion**.

Para volver a datos de ejemplo:

```bash
npm run db:seed
```

---

## Estructura de carpetas (resumen)

```
UcaNode/
├── prisma/
│   ├── schema.prisma       # Modelo de datos
│   ├── seed.ts             # Datos de ejemplo
│   └── migrations/         # Migraciones SQL
├── src/
│   ├── app/                # Rutas (App Router)
│   │   ├── layout.tsx      # Layout + navegación
│   │   ├── page.tsx        # Dashboard
│   │   ├── loading.tsx     # Spinner global
│   │   ├── error.tsx       # Error boundary
│   │   ├── materias/
│   │   ├── entregas/
│   │   ├── horarios/
│   │   ├── links/
│   │   └── perfil/
│   ├── components/         # UI reutilizable
│   │   ├── layout.tsx      # AppHeader, SectionCard, EmptyState
│   │   ├── forms.tsx       # Formularios Client (useActionState)
│   │   ├── materia-card.tsx
│   │   ├── calendario.tsx
│   │   └── item-actions.tsx
│   ├── lib/
│   │   ├── prisma.ts       # Cliente Prisma singleton
│   │   ├── actions.ts      # Server Actions con validación Zod
│   │   ├── schemas.ts      # Schemas Zod
│   │   ├── labels.ts       # Mapas enum → texto
│   │   └── dates.ts        # Helpers de fecha
│   └── generated/prisma/   # Cliente Prisma (generado)
├── dev.db                  # Base SQLite (local)
├── package.json
└── zod                     # Validación de schemas
```
