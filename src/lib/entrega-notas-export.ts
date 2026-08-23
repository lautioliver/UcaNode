import { generateHTML } from "@tiptap/html";
import type { TiptapDoc } from "@/lib/schemas";
import { entregaNotasHtmlExtensions } from "@/lib/entrega-notas-extensions";

const EMPTY_DOC: TiptapDoc = {
  type: "doc",
  content: [{ type: "paragraph" }],
};

export type EntregaNotasPdfMeta = {
  title: string;
  materia?: string;
  fechaEntrega?: string;
  tipo?: string;
  estado?: string;
};

const PDF_PROSE_STYLES = `
  .entrega-pdf-root {
    color: #111827;
    font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
    font-size: 11pt;
    line-height: 1.55;
  }
  .entrega-pdf-root h1 {
    font-size: 20pt;
    font-weight: 700;
    margin: 0 0 0.35em;
    line-height: 1.2;
  }
  .entrega-pdf-root .entrega-pdf-meta {
    color: #6b7280;
    font-size: 9pt;
    margin: 0 0 1.25em;
  }
  .entrega-pdf-root .entrega-pdf-meta p {
    margin: 0.15em 0;
  }
  .entrega-pdf-root h2 { font-size: 15pt; font-weight: 600; margin: 1em 0 0.35em; }
  .entrega-pdf-root h3 { font-size: 12pt; font-weight: 600; margin: 0.85em 0 0.3em; }
  .entrega-pdf-root p,
  .entrega-pdf-root ul,
  .entrega-pdf-root ol,
  .entrega-pdf-root blockquote,
  .entrega-pdf-root pre { margin: 0.4em 0; }
  .entrega-pdf-root ul,
  .entrega-pdf-root ol { padding-left: 1.25rem; }
  .entrega-pdf-root ul[data-type="taskList"] {
    list-style: none;
    padding-left: 0;
  }
  .entrega-pdf-root ul[data-type="taskList"] li {
    display: flex;
    align-items: flex-start;
    gap: 0.45rem;
  }
  .entrega-pdf-root blockquote {
    border-left: 3px solid #d1d5db;
    color: #4b5563;
    padding-left: 0.75rem;
  }
  .entrega-pdf-root code {
    background: #f3f4f6;
    border-radius: 0.25rem;
    font-family: ui-monospace, monospace;
    font-size: 0.9em;
    padding: 0.1em 0.35em;
  }
  .entrega-pdf-root pre {
    background: #f9fafb;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    overflow-x: auto;
    padding: 0.65rem 0.85rem;
  }
  .entrega-pdf-root pre code {
    background: transparent;
    padding: 0;
  }
  .entrega-pdf-root hr {
    border: none;
    border-top: 1px solid #e5e7eb;
    margin: 1.25em 0;
  }
`;

export function notasDocToHtml(doc: TiptapDoc | null): string {
  const extensions = entregaNotasHtmlExtensions();
  return generateHTML((doc ?? EMPTY_DOC) as Parameters<typeof generateHTML>[0], extensions);
}

export function entregaNotasPdfFilename(title: string): string {
  const base = title
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);

  return `${base || "apuntes"}.pdf`;
}

function buildPdfDocumentHtml(meta: EntregaNotasPdfMeta, bodyHtml: string): string {
  const metaLines = [
    meta.materia ? `<p><strong>Materia:</strong> ${escapeHtml(meta.materia)}</p>` : "",
    meta.fechaEntrega
      ? `<p><strong>Fecha de entrega:</strong> ${escapeHtml(meta.fechaEntrega)}</p>`
      : "",
    meta.tipo ? `<p><strong>Tipo:</strong> ${escapeHtml(meta.tipo)}</p>` : "",
    meta.estado ? `<p><strong>Estado:</strong> ${escapeHtml(meta.estado)}</p>` : "",
  ]
    .filter(Boolean)
    .join("");

  return `
    <style>${PDF_PROSE_STYLES}</style>
    <div class="entrega-pdf-root">
      <h1>${escapeHtml(meta.title)}</h1>
      ${metaLines ? `<div class="entrega-pdf-meta">${metaLines}</div>` : ""}
      <hr />
      ${bodyHtml}
    </div>
  `;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function exportEntregaNotasPdf(
  doc: TiptapDoc | null,
  meta: EntregaNotasPdfMeta,
): Promise<void> {
  const bodyHtml = notasDocToHtml(doc);
  const html = buildPdfDocumentHtml(meta, bodyHtml);

  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.left = "-10000px";
  container.style.top = "0";
  container.style.width = "190mm";
  container.style.background = "#ffffff";
  container.style.padding = "0";
  container.innerHTML = html;
  document.body.appendChild(container);

  try {
    const html2pdf = (await import("html2pdf.js")).default;
    await html2pdf()
      .set({
        margin: [12, 10, 12, 10],
        filename: entregaNotasPdfFilename(meta.title),
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          backgroundColor: "#ffffff",
        },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      })
      .from(container)
      .save();
  } finally {
    document.body.removeChild(container);
  }
}
