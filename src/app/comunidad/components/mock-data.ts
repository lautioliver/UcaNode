export type AttachmentType = "pdf" | "drive" | "exam";

export type CommunityAttachment = {
  name: string;
  type: AttachmentType;
};

export type CommunityAuthor = {
  name: string;
  year: number;
  karma: number;
};

export type CommunityMateria = {
  slug: string;
  label: string;
};

export type CommunityComment = {
  id: string;
  author: CommunityAuthor;
  body: string;
  createdAt: string;
  votes: { up: number; down: number };
  children?: CommunityComment[];
};

export type CommunityPost = {
  id: string;
  title: string;
  excerpt: string;
  body: string;
  author: CommunityAuthor;
  materia: CommunityMateria;
  carrera: string;
  createdAt: string;
  votes: { up: number; down: number };
  commentCount: number;
  attachments?: CommunityAttachment[];
  tags?: string[];
  comments: CommunityComment[];
};

export type TopResource = {
  postId: string;
  title: string;
  materia: string;
  votes: number;
};

export const TRENDING_TAGS = ["Finales", "Moodle", "Inscrip"] as const;

export const MOCK_POSTS: CommunityPost[] = [
  {
    id: "post-so-parcial",
    title: "Parcial 1 resuelto — Sistemas Operativos (2024)",
    excerpt:
      "Subo el parcial del año pasado con respuestas comentadas. Incluye ejercicios de planificación y memoria virtual.",
    body: `Subo el parcial del año pasado con respuestas comentadas.

**Temas incluidos:**
- Planificación de procesos (FCFS, SJF, Round Robin)
- Paginación y segmentación
- Deadlocks y algoritmo del banquero

Cualquier duda la vemos en los comentarios. Suerte para el parcial del viernes.`,
    author: { name: "Lautaro Oliver", year: 3, karma: 842 },
    materia: { slug: "sistemas-operativos", label: "Sistemas Operativos" },
    carrera: "Ingeniería en Informática",
    createdAt: "2026-07-26T12:30:00.000Z",
    votes: { up: 42, down: 2 },
    commentCount: 8,
    attachments: [{ name: "SO_Parcial1_2024_resuelto.pdf", type: "pdf" }],
    tags: ["Finales", "Parciales"],
    comments: [
      {
        id: "c1",
        author: { name: "María Gómez", year: 3, karma: 312 },
        body: "Gracias! El ejercicio 3 de Round Robin me salvó.",
        createdAt: "2026-07-26T13:00:00.000Z",
        votes: { up: 12, down: 0 },
        children: [
          {
            id: "c1-1",
            author: { name: "Lautaro Oliver", year: 3, karma: 842 },
            body: "De nada! Si querés te explico el 4 en detalle.",
            createdAt: "2026-07-26T13:15:00.000Z",
            votes: { up: 5, down: 0 },
          },
        ],
      },
      {
        id: "c2",
        author: { name: "Nico Ruiz", year: 2, karma: 89 },
        body: "¿El profe suele repetir ejercicios de memoria virtual?",
        createdAt: "2026-07-26T14:20:00.000Z",
        votes: { up: 3, down: 0 },
        children: [
          {
            id: "c2-1",
            author: { name: "Lautaro Oliver", year: 3, karma: 842 },
            body: "Sí, casi siempre hay uno de paginación. Repasá TLB y page faults.",
            createdAt: "2026-07-26T14:45:00.000Z",
            votes: { up: 8, down: 0 },
          },
          {
            id: "c2-2",
            author: { name: "Ana Torres", year: 3, karma: 156 },
            body: "Confirmo, el año pasado salió casi igual al de 2023.",
            createdAt: "2026-07-26T15:00:00.000Z",
            votes: { up: 4, down: 0 },
          },
        ],
      },
    ],
  },
  {
    id: "post-algo-debate",
    title: "¿Vale la pena promocionar Algoritmos o conviene rendir final?",
    excerpt:
      "El profe dijo que el TP final es exigente. ¿Alguien promocionó el cuatrimestre pasado? Quiero saber si conviene ir a final directo.",
    body: `El profe dijo que el TP final es exigente y que solo promocionan quienes sacan más de 8 en el parcial y entregan el TP a tiempo.

Yo tengo 7 en el parcial y el TP casi listo. ¿Alguien promocionó el cuatrimestre pasado? ¿Conviene ir a final directo o intentar subir la nota del parcial?

Cualquier experiencia sirve, gracias.`,
    author: { name: "Sofía Mendez", year: 2, karma: 124 },
    materia: { slug: "algoritmos", label: "Algoritmos y Estructuras de Datos" },
    carrera: "Ingeniería en Informática",
    createdAt: "2026-07-25T18:45:00.000Z",
    votes: { up: 18, down: 1 },
    commentCount: 12,
    tags: ["Moodle"],
    comments: [
      {
        id: "c3",
        author: { name: "Diego Luna", year: 3, karma: 445 },
        body: "Promocioné con 8 en parcial. El TP tiene que estar impecable, no alcanza con pasar.",
        createdAt: "2026-07-25T19:30:00.000Z",
        votes: { up: 15, down: 0 },
        children: [
          {
            id: "c3-1",
            author: { name: "Sofía Mendez", year: 2, karma: 124 },
            body: "¿Cuánto tiempo les llevó el TP? Yo voy atrasada con la parte de grafos.",
            createdAt: "2026-07-25T20:00:00.000Z",
            votes: { up: 2, down: 0 },
          },
        ],
      },
    ],
  },
  {
    id: "post-inscrip",
    title: "Inscripción a finales — fechas y requisitos Moodle",
    excerpt:
      "Abrieron la inscripción para la mesa de agosto. Recordatorio: necesitán libreta universitaria y 75% de asistencia cargada en Moodle.",
    body: `Abrieron la inscripción para la mesa de agosto en el campus.

**Requisitos:**
- Libreta universitaria al día
- 75% de asistencia cargada en Moodle
- Arancel abonado

Las inscripciones cierran el **5 de agosto a las 18:00**. No dejen para el último día porque el sistema se cae siempre.

#Inscrip #Finales #Moodle`,
    author: { name: "Comisión Estudiantil", year: 4, karma: 1200 },
    materia: { slug: "general", label: "General" },
    carrera: "Ingeniería en Informática",
    createdAt: "2026-07-24T09:00:00.000Z",
    votes: { up: 67, down: 0 },
    commentCount: 5,
    tags: ["Inscrip", "Finales", "Moodle"],
    comments: [
      {
        id: "c4",
        author: { name: "Lucas Ferreyra", year: 3, karma: 78 },
        body: "¿Alguien sabe si aceptan justificativo de ausencias del cuatrimestre pasado?",
        createdAt: "2026-07-24T10:30:00.000Z",
        votes: { up: 6, down: 0 },
      },
    ],
  },
  {
    id: "post-drive-bd",
    title: "Carpeta compartida — Apuntes de Bases de Datos",
    excerpt:
      "Dejo el Drive con apuntes de normalización, SQL avanzado y modelos ER del profe anterior. Se actualiza semanalmente.",
    body: `Armé una carpeta compartida con apuntes de Bases de Datos que fui juntando en los últimos cuatrimestres.

**Contenido:**
- Normalización (1FN a BCNF) con ejemplos
- Consultas SQL avanzadas (JOINs, subconsultas, window functions)
- Modelos ER resueltos de parciales anteriores

La carpeta se actualiza cada domingo. Si tienen material para sumar, avisen por acá.`,
    author: { name: "Valentina Acosta", year: 4, karma: 567 },
    materia: { slug: "bases-de-datos", label: "Bases de Datos" },
    carrera: "Ingeniería en Informática",
    createdAt: "2026-07-23T16:20:00.000Z",
    votes: { up: 55, down: 1 },
    commentCount: 3,
    attachments: [{ name: "Apuntes_BD_UCASAL_2026", type: "drive" }],
    tags: ["Moodle"],
    comments: [
      {
        id: "c5",
        author: { name: "Tomás Vega", year: 3, karma: 203 },
        body: "Excelente material. El capítulo de índices me clarificó mucho.",
        createdAt: "2026-07-23T17:00:00.000Z",
        votes: { up: 9, down: 0 },
      },
    ],
  },
  {
    id: "post-contadoria",
    title: "Modelo de examen — Contabilidad I",
    excerpt:
      "Para los de Contador Público: subo un modelo de examen con balance y estados financieros resueltos.",
    body: `Para los compañeros de Contador Público: subo un modelo de examen con balance general, estado de resultados y flujo de efectivo resueltos paso a paso.

Basado en el temario del 2do cuatrimestre 2025.`,
    author: { name: "Paula Herrera", year: 2, karma: 98 },
    materia: { slug: "contabilidad-1", label: "Contabilidad I" },
    carrera: "Contador Público",
    createdAt: "2026-07-22T11:00:00.000Z",
    votes: { up: 23, down: 0 },
    commentCount: 2,
    attachments: [{ name: "Modelo_Examen_Contabilidad_I.pdf", type: "exam" }],
    tags: ["Finales"],
    comments: [],
  },
];

export const TOP_RESOURCES: TopResource[] = [
  {
    postId: "post-so-parcial",
    title: "Parcial 1 resuelto — SO",
    materia: "Sistemas Operativos",
    votes: 42,
  },
  {
    postId: "post-inscrip",
    title: "Inscripción a finales — agosto",
    materia: "General",
    votes: 67,
  },
  {
    postId: "post-drive-bd",
    title: "Apuntes de Bases de Datos",
    materia: "Bases de Datos",
    votes: 55,
  },
];

export function getPostById(id: string): CommunityPost | undefined {
  return MOCK_POSTS.find((p) => p.id === id);
}

export function slugifyMateria(label: string): string {
  return label
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function authorInitials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function formatRelativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diffMs / 60_000);
  if (minutes < 1) return "ahora";
  if (minutes < 60) return `hace ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `hace ${hours} h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `hace ${days} d`;
  return new Date(iso).toLocaleDateString("es-AR", { day: "numeric", month: "short" });
}
