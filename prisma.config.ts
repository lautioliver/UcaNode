import "dotenv/config";
import { defineConfig } from "prisma/config";
import { getMigrationDatabaseUrl } from "./src/lib/database-url";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: getMigrationDatabaseUrl(),
  },
});
