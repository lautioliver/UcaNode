-- AlterTable
ALTER TABLE "Perfil" ALTER COLUMN "emailUcasal" DROP NOT NULL;

-- Placeholder emails from auto-created sessions are not real addresses.
UPDATE "Perfil"
SET "emailUcasal" = NULL
WHERE "emailUcasal" ~ '^estudiante-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}@ucasal\.edu\.ar$';
