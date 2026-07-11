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

function d(iso: string) {
  return new Date(`${iso}T12:00:00`);
}

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
      dia: DiaSemana.LUNES,
      promocional: true,
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
      dia: DiaSemana.MIERCOLES,
    },
  });

  const paradigmas = await prisma.materia.create({
    data: {
      nombre: "Paradigmas de Programación",
      codigo: "INF-210",
      estado: EstadoMateria.CURSANDO,
      cuatrimestre: 2,
      anio: 2,
      profesor: "Ing. Suárez",
      semestre: "2° Semestre",
      dia: DiaSemana.MARTES,
      correlativas: "INF-101",
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
      dia: DiaSemana.JUEVES,
      notas: "Revisar normalización 3FN antes del final.",
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
      dia: DiaSemana.VIERNES,
    },
  });

  const sistemasOp = await prisma.materia.create({
    data: {
      nombre: "Sistemas Operativos",
      codigo: "INF-402",
      estado: EstadoMateria.REGULAR,
      cuatrimestre: 1,
      anio: 3,
      profesor: "Ing. Álvarez",
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
        fecha: d("2026-07-15"),
        estado: EstadoEntrega.PENDIENTE,
        prioridad: "alta",
        materiaId: intro.id,
      },
      {
        titulo: "TP2 - Funciones y arrays",
        tipo: TipoEntrega.TP,
        fecha: d("2026-08-01"),
        estado: EstadoEntrega.EN_CURSO,
        prioridad: "media",
        materiaId: intro.id,
      },
      {
        titulo: "Parcial Intro",
        tipo: TipoEntrega.PARCIAL,
        fecha: d("2026-08-05"),
        estado: EstadoEntrega.PENDIENTE,
        prioridad: "alta",
        materiaId: intro.id,
      },
      {
        titulo: "Parcial Algoritmos",
        tipo: TipoEntrega.PARCIAL,
        fecha: d("2026-07-25"),
        estado: EstadoEntrega.ENTREGADO,
        nota: 8,
        prioridad: "alta",
        materiaId: algoritmos.id,
      },
      {
        titulo: "TP3 - Árboles binarios",
        tipo: TipoEntrega.TP,
        fecha: d("2026-08-10"),
        estado: EstadoEntrega.PENDIENTE,
        prioridad: "media",
        materiaId: algoritmos.id,
      },
      {
        titulo: "TP4 - Grafos",
        tipo: TipoEntrega.TP,
        fecha: d("2026-08-22"),
        estado: EstadoEntrega.PENDIENTE,
        prioridad: "media",
        materiaId: algoritmos.id,
      },
      {
        titulo: "TP Paradigma Funcional",
        tipo: TipoEntrega.TP,
        fecha: d("2026-07-18"),
        estado: EstadoEntrega.EN_CURSO,
        prioridad: "media",
        materiaId: paradigmas.id,
      },
      {
        titulo: "Parcial Paradigmas",
        tipo: TipoEntrega.PARCIAL,
        fecha: d("2026-08-13"),
        estado: EstadoEntrega.PENDIENTE,
        prioridad: "alta",
        materiaId: paradigmas.id,
      },
      {
        titulo: "Parcial BD",
        tipo: TipoEntrega.PARCIAL,
        fecha: d("2026-07-20"),
        estado: EstadoEntrega.PENDIENTE,
        prioridad: "alta",
        materiaId: bd.id,
      },
      {
        titulo: "Final BD",
        tipo: TipoEntrega.FINAL,
        fecha: d("2026-08-15"),
        estado: EstadoEntrega.PENDIENTE,
        prioridad: "alta",
        materiaId: bd.id,
      },
      {
        titulo: "TP Integrador Redes",
        tipo: TipoEntrega.TP,
        fecha: d("2026-07-30"),
        estado: EstadoEntrega.PENDIENTE,
        prioridad: "media",
        materiaId: redes.id,
      },
      {
        titulo: "TP subneting",
        tipo: TipoEntrega.TP,
        fecha: d("2026-07-08"),
        estado: EstadoEntrega.ENTREGADO,
        prioridad: "baja",
        materiaId: redes.id,
      },
      {
        titulo: "TP Procesos y hilos",
        tipo: TipoEntrega.TP,
        fecha: d("2026-07-12"),
        estado: EstadoEntrega.ENTREGADO,
        prioridad: "media",
        materiaId: sistemasOp.id,
      },
      {
        titulo: "Parcial Sistemas Op.",
        tipo: TipoEntrega.PARCIAL,
        fecha: d("2026-08-06"),
        estado: EstadoEntrega.PENDIENTE,
        prioridad: "alta",
        materiaId: sistemasOp.id,
      },
      {
        titulo: "TP Memoria virtual",
        tipo: TipoEntrega.TP,
        fecha: d("2026-08-20"),
        estado: EstadoEntrega.PENDIENTE,
        prioridad: "media",
        materiaId: sistemasOp.id,
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
        dia: DiaSemana.MARTES,
        horaInicio: "19:00",
        horaFin: "22:00",
        modalidad: Modalidad.VIRTUAL,
        aulaLink: "https://meet.google.com/paradigmas-2c",
        materiaId: paradigmas.id,
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
      {
        dia: DiaSemana.JUEVES,
        horaInicio: "14:00",
        horaFin: "17:00",
        modalidad: Modalidad.VIRTUAL,
        aulaLink: "https://meet.google.com/sistemas-op",
        materiaId: sistemasOp.id,
      },
      {
        dia: DiaSemana.VIERNES,
        horaInicio: "18:00",
        horaFin: "22:00",
        modalidad: Modalidad.PRESENCIAL,
        aulaLink: "Aula 8",
        materiaId: redes.id,
      },
      {
        dia: DiaSemana.VIERNES,
        horaInicio: "09:00",
        horaFin: "12:00",
        modalidad: Modalidad.VIRTUAL,
        aulaLink: "https://meet.google.com/consulta-bd",
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
      {
        nombre: "GitHub Ucasal (grupo)",
        url: "https://github.com/ucasal",
        categoria: CategoriaLink.GITHUB,
        favorito: false,
      },
      {
        nombre: "Biblioteca Digital Ucasal",
        url: "https://biblioteca.ucasal.edu.ar",
        categoria: CategoriaLink.PLATAFORMA_UCASAL,
        favorito: false,
      },
      {
        nombre: "Apuntes compartidos (Drive)",
        url: "https://drive.google.com/drive/folders/apuntes",
        categoria: CategoriaLink.GOOGLE_DRIVE,
        favorito: true,
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
