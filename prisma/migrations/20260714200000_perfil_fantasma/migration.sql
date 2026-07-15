-- AlterTable
ALTER TABLE "Perfil" ADD COLUMN "fantasma" BOOLEAN NOT NULL DEFAULT false;

-- Backfill: mark legacy guest profiles as fantasma
UPDATE "Perfil"
SET "fantasma" = true
WHERE "emailUcasal" IS NULL;
