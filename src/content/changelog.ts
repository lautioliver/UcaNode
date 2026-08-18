import type { ChangelogKind } from "@/lib/changelog-labels";

export type ChangelogItem = {
  kind: ChangelogKind;
  /** Texto con markdown inline (`**negrita**`, `` `código` ``). */
  text: string;
};

export type ChangelogRelease = {
  version: string;
  date: string;
  summary?: string;
  items: ChangelogItem[];
  /** Bloque markdown completo de la release (fuente legible / exportable). */
  markdown: string;
};

export const CHANGELOG_META = {
  title: "Novedades",
  subtitle:
    "Lo último que fuimos sumando a UcaNode. Categorizado como en nuestros commits: feat, fix, docs y más.",
  currentVersion: "0.1.0",
} as const;

export const CHANGELOG_RELEASES: ChangelogRelease[] = [
  {
    version: "0.1.0",
    date: "Agosto 2026",
    summary: "Landing pública, nuevas carreras y mejoras de acceso.",
    markdown: `## v0.1.0 — Agosto 2026

### ✨ Nuevo
- **Landing page** para visitantes sin sesión, con preview interactivo del panel.
- Plan de estudios de **Licenciatura en Relaciones Internacionales 2026** en el onboarding.

### 🐛 Fix
- Login redirige a \`/dashboard\` en lugar de volver a la landing.
- Preview de la landing sin duplicados y con URL \`ucanode.app\` en la barra del mock.
- Responsive y estabilidad general de la landing en mobile.

### 📚 Docs
- Badges de **shields.io** y workflow de **CI** apuntando a \`develop\`.
`,
    items: [
      {
        kind: "feature",
        text: "**Landing page** para visitantes sin sesión, con preview interactivo del panel.",
      },
      {
        kind: "feature",
        text: "Plan de estudios de **Licenciatura en Relaciones Internacionales 2026** en el onboarding.",
      },
      {
        kind: "fix",
        text: "Login redirige a `/dashboard` en lugar de volver a la landing.",
      },
      {
        kind: "fix",
        text: "Preview de la landing sin duplicados y con URL `ucanode.app` en la barra del mock.",
      },
      {
        kind: "fix",
        text: "Responsive y estabilidad general de la landing en mobile.",
      },
      {
        kind: "docs",
        text: "Badges de **shields.io** y workflow de **CI** apuntando a `develop`.",
      },
    ],
  },
  {
    version: "0.0.9",
    date: "Julio 2026",
    summary: "Seguridad de cuenta, términos legales y catálogo de materias.",
    markdown: `## v0.0.9 — Julio 2026

### ✨ Nuevo
- Cambio de **contraseña** y **email** con verificación por correo.
- **Términos y Condiciones** con aceptación obligatoria en registro e ingreso.
- Filtro y visualización de materias por **estado** en el catálogo.

### 🐛 Fix
- Card de Seguridad en \`/perfil\` alineada al resto del diseño.
- Selector **Tipo** en el drawer de entregas ya no se trunca.
- Borrador de auth al leer términos sin perder el flujo de registro.
- URL actualizada de **CampuStatus** en el footer.

### 🔒 Seguridad
- Endurecimiento de **CSP** y headers HTTP en \`next.config.ts\`.
`,
    items: [
      {
        kind: "feature",
        text: "Cambio de **contraseña** y **email** con verificación por correo.",
      },
      {
        kind: "feature",
        text: "**Términos y Condiciones** con aceptación obligatoria en registro e ingreso.",
      },
      {
        kind: "feature",
        text: "Filtro y visualización de materias por **estado** en el catálogo.",
      },
      {
        kind: "fix",
        text: "Card de Seguridad en `/perfil` alineada al resto del diseño.",
      },
      {
        kind: "fix",
        text: "Selector **Tipo** en el drawer de entregas ya no se trunca.",
      },
      {
        kind: "fix",
        text: "Borrador de auth al leer términos sin perder el flujo de registro.",
      },
      {
        kind: "fix",
        text: "URL actualizada de **CampuStatus** en el footer.",
      },
      {
        kind: "security",
        text: "Endurecimiento de **CSP** y headers HTTP en `next.config.ts`.",
      },
    ],
  },
  {
    version: "0.0.8",
    date: "Junio 2026",
    summary: "Comunidad, horarios personalizados y más carreras.",
    markdown: `## v0.0.8 — Junio 2026

### ✨ Nuevo
- Sección **Comunidad** con feed, votos, comentarios y publicaciones por materia.
- **Etiquetas personalizadas** en horarios de clase.
- Planes de **Ingeniería Civil 2012** e **Ingeniería en Telecomunicaciones 2012**.
- Formulario de **soporte** con envío por Resend.
- Nuevo **favicon** con el logo actualizado.

### 💡 Mejora
- Rediseño de interfaz con **shadcn/ui** y búsqueda global (\`Ctrl+K\`).
- Verificación de email con template **React Email** en dark mode.

### 🐛 Fix
- Validación de publicaciones en Comunidad con mensajes más claros.
- Cuentas invitado deprecadas: se exige auth verificada.
`,
    items: [
      {
        kind: "feature",
        text: "Sección **Comunidad** con feed, votos, comentarios y publicaciones por materia.",
      },
      {
        kind: "feature",
        text: "**Etiquetas personalizadas** en horarios de clase.",
      },
      {
        kind: "feature",
        text: "Planes de **Ingeniería Civil 2012** e **Ingeniería en Telecomunicaciones 2012**.",
      },
      {
        kind: "feature",
        text: "Formulario de **soporte** con envío por Resend.",
      },
      {
        kind: "feature",
        text: "Nuevo **favicon** con el logo actualizado.",
      },
      {
        kind: "improvement",
        text: "Rediseño de interfaz con **shadcn/ui** y búsqueda global (`Ctrl+K`).",
      },
      {
        kind: "improvement",
        text: "Verificación de email con template **React Email** en dark mode.",
      },
      {
        kind: "fix",
        text: "Validación de publicaciones en Comunidad con mensajes más claros.",
      },
      {
        kind: "fix",
        text: "Cuentas invitado deprecadas: se exige auth verificada.",
      },
    ],
  },
];

/** Markdown completo del changelog (todas las releases concatenadas). */
export const CHANGELOG_MARKDOWN = CHANGELOG_RELEASES.map((r) => r.markdown).join(
  "\n\n---\n\n",
);
