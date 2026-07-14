# Deploy en Vercel + Neon

UcaNode se despliega como app full-stack en **Vercel**. La base de datos vive en **Neon** (PostgreSQL serverless).

## Arquitectura en producción

| Pieza | Plataforma | Rol |
|---|---|---|
| Next.js (UI + Server Actions) | Vercel | Hosting y runtime |
| PostgreSQL | Neon | Datos persistentes (perfil, carreras, planes, materias, etc.) |
| Planes de estudio | Repo (`src/data/`) | JSON versionado; ingesta lazy al onboarding |

No hay backend separado: las Server Actions en `src/lib/actions.ts` hablan con Prisma.

## 1. Crear base en Neon

1. Creá un proyecto en [Neon](https://neon.tech).
2. Copiá la connection string de PostgreSQL.
3. Asegurate de que incluya SSL, por ejemplo:

```txt
postgresql://user:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require
```

Opcional: una branch `dev` para local y `main` para producción.

## 2. Variables de entorno en Vercel

**Opción recomendada:** conectá Neon desde [Vercel Marketplace → Neon](https://vercel.com/integrations/neon). Eso inyecta automáticamente `DATABASE_URL` y `DATABASE_URL_UNPOOLED`.

Si cargás la URL a mano, agregá las variables en **Vercel → Project → Settings → Environment Variables** y marcá **Production**, **Preview** y **Development** (el build necesita verlas):

| Variable | Requerida | Uso |
|---|---|---|
| `DATABASE_URL` | Sí | Connection string pooled de Neon (runtime de la app) |
| `DATABASE_URL_UNPOOLED` | Recomendada | Connection string directa (migraciones en build) |
| `NEXT_PUBLIC_CARRERA_SOLICITUD_FORM_URL` | Sí (onboarding) | Google Form para pedir carreras faltantes |

Si solo definís `DATABASE_URL`, el build también funciona (se usa como fallback para migraciones). Con la integración Neon→Vercel, `DATABASE_URL_UNPOOLED` se setea sola.

Copiá el mismo esquema en tu `.env` local desde `.env.example`.

## 3. Deploy en Vercel

1. Importá el repo de GitHub en [Vercel](https://vercel.com).
2. Framework preset: **Next.js**.
3. Build command (default del proyecto):

```bash
npm run build
```

Ese script ejecuta:

```bash
prisma generate && prisma migrate deploy && next build
```

Las migraciones se aplican automáticamente en cada deploy.

4. Agregá las variables de entorno del paso 2.
5. Deploy.

## 4. Setup local con Neon

```bash
cp .env.example .env
# Editá DATABASE_URL con tu branch de Neon
npm install
npx prisma generate
npm run db:migrate
npm run db:seed
npm run dev
```

En una instalación fresca, el seed crea un perfil **sin** `carreraId` para que aparezca el onboarding.

## 5. Qué no correr en producción

| Comando | Producción |
|---|---|
| `npm run db:seed` | No — borra y recarga datos de demo |
| `npm run db:reset` | No — destruye datos |
| `prisma migrate deploy` | Sí — lo corre el build de Vercel |

## 6. Verificación post-deploy

1. Abrí la URL de Vercel.
2. Debería aparecer el onboarding si no hay perfil con carrera.
3. Elegí una carrera del catálogo (Informática, Industrial, Psicología, Arquitectura o Ingeniería Civil).
4. Confirmá que la ingesta lazy carga el plan sin errores.
5. Revisá `/materias`, `/entregas` y `/perfil`.

## 7. Troubleshooting

| Síntoma | Causa probable | Solución |
|---|---|---|
| Build falla: `datasource.url property is required` | `DATABASE_URL` no está en Vercel o no aplica al entorno de build | Agregar variable en los 3 entornos o conectar Neon desde Marketplace |
| `DATABASE_URL no está definida` en runtime | Falta env en Vercel | Agregar en Production + Preview |
| Onboarding no muestra formulario de carrera | Falta `NEXT_PUBLIC_CARRERA_SOLICITUD_FORM_URL` | Agregar variable pública |
| Error de conexión a DB | IP/firewall o string mal copiada | Regenerar string en Neon y actualizar Vercel |

## Rama recomendada para merge

El onboarding y los planes de estudio están en `feature/OnBoarding`. Para el primer deploy:

1. Mergear `feature/OnBoarding` → `develop` (o la rama que uses).
2. Mergear a `main` cuando esté validado.
3. Conectar Vercel a `main` o a `develop` según prefieras previews.
