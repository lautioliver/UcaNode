# Rutas y flujos

Esta página resume la navegación principal y cómo se leen/escriben datos en cada pantalla.

## Gate de onboarding

Antes de acceder a cualquier ruta, el layout raíz verifica si el perfil tiene `carreraId`:

- **Sin carrera**: se muestra la pantalla de onboarding (`OnboardingCarrera`) a pantalla completa, sin sidebar.
- **Con carrera**: se renderiza el layout habitual y las rutas de la app.

La acción `confirmarCarrera` asigna la carrera, dispara la ingesta lazy del plan y revalida toda la aplicación.

## Navegación

```mermaid
flowchart TD
    Gate{"¿Perfil con carrera?"}
    Onb["Onboarding<br/>selección de carrera"]
    Root["/ Dashboard"]
    Mat["/materias Materias"]
    MatId["/materias/[id] Detalle de materia"]
    Ent["/entregas Entregas"]
    Hor["/horarios Horarios"]
    Con["/concurrencia Concurrencia"]
    Lnk["/links Links"]
    Per["/perfil Perfil"]
    Err["error.tsx Error boundary"]
    Ld["loading.tsx Loading state"]

    Gate -->|No| Onb
    Gate -->|Sí| Root
    Root --> Mat
    Root --> Ent
    Root --> Hor
    Root --> Con
    Root --> Lnk
    Mat --> MatId
    MatId --> Mat
    Root --> Per
    Mat --> Per
    Ent --> Per
    Hor --> Per
    Con --> Per
    Lnk --> Per

    Root & Mat & MatId & Ent & Hor & Con & Lnk & Per -.-> Err
    Root & Mat & MatId & Ent & Hor & Con & Lnk & Per -.-> Ld
```

La sidebar incluye accesos a dashboard, materias, entregas, horarios, concurrencia, links y perfil. Solo es visible después de completar el onboarding. También maneja el modo claro/oscuro y el colapso en pantallas grandes.

## Rutas

| Ruta | Lecturas principales | Acciones disponibles |
|---|---|---|
| Onboarding (layout) | `getOrCreatePerfil`, `listCarrerasDisponibles` | `confirmarCarrera` |
| `/` | Entregas, materias cursando, horarios y links favoritos | - |
| `/materias` | `materia.findMany`, `getPlanMateriasByCarreraId` (autocompletado) | `createMateria`, `updateMateria`, `deleteMateria` |
| `/materias/[id]` | `materia.findUnique` con entregas y horarios | Acciones sobre items relacionados según componentes reutilizados |
| `/entregas` | `entrega.findMany`, `materia.findMany` | `createEntrega`, `updateEntrega`, `deleteEntrega` |
| `/horarios` | `horario.findMany` y `materia.findMany` filtrados a estados activos (`CURSANDO`, `PARA_FINALIZAR`) | `createHorario`, `updateHorario`, `deleteHorario` |
| `/concurrencia` | `fetchZones` desde CampuStatus (`GET /api/zones`, cache 60 s) | - |
| `/links` | `linkExterno.findMany`, perfil | `createLink`, `updateLink`, `deleteLink` |
| `/perfil` | `perfil.findFirst` con `carrera` | `updatePerfil` (carrera de solo lectura, definida en onboarding) |

## Auth y verificación de email

Rutas públicas (sin gate de carrera ni cookie obligatoria para la pantalla):

| Ruta / API | Rol |
|---|---|
| `/login`, `/registro` | Formularios de acceso |
| `/verificar-email` | Pantalla post-registro y reenvío de mail |
| `POST /api/auth/login` | Valida credenciales; bloquea si el email no está verificado |
| `POST /api/auth/registro` | Crea cuenta pendiente y envía mail (no inicia sesión) |
| `GET /api/auth/verificar?token=...` | Confirma el email, setea cookie y redirige a la app |
| `POST /api/auth/reenviar-verificacion` | Reenvía el mail (cooldown 1 min) |

Flujo resumido:

1. Registro → email con link → `/verificar-email`.
2. Click en el link → `emailVerifiedAt` + cookie de sesión.
3. Login solo permitido con email verificado.
4. Cambio de email en `/perfil` invalida la verificación y dispara un nuevo mail.

En desarrollo, si `RESEND_API_KEY` no está configurada, el link de verificación se imprime en la consola del servidor.

En producción (`https://ucanode.app`), los mails salen desde `noreply@mail.ucanode.app` y los links usan `APP_URL`.

## Flujo de lectura

```mermaid
sequenceDiagram
    participant U as Usuario
    participant P as page.tsx
    participant Pr as prisma.ts
    participant DB as PostgreSQL

    U->>P: Visita una ruta
    P->>Pr: Consulta Prisma
    Pr->>DB: SELECT
    DB-->>Pr: Filas
    Pr-->>P: Datos tipados
    P-->>U: HTML renderizado
```

Las consultas viven en las páginas de `src/app/`. Los componentes de `src/components/` renderizan datos ya cargados.

### Lectura externa (CampuStatus)

`/concurrencia` no usa Prisma: la página llama a `fetchZones()` en `src/lib/campustatus/client.ts`, que consulta la API pública de CampuStatus desde el servidor (sin CORS en el browser). La respuesta se valida con Zod y se cachea 60 segundos con `next.revalidate`. El botón **Actualizar** fuerza un nuevo fetch vía `router.refresh()`.

```mermaid
sequenceDiagram
    participant U as Usuario
    participant P as concurrencia/page.tsx
    participant S as campustatus/client.ts
    participant API as CampuStatus API

    U->>P: Visita /concurrencia
    P->>S: fetchZones()
    S->>API: GET /api/zones
    API-->>S: JSON zonas
    S-->>P: Zone[] validadas
    P-->>U: Tarjetas de ocupación
```

## Flujo de escritura

```mermaid
sequenceDiagram
    participant U as Usuario
    participant F as Formulario Client
    participant A as Server Action
    participant R as Rate limit
    participant S as Zod schema
    participant Pr as prisma.ts
    participant DB as PostgreSQL
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

- Onboarding / carrera: toda la app (`revalidateApp`).
- Materias: dashboard, listado y detalle cuando aplica.
- Entregas: dashboard, entregas y detalle de materia.
- Horarios: dashboard, horarios y detalle de materia.
- Links: dashboard y links.
- Perfil: layout/rutas que muestran datos del perfil.
