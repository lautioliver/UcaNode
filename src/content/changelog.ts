import type { ChangelogKind } from "@/lib/changelog-labels";

export type ChangelogItem = {
  kind: ChangelogKind;
  /** Título breve del cambio; el detalle va en `summary` de la release. */
  title: string;
};

export type ChangelogRelease = {
  version: string;
  date: string;
  summary: string;
  items: ChangelogItem[];
  /** Bloque markdown completo de la release (fuente legible / exportable). */
  markdown: string;
};

export const CHANGELOG_META = {
  title: "Novedades",
  subtitle:
    "Resumen de lo último en UcaNode. Cada versión tiene un título general y los cambios agrupados por tipo.",
  currentVersion: "0.1.0",
} as const;

export const CHANGELOG_RELEASES: ChangelogRelease[] = [
  {
    version: "0.1.0",
    date: "Agosto 2026",
    summary: "Landing pública, nuevas carreras y mejoras de acceso.",
    markdown: `## v0.1.0 — Agosto 2026

Landing pública, nuevas carreras y mejoras de acceso.

### ✨ Nuevo
- Landing page
- Relaciones Internacionales 2026

### 🐛 Fix
- Redirección post-login
- Preview de la landing
- Responsive mobile

### 📚 Docs
- Badges y CI
`,
    items: [
      { kind: "feature", title: "Landing page" },
      { kind: "feature", title: "Relaciones Internacionales 2026" },
      { kind: "fix", title: "Redirección post-login" },
      { kind: "fix", title: "Preview de la landing" },
      { kind: "fix", title: "Responsive mobile" },
      { kind: "docs", title: "Badges y CI" },
    ],
  },
  {
    version: "0.0.9",
    date: "Julio 2026",
    summary: "Seguridad de cuenta, términos legales y catálogo de materias.",
    markdown: `## v0.0.9 — Julio 2026

Seguridad de cuenta, términos legales y catálogo de materias.

### ✨ Nuevo
- Cambio de contraseña y email
- Términos y Condiciones
- Filtro por estado en materias

### 🐛 Fix
- Card Seguridad en perfil
- Selector Tipo en entregas
- Borrador de auth en términos
- URL CampuStatus

### 🔒 Seguridad
- CSP y headers HTTP
`,
    items: [
      { kind: "feature", title: "Cambio de contraseña y email" },
      { kind: "feature", title: "Términos y Condiciones" },
      { kind: "feature", title: "Filtro por estado en materias" },
      { kind: "fix", title: "Card Seguridad en perfil" },
      { kind: "fix", title: "Selector Tipo en entregas" },
      { kind: "fix", title: "Borrador de auth en términos" },
      { kind: "fix", title: "URL CampuStatus" },
      { kind: "security", title: "CSP y headers HTTP" },
    ],
  },
  {
    version: "0.0.8",
    date: "Junio 2026",
    summary: "Comunidad, horarios personalizados y más carreras.",
    markdown: `## v0.0.8 — Junio 2026

Comunidad, horarios personalizados y más carreras.

### ✨ Nuevo
- Comunidad
- Etiquetas en horarios
- Civil y Telecomunicaciones
- Formulario de soporte
- Nuevo favicon

### 💡 Mejora
- Rediseño shadcn/ui
- Email de verificación

### 🐛 Fix
- Validación en Comunidad
- Deprecación cuentas invitado
`,
    items: [
      { kind: "feature", title: "Comunidad" },
      { kind: "feature", title: "Etiquetas en horarios" },
      { kind: "feature", title: "Civil y Telecomunicaciones" },
      { kind: "feature", title: "Formulario de soporte" },
      { kind: "feature", title: "Nuevo favicon" },
      { kind: "improvement", title: "Rediseño shadcn/ui" },
      { kind: "improvement", title: "Email de verificación" },
      { kind: "fix", title: "Validación en Comunidad" },
      { kind: "fix", title: "Deprecación cuentas invitado" },
    ],
  },
];

export const CHANGELOG_MARKDOWN = CHANGELOG_RELEASES.map((r) => r.markdown).join(
  "\n\n---\n\n",
);
