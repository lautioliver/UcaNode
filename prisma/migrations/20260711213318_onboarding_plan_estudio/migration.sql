/*
  Warnings:

  - You are about to drop the column `carrera` on the `Perfil` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Entrega" ADD COLUMN "nota" REAL;

-- CreateTable
CREATE TABLE "Carrera" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "planAnio" TEXT NOT NULL,
    "resolucion" TEXT,
    "modalidad" TEXT,
    "duracionAnios" INTEGER,
    "estadoIngesta" TEXT NOT NULL DEFAULT 'LISTO',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "PlanEstudio" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "codigo" TEXT NOT NULL,
    "codigoOficial" TEXT,
    "nombre" TEXT NOT NULL,
    "abreviatura" TEXT,
    "aliases" JSONB NOT NULL DEFAULT [],
    "anio" INTEGER NOT NULL,
    "semestre" INTEGER NOT NULL,
    "tipoDictado" TEXT,
    "creditos" INTEGER,
    "carreraId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "PlanEstudio_carreraId_fkey" FOREIGN KEY ("carreraId") REFERENCES "Carrera" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CorrelatividadPlan" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "materiaId" TEXT NOT NULL,
    "requisitoId" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    CONSTRAINT "CorrelatividadPlan_materiaId_fkey" FOREIGN KEY ("materiaId") REFERENCES "PlanEstudio" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CorrelatividadPlan_requisitoId_fkey" FOREIGN KEY ("requisitoId") REFERENCES "PlanEstudio" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Materia" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nombre" TEXT NOT NULL,
    "codigo" TEXT,
    "estado" TEXT NOT NULL DEFAULT 'CURSANDO',
    "cuatrimestre" INTEGER,
    "anio" INTEGER,
    "profesor" TEXT,
    "correlativas" TEXT,
    "notas" TEXT,
    "promocional" BOOLEAN NOT NULL DEFAULT false,
    "semestre" TEXT,
    "dia" TEXT,
    "planEstudioId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Materia_planEstudioId_fkey" FOREIGN KEY ("planEstudioId") REFERENCES "PlanEstudio" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Materia" ("anio", "codigo", "correlativas", "createdAt", "cuatrimestre", "estado", "id", "nombre", "notas", "profesor", "promocional", "semestre", "updatedAt") SELECT "anio", "codigo", "correlativas", "createdAt", "cuatrimestre", "estado", "id", "nombre", "notas", "profesor", "promocional", "semestre", "updatedAt" FROM "Materia";
DROP TABLE "Materia";
ALTER TABLE "new_Materia" RENAME TO "Materia";
CREATE UNIQUE INDEX "Materia_codigo_key" ON "Materia"("codigo");
CREATE INDEX "Materia_estado_idx" ON "Materia"("estado");
CREATE INDEX "Materia_nombre_idx" ON "Materia"("nombre");
CREATE TABLE "new_Perfil" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nombre" TEXT NOT NULL,
    "emailUcasal" TEXT NOT NULL,
    "anioIngreso" INTEGER NOT NULL,
    "legajo" TEXT,
    "password" TEXT,
    "carreraId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Perfil_carreraId_fkey" FOREIGN KEY ("carreraId") REFERENCES "Carrera" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Perfil" ("anioIngreso", "createdAt", "emailUcasal", "id", "legajo", "nombre", "updatedAt") SELECT "anioIngreso", "createdAt", "emailUcasal", "id", "legajo", "nombre", "updatedAt" FROM "Perfil";
DROP TABLE "Perfil";
ALTER TABLE "new_Perfil" RENAME TO "Perfil";
CREATE UNIQUE INDEX "Perfil_emailUcasal_key" ON "Perfil"("emailUcasal");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Carrera_slug_key" ON "Carrera"("slug");

-- CreateIndex
CREATE INDEX "PlanEstudio_carreraId_idx" ON "PlanEstudio"("carreraId");

-- CreateIndex
CREATE INDEX "PlanEstudio_nombre_idx" ON "PlanEstudio"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "PlanEstudio_carreraId_codigo_key" ON "PlanEstudio"("carreraId", "codigo");

-- CreateIndex
CREATE UNIQUE INDEX "CorrelatividadPlan_materiaId_requisitoId_tipo_key" ON "CorrelatividadPlan"("materiaId", "requisitoId", "tipo");

-- CreateIndex
CREATE INDEX "Entrega_fecha_idx" ON "Entrega"("fecha");

-- CreateIndex
CREATE INDEX "Entrega_materiaId_idx" ON "Entrega"("materiaId");

-- CreateIndex
CREATE INDEX "Entrega_estado_idx" ON "Entrega"("estado");
