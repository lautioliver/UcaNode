-- Add perfilId columns (nullable first for backfill)
ALTER TABLE "Materia" ADD COLUMN "perfilId" TEXT;
ALTER TABLE "LinkExterno" ADD COLUMN "perfilId" TEXT;

-- Assign existing rows to the oldest profile (legacy single-user data)
UPDATE "Materia"
SET "perfilId" = (SELECT "id" FROM "Perfil" ORDER BY "createdAt" ASC LIMIT 1)
WHERE "perfilId" IS NULL;

UPDATE "LinkExterno"
SET "perfilId" = (SELECT "id" FROM "Perfil" ORDER BY "createdAt" ASC LIMIT 1)
WHERE "perfilId" IS NULL;

-- Require ownership on all user data
ALTER TABLE "Materia" ALTER COLUMN "perfilId" SET NOT NULL;
ALTER TABLE "LinkExterno" ALTER COLUMN "perfilId" SET NOT NULL;

-- Drop global unique on codigo; scope uniqueness per profile
DROP INDEX IF EXISTS "Materia_codigo_key";
CREATE UNIQUE INDEX "Materia_perfilId_codigo_key" ON "Materia"("perfilId", "codigo");

-- Indexes and foreign keys
CREATE INDEX "Materia_perfilId_idx" ON "Materia"("perfilId");
CREATE INDEX "LinkExterno_perfilId_idx" ON "LinkExterno"("perfilId");

ALTER TABLE "Materia" ADD CONSTRAINT "Materia_perfilId_fkey" FOREIGN KEY ("perfilId") REFERENCES "Perfil"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "LinkExterno" ADD CONSTRAINT "LinkExterno_perfilId_fkey" FOREIGN KEY ("perfilId") REFERENCES "Perfil"("id") ON DELETE CASCADE ON UPDATE CASCADE;
