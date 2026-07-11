# Wiki de UcaNode

Esta wiki reúne la documentación técnica y funcional de UcaNode. El `README.md` queda como introducción rápida del proyecto; acá viven los detalles de arquitectura, datos, rutas y desarrollo.

## Páginas

- [Arquitectura](Arquitectura.md): cómo se conectan App Router, Server Components, Server Actions, Prisma y PostgreSQL (Neon).
- [Modelo de datos](Modelo-de-datos.md): entidades, relaciones, enums, plan de estudios e índices definidos en Prisma.
- [Rutas y flujos](Rutas-y-flujos.md): navegación principal, consultas por pantalla y flujo de lectura/escritura.
- [Guía de desarrollo](Desarrollo.md): requisitos, setup, scripts y tareas habituales.
- [Deploy en Vercel + Neon](Deploy.md): variables, build y verificación en producción.
- [Estructura del proyecto](Estructura-del-proyecto.md): carpetas principales y responsabilidad de cada archivo.

## Resumen funcional

UcaNode ayuda a centralizar la organización académica:

- Onboarding de carrera con carga lazy del plan de estudios.
- Materias por estado: cursando, para finalizar, regular y finalizada.
- Entregas, parciales y finales asociados a materias.
- Horarios semanales.
- Links externos frecuentes.
- Perfil del estudiante vinculado a una carrera UCASAL.
- Correlatividades del plan oficial (desde DB tras onboarding).

## Decisiones principales

- La aplicación usa Next.js App Router con Server Components para leer datos en servidor.
- Las escrituras pasan por Server Actions validadas con Zod.
- Prisma 7 administra el acceso a PostgreSQL mediante `@prisma/adapter-pg`.
- El cliente Prisma se genera dentro de `src/generated/prisma/`.
- En producción la base vive en Neon; en local podés usar una branch de Neon o PostgreSQL local.
