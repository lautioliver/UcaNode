-- AlterTable
ALTER TABLE "Horario" ADD COLUMN "edificioId" INTEGER,
                      ADD COLUMN "aula" VARCHAR(50);

-- El id de edificio referencia la numeración oficial del mapa del Campus
-- Castañares (1-21). Prisma no expresa CHECK, así que se declara acá.
ALTER TABLE "Horario" ADD CONSTRAINT "Horario_edificioId_check"
  CHECK ("edificioId" IS NULL OR ("edificioId" BETWEEN 1 AND 21));

-- CreateIndex
CREATE INDEX "Horario_edificioId_idx" ON "Horario"("edificioId");

-- Backfill: hasta ahora "aulaLink" mezclaba aula presencial y URL de clase
-- virtual. Las que no son URL pasan a "aula" para dejar un solo significado por
-- columna: "aula" para presencial y "aulaLink" para el link de la clase virtual.
UPDATE "Horario"
SET "aula" = LEFT("aulaLink", 50),
    "aulaLink" = NULL
WHERE "aulaLink" IS NOT NULL
  AND "aulaLink" <> ''
  AND "aulaLink" NOT ILIKE 'http://%'
  AND "aulaLink" NOT ILIKE 'https://%';
