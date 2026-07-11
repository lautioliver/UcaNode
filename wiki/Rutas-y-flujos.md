# Rutas y flujos

Esta página resume la navegación principal y cómo se leen/escriben datos en cada pantalla.

## Navegación

```mermaid
flowchart TD
    Root["/ Dashboard"]
    Mat["/materias Materias"]
    MatId["/materias/[id] Detalle de materia"]
    Ent["/entregas Entregas"]
    Hor["/horarios Horarios"]
    Lnk["/links Links"]
    Per["/perfil Perfil"]
    Err["error.tsx Error boundary"]
    Ld["loading.tsx Loading state"]

    Root --> Mat
    Root --> Ent
    Root --> Hor
    Root --> Lnk
    Mat --> MatId
    MatId --> Mat
    Root --> Per
    Mat --> Per
    Ent --> Per
    Hor --> Per
    Lnk --> Per

    Root & Mat & MatId & Ent & Hor & Lnk & Per -.-> Err
    Root & Mat & MatId & Ent & Hor & Lnk & Per -.-> Ld
```

La sidebar incluye accesos a dashboard, materias, entregas, horarios, links y perfil. También maneja el modo claro/oscuro y el colapso en pantallas grandes.

## Rutas

| Ruta | Lecturas principales | Acciones disponibles |
|---|---|---|
| `/` | Entregas, materias cursando, horarios y links favoritos | - |
| `/materias` | `materia.findMany` (catálogo en tarjetas con año/semestre) | `createMateria`, `updateMateria`, `deleteMateria` |
| `/materias/[id]` | `materia.findUnique` con entregas y horarios | Acciones sobre items relacionados según componentes reutilizados |
| `/entregas` | `entrega.findMany`, `materia.findMany` | `createEntrega`, `updateEntrega`, `deleteEntrega` |
| `/horarios` | `horario.findMany` y `materia.findMany` filtrados a estados activos (`CURSANDO`, `PARA_FINALIZAR`) | `createHorario`, `updateHorario`, `deleteHorario` |
| `/links` | `linkExterno.findMany`, perfil | `createLink`, `updateLink`, `deleteLink` |
| `/perfil` | `perfil.findFirst` | `updatePerfil` |

## Flujo de lectura

```mermaid
sequenceDiagram
    participant U as Usuario
    participant P as page.tsx
    participant Pr as prisma.ts
    participant DB as SQLite

    U->>P: Visita una ruta
    P->>Pr: Consulta Prisma
    Pr->>DB: SELECT
    DB-->>Pr: Filas
    Pr-->>P: Datos tipados
    P-->>U: HTML renderizado
```

Las consultas viven en las páginas de `src/app/`. Los componentes de `src/components/` renderizan datos ya cargados.

## Flujo de escritura

```mermaid
sequenceDiagram
    participant U as Usuario
    participant F as Formulario Client
    participant A as Server Action
    participant R as Rate limit
    participant S as Zod schema
    participant Pr as prisma.ts
    participant DB as SQLite
    participant C as Caché Next.js

    U->>F: Completa y envía formulario
    F->>F: useActionState marca pending
    F->>A: Ejecuta action(prevState, formData)
    A->>R: checkRateLimit(ip)
    A->>S: safeParse(data)
    alt Datos inválidos
        S-->>A: Errores por campo
        A-->>F: ActionResult con success=false
        F-->>U: Mensajes inline
    else Datos válidos
        A->>Pr: create/update/delete
        Pr->>DB: Escritura
        DB-->>Pr: OK
        A->>C: revalidatePath(...)
        A-->>F: ActionResult con success=true
        F-->>U: Feedback de éxito
    end
```

## Manejo de errores

- Errores de validación: vuelven al formulario como `errors`.
- Errores inesperados: se capturan en las acciones y devuelven un mensaje amigable.
- Errores de renderizado: caen en `src/app/error.tsx`.
- Rutas no encontradas: usan `src/app/not-found.tsx` o `src/app/materias/[id]/not-found.tsx`.

## Revalidación por dominio

- Materias: dashboard, listado y detalle cuando aplica.
- Entregas: dashboard, entregas y detalle de materia.
- Horarios: dashboard, horarios y detalle de materia.
- Links: dashboard y links.
- Perfil: layout/rutas que muestran datos del perfil.
