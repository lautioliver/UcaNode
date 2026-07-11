function firstDefined(...values: Array<string | undefined>): string | undefined {
  for (const value of values) {
    if (value?.trim()) return value.trim();
  }
  return undefined;
}

/** URL directa (sin pooler) para Prisma CLI: migrate, seed, etc. */
export function getMigrationDatabaseUrl(): string {
  const url = firstDefined(
    process.env.DATABASE_URL_UNPOOLED,
    process.env.DIRECT_URL,
    process.env.POSTGRES_URL_NON_POOLING,
    process.env.DATABASE_URL,
    process.env.POSTGRES_URL,
    process.env.POSTGRES_PRISMA_URL,
  );

  if (!url) {
    throw new Error(
      "Falta la URL de PostgreSQL. En Vercel: Settings → Environment Variables. " +
        "Conectá Neon desde Marketplace (inyecta DATABASE_URL) o pegá la connection string manualmente. " +
        "Marcá Production, Preview y Development.",
    );
  }

  return url;
}

/** URL pooled para la app en runtime (Server Actions, API). */
export function getAppDatabaseUrl(): string {
  const url = firstDefined(
    process.env.DATABASE_URL,
    process.env.POSTGRES_PRISMA_URL,
    process.env.POSTGRES_URL,
    process.env.DATABASE_URL_UNPOOLED,
    process.env.DIRECT_URL,
  );

  if (!url) {
    throw new Error("DATABASE_URL no está definida");
  }

  return url;
}
