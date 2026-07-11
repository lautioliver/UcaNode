-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "EstadoMateria" AS ENUM ('CURSANDO', 'PARA_FINALIZAR', 'REGULAR', 'FINALIZADA');

-- CreateEnum
CREATE TYPE "TipoEntrega" AS ENUM ('TP', 'PARCIAL', 'FINAL');

-- CreateEnum
CREATE TYPE "EstadoEntrega" AS ENUM ('PENDIENTE', 'EN_CURSO', 'ENTREGADO');

-- CreateEnum
CREATE TYPE "CategoriaLink" AS ENUM ('GOOGLE_DRIVE', 'PLATAFORMA_UCASAL', 'GITHUB', 'OTRO');

-- CreateEnum
CREATE TYPE "Modalidad" AS ENUM ('PRESENCIAL', 'VIRTUAL');

-- CreateEnum
CREATE TYPE "DiaSemana" AS ENUM ('LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES');

-- CreateEnum
CREATE TYPE "TipoCorrelativa" AS ENUM ('REGULARIZADA', 'APROBADA', 'PARA_RENDIR');

-- CreateEnum
CREATE TYPE "EstadoIngesta" AS ENUM ('PENDIENTE', 'LISTO', 'ERROR');

-- CreateTable
CREATE TABLE "Carrera" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "planAnio" TEXT NOT NULL,
    "resolucion" TEXT,
    "modalidad" TEXT,
    "duracionAnios" INTEGER,
    "estadoIngesta" "EstadoIngesta" NOT NULL DEFAULT 'LISTO',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Carrera_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlanEstudio" (
    "id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "codigoOficial" TEXT,
    "nombre" TEXT NOT NULL,
    "abreviatura" TEXT,
    "aliases" JSONB NOT NULL DEFAULT '[]',
    "anio" INTEGER NOT NULL,
    "semestre" INTEGER NOT NULL,
    "tipoDictado" TEXT,
    "creditos" INTEGER,
    "carreraId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlanEstudio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CorrelatividadPlan" (
    "id" TEXT NOT NULL,
    "materiaId" TEXT NOT NULL,
    "requisitoId" TEXT NOT NULL,
    "tipo" "TipoCorrelativa" NOT NULL,

    CONSTRAINT "CorrelatividadPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Perfil" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "emailUcasal" TEXT NOT NULL,
    "anioIngreso" INTEGER NOT NULL,
    "legajo" TEXT,
    "password" TEXT,
    "carreraId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Perfil_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Materia" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "codigo" TEXT,
    "estado" "EstadoMateria" NOT NULL DEFAULT 'CURSANDO',
    "cuatrimestre" INTEGER,
    "anio" INTEGER,
    "profesor" TEXT,
    "correlativas" TEXT,
    "notas" TEXT,
    "promocional" BOOLEAN NOT NULL DEFAULT false,
    "semestre" TEXT,
    "dia" "DiaSemana",
    "planEstudioId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Materia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Entrega" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "tipo" "TipoEntrega" NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "estado" "EstadoEntrega" NOT NULL DEFAULT 'PENDIENTE',
    "nota" DOUBLE PRECISION,
    "recurso" TEXT,
    "prioridad" TEXT,
    "materiaId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Entrega_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Horario" (
    "id" TEXT NOT NULL,
    "dia" "DiaSemana" NOT NULL,
    "horaInicio" TEXT NOT NULL,
    "horaFin" TEXT NOT NULL,
    "modalidad" "Modalidad" NOT NULL DEFAULT 'PRESENCIAL',
    "aulaLink" TEXT,
    "materiaId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Horario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LinkExterno" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "categoria" "CategoriaLink" NOT NULL DEFAULT 'OTRO',
    "favorito" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LinkExterno_pkey" PRIMARY KEY ("id")
);

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
CREATE UNIQUE INDEX "Perfil_emailUcasal_key" ON "Perfil"("emailUcasal");

-- CreateIndex
CREATE UNIQUE INDEX "Materia_codigo_key" ON "Materia"("codigo");

-- CreateIndex
CREATE INDEX "Materia_estado_idx" ON "Materia"("estado");

-- CreateIndex
CREATE INDEX "Materia_nombre_idx" ON "Materia"("nombre");

-- CreateIndex
CREATE INDEX "Entrega_fecha_idx" ON "Entrega"("fecha");

-- CreateIndex
CREATE INDEX "Entrega_materiaId_idx" ON "Entrega"("materiaId");

-- CreateIndex
CREATE INDEX "Entrega_estado_idx" ON "Entrega"("estado");

-- AddForeignKey
ALTER TABLE "PlanEstudio" ADD CONSTRAINT "PlanEstudio_carreraId_fkey" FOREIGN KEY ("carreraId") REFERENCES "Carrera"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CorrelatividadPlan" ADD CONSTRAINT "CorrelatividadPlan_materiaId_fkey" FOREIGN KEY ("materiaId") REFERENCES "PlanEstudio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CorrelatividadPlan" ADD CONSTRAINT "CorrelatividadPlan_requisitoId_fkey" FOREIGN KEY ("requisitoId") REFERENCES "PlanEstudio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Perfil" ADD CONSTRAINT "Perfil_carreraId_fkey" FOREIGN KEY ("carreraId") REFERENCES "Carrera"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Materia" ADD CONSTRAINT "Materia_planEstudioId_fkey" FOREIGN KEY ("planEstudioId") REFERENCES "PlanEstudio"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Entrega" ADD CONSTRAINT "Entrega_materiaId_fkey" FOREIGN KEY ("materiaId") REFERENCES "Materia"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Horario" ADD CONSTRAINT "Horario_materiaId_fkey" FOREIGN KEY ("materiaId") REFERENCES "Materia"("id") ON DELETE CASCADE ON UPDATE CASCADE;

