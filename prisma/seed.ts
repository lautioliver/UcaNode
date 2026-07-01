import path from "node:path";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import {
  CategoriaLink,
  DiaSemana,
  EstadoEntrega,
  EstadoMateria,
  Modalidad,
  PrismaClient,
  TipoEntrega,
} from "../src/generated/prisma/client";

const dbPath = path.join(__dirname, "..", "dev.db");
const adapter = new PrismaBetterSqlite3({ url: `file:${dbPath}` });
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.entrega.deleteMany();
  await prisma.horario.deleteMany();
  await prisma.materia.deleteMany();
  await prisma.linkExterno.deleteMany();
  await prisma.perfil.deleteMany();

  await prisma.perfil.create({
    data: {
      nombre: "Estudiante Ucasal",
      emailUcasal: "estudiante@ucasal.edu.ar",
      carrera: "Ingeniería Informática",
      anioIngreso: 2024,
      legajo: "INF-0001",
    },
  });

  const intro = await prisma.materia.create({
    data: {
      nombre: "Introducción a la Programación",
      codigo: "INF-101",
      estado: EstadoMateria.CURSANDO,
      cuatrimestre: 1,
      anio: 1,
      profesor: "Dr. García",
      semestre: "1° Semestre",
    },
  });

  const algoritmos = await prisma.materia.create({
    data: {
      nombre: "Algoritmos y Estructuras de Datos",
      codigo: "INF-201",
      estado: EstadoMateria.CURSANDO,
      cuatrimestre: 2,
      anio: 2,
      profesor: "Ing. López",
      semestre: "2° Semestre",
    },
  });

  const bd = await prisma.materia.create({
    data: {
      nombre: "Bases de Datos I",
      codigo: "INF-301",
      estado: EstadoMateria.PARA_FINALIZAR,
      cuatrimestre: 1,
      anio: 3,
      profesor: "Mg. Fernández",
      semestre: "Anual",
    },
  });

  const redes = await prisma.materia.create({
    data: {
      nombre: "Redes de Computadoras",
      codigo: "INF-401",
      estado: EstadoMateria.REGULAR,
      cuatrimestre: 2,
      anio: 3,
      profesor: "Ing. Martínez",
    },
  });

  await prisma.materia.create({
    data: {
      nombre: "Ingeniería de Software",
      codigo: "INF-501",
      estado: EstadoMateria.FINALIZADA,
      cuatrimestre: 1,
      anio: 4,
      profesor: "Lic. Rodríguez",
    },
  });

  await prisma.materia.create({
    data: {
      nombre: "Matemática I",
      codigo: "MAT-101",
      estado: EstadoMateria.FINALIZADA,
      cuatrimestre: 1,
      anio: 1,
      profesor: "Dr. Pérez",
    },
  });

  await prisma.entrega.createMany({
    data: [
      {
        titulo: "TP1 - Variables y control de flujo",
        tipo: TipoEntrega.TP,
        fecha: new Date("2026-07-15"),
        estado: EstadoEntrega.PENDIENTE,
        materiaId: intro.id,
      },
      {
        titulo: "TP2 - Funciones y arrays",
        tipo: TipoEntrega.TP,
        fecha: new Date("2026-08-01"),
        estado: EstadoEntrega.EN_CURSO,
        materiaId: intro.id,
      },
      {
        titulo: "Parcial 1",
        tipo: TipoEntrega.PARCIAL,
        fecha: new Date("2026-07-25"),
        estado: EstadoEntrega.PENDIENTE,
        materiaId: algoritmos.id,
      },
      {
        titulo: "TP3 - Árboles binarios",
        tipo: TipoEntrega.TP,
        fecha: new Date("2026-08-10"),
        estado: EstadoEntrega.PENDIENTE,
        materiaId: algoritmos.id,
      },
      {
        titulo: "Parcial 2",
        tipo: TipoEntrega.PARCIAL,
        fecha: new Date("2026-07-20"),
        estado: EstadoEntrega.PENDIENTE,
        materiaId: bd.id,
      },
      {
        titulo: "Final",
        tipo: TipoEntrega.FINAL,
        fecha: new Date("2026-08-15"),
        estado: EstadoEntrega.PENDIENTE,
        materiaId: bd.id,
      },
      {
        titulo: "TP Integrador",
        tipo: TipoEntrega.TP,
        fecha: new Date("2026-07-30"),
        estado: EstadoEntrega.PENDIENTE,
        materiaId: redes.id,
      },
    ],
  });

  await prisma.horario.createMany({
    data: [
      {
        dia: DiaSemana.LUNES,
        horaInicio: "18:00",
        horaFin: "22:00",
        modalidad: Modalidad.PRESENCIAL,
        aulaLink: "Aula 12",
        materiaId: intro.id,
      },
      {
        dia: DiaSemana.MIERCOLES,
        horaInicio: "18:00",
        horaFin: "22:00",
        modalidad: Modalidad.VIRTUAL,
        aulaLink: "https://meet.google.com/abc-defg-hij",
        materiaId: algoritmos.id,
      },
      {
        dia: DiaSemana.JUEVES,
        horaInicio: "19:00",
        horaFin: "23:00",
        modalidad: Modalidad.PRESENCIAL,
        aulaLink: "Lab 3",
        materiaId: bd.id,
      },
    ],
  });

  await prisma.linkExterno.createMany({
    data: [
      {
        nombre: "Campus Ucasal",
        url: "https://campus.ucasal.edu.ar",
        categoria: CategoriaLink.PLATAFORMA_UCASAL,
        favorito: true,
      },
      {
        nombre: "Google Drive - Materias",
        url: "https://drive.google.com",
        categoria: CategoriaLink.GOOGLE_DRIVE,
        favorito: true,
      },
      {
        nombre: "GitHub Personal",
        url: "https://github.com",
        categoria: CategoriaLink.GITHUB,
        favorito: false,
      },
    ],
  });

  console.log("Seed completado.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
