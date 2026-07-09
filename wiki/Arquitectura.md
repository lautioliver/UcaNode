# Arquitectura

UcaNode sigue el patrón de Next.js App Router con Server Components para lectura y Server Actions para escritura.

## Capas

| Capa | Responsabilidad |
|---|---|
| `src/app/` | Rutas, layouts, páginas server, loading states y error boundaries |
| `src/components/` | Componentes de UI reutilizables y formularios client |
| `src/lib/actions.ts` | Server Actions para crear, editar o eliminar datos |
| `src/lib/schemas.ts` | Validación de entrada con Zod |
| `src/lib/prisma.ts` | Singleton del cliente Prisma |
| `prisma/schema.prisma` | Modelo de datos, enums, relaciones e índices |
| `src/generated/prisma/` | Cliente Prisma generado |

## Flujo general

```mermaid
flowchart TB
    subgraph Browser["Navegador"]
        UI["Páginas y componentes"]
        FormsUI["Formularios Client<br/>useActionState"]
        Sidebar["Sidebar<br/>tema y navegación"]
    end

    subgraph NextServer["Servidor Next.js"]
        Pages["src/app/**/page.tsx<br/>Server Components"]
        Actions["Server Actions<br/>src/lib/actions.ts"]
        Schemas["Validación Zod<br/>src/lib/schemas.ts"]
        PrismaLib["Cliente Prisma<br/>src/lib/prisma.ts"]
        RateLimit["Rate limit simple<br/>src/lib/rate-limit.ts"]
    end

    subgraph Data["Persistencia"]
        SchemaDef["prisma/schema.prisma"]
        DB[("SQLite<br/>dev.db")]
        Seed["prisma/seed.ts"]
        Plan["src/data/correlatividades.json"]
    end

    UI --> Pages
    Sidebar --> Pages
    FormsUI -->|"useActionState"| Actions
    Actions --> RateLimit
    Actions -->|"safeParse"| Schemas
    Actions -->|"prisma.*"| PrismaLib
    Pages -->|"prisma.*"| PrismaLib
    PrismaLib --> DB
    SchemaDef --> PrismaLib
    Seed --> DB
    Plan --> Pages
```

## Lectura de datos

Las páginas de `src/app/**/page.tsx` son Server Components. Consultan Prisma directamente, reciben datos ya resueltos y renderizan HTML en servidor.

Esto mantiene la base de datos fuera de los componentes de UI. Los componentes reciben props y no abren conexiones por su cuenta.

## Escritura de datos

Los formularios viven en `src/components/forms.tsx` y usan `useActionState` para manejar estado pendiente, errores por campo y mensajes de éxito.

Cada Server Action:

1. Aplica rate limit básico por IP.
2. Normaliza valores del `FormData`.
3. Valida con Zod.
4. Ejecuta la operación Prisma.
5. Revalida las rutas afectadas con `revalidatePath`.
6. Devuelve un `ActionResult` consistente para la UI.

## Revalidación

La revalidación busca ser granular. Por ejemplo, al modificar materias se revalidan el dashboard, el listado de materias y, cuando corresponde, el detalle de la materia afectada.

## Estado de UI

El layout raíz obtiene el perfil y preferencias persistidas en cookies. La sidebar controla:

- Navegación principal.
- Link al perfil.
- Colapso en desktop.
- Apertura móvil.
- Tema claro/oscuro.
