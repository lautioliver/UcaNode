"use client";

import { Link2, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useId, useState, useTransition } from "react";
import { ComposerFormatBar } from "@/app/comunidad/components/community-composer";
import type { AttachmentType } from "@/app/comunidad/components/mock-data";
import type { MateriaPlanFuente } from "@/lib/planes-estudio/types";
import { createPost } from "@/lib/community/actions";
import { formatActionError, isValidAttachmentUrl } from "@/lib/community/errors";
import {
  POST_CONTENT_MIN_LENGTH,
  POST_TITLE_MIN_LENGTH,
} from "@/lib/community/schemas";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type DraftAttachment = {
  name: string;
  url: string;
  type: AttachmentType;
};

type CreatePostModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  planMaterias: MateriaPlanFuente[];
  onPublished: () => void;
};

const ATTACHMENT_TYPES: { value: AttachmentType; label: string }[] = [
  { value: "pdf", label: "PDF / documento" },
  { value: "drive", label: "Google Drive" },
  { value: "exam", label: "Examen / parcial" },
];

function toDbAttachmentType(type: AttachmentType): "PDF" | "DRIVE" | "EXAM" | "OTRO" {
  switch (type) {
    case "pdf":
      return "PDF";
    case "drive":
      return "DRIVE";
    case "exam":
      return "EXAM";
    default:
      return "OTRO";
  }
}

export function CreatePostModal({
  open,
  onOpenChange,
  planMaterias,
  onPublished,
}: CreatePostModalProps) {
  const formId = useId();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [materiaCodigo, setMateriaCodigo] = useState("");
  const [attachments, setAttachments] = useState<DraftAttachment[]>([]);
  const [error, setError] = useState<string | null>(null);

  const materiaOptions = [
    { codigo: "general", nombre: "General" },
    ...planMaterias.map((m) => ({ codigo: m.codigo, nombre: m.nombre })),
  ];

  function resetForm() {
    setTitle("");
    setBody("");
    setMateriaCodigo("");
    setAttachments([]);
    setError(null);
  }

  function addAttachment() {
    setAttachments((prev) => [
      ...prev,
      { name: "", url: "", type: "pdf" },
    ]);
  }

  function updateAttachment(
    index: number,
    patch: Partial<DraftAttachment>,
  ) {
    setAttachments((prev) =>
      prev.map((att, i) => (i === index ? { ...att, ...patch } : att)),
    );
  }

  function removeAttachment(index: number) {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const trimmedTitle = title.trim();
    const trimmedBody = body.trim();

    if (trimmedTitle.length < POST_TITLE_MIN_LENGTH) {
      setError(`El título debe tener al menos ${POST_TITLE_MIN_LENGTH} caracteres.`);
      return;
    }

    if (trimmedBody.length < POST_CONTENT_MIN_LENGTH) {
      setError(`El contenido debe tener al menos ${POST_CONTENT_MIN_LENGTH} caracteres.`);
      return;
    }

    for (const att of attachments) {
      const name = att.name.trim();
      const url = att.url.trim();
      const hasPartial = Boolean(name || url);

      if (!hasPartial) continue;

      if (!name || !url) {
        setError("Completá el nombre y la URL de cada adjunto.");
        return;
      }

      if (!isValidAttachmentUrl(url)) {
        setError("Las URLs de adjuntos deben empezar con http:// o https://.");
        return;
      }
    }

    const validAttachments = attachments.filter(
      (att) => att.name.trim() && att.url.trim(),
    );

    setError(null);
    startTransition(async () => {
      const result = await createPost({
        title: trimmedTitle,
        content: trimmedBody,
        planEstudioCodigo: materiaCodigo || "general",
        attachments: validAttachments.map((att) => ({
          name: att.name.trim(),
          url: att.url.trim(),
          type: toDbAttachmentType(att.type),
        })),
      });

      if (!result.success) {
        setError(formatActionError(result, "No se pudo publicar."));
        return;
      }

      resetForm();
      onOpenChange(false);
      onPublished();
      router.refresh();
    });
  }

  const canPublish =
    title.trim().length >= POST_TITLE_MIN_LENGTH &&
    body.trim().length >= POST_CONTENT_MIN_LENGTH &&
    !isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-lg">
        <DialogHeader className="shrink-0 space-y-0 border-b border-border px-5 py-4">
          <DialogTitle className="text-primary">Nuevo post</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 py-4">
            <div className="space-y-2">
              <Label htmlFor={`${formId}-title`}>Título</Label>
              <Input
                id={`${formId}-title`}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ej: Parcial resuelto de Algoritmos"
                className="bg-surface-card"
                minLength={POST_TITLE_MIN_LENGTH}
              />
              <p className="text-xs text-muted">
                Mínimo {POST_TITLE_MIN_LENGTH} caracteres ({title.trim().length}/{POST_TITLE_MIN_LENGTH})
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor={`${formId}-materia`}>Materia</Label>
              <Select value={materiaCodigo} onValueChange={setMateriaCodigo}>
                <SelectTrigger id={`${formId}-materia`} className="w-full bg-surface-card">
                  <SelectValue placeholder="Seleccioná una materia" />
                </SelectTrigger>
                <SelectContent>
                  {materiaOptions.map((m) => (
                    <SelectItem key={m.codigo} value={m.codigo}>
                      {m.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3 rounded-2xl border border-border bg-surface-card p-4 shadow-[var(--shadow-card)]">
              <Textarea
                id={`${formId}-body`}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Escribe tu publicación"
                rows={4}
                className="max-h-52 min-h-[6rem] resize-none overflow-y-auto bg-surface-card field-sizing-fixed"
              />
              <ComposerFormatBar
                attachActive={attachments.length > 0}
                onAttach={addAttachment}
              />
              <p className="text-xs text-muted">
                Mínimo {POST_CONTENT_MIN_LENGTH} caracteres ({body.trim().length}/{POST_CONTENT_MIN_LENGTH})
              </p>
            </div>

            {attachments.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Enlaces adjuntos</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addAttachment}>
                    <Plus className="h-3.5 w-3.5" data-icon="inline-start" />
                    Agregar link
                  </Button>
                </div>
                {attachments.map((att, index) => (
                  <div
                    key={index}
                    className="space-y-2 rounded-xl border border-border bg-surface p-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="flex items-center gap-1.5 text-xs font-medium text-secondary">
                        <Link2 className="h-3.5 w-3.5" />
                        Adjunto {index + 1}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => removeAttachment(index)}
                        aria-label="Quitar adjunto"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                    <Input
                      value={att.name}
                      onChange={(e) =>
                        updateAttachment(index, { name: e.target.value })
                      }
                      placeholder="Nombre del archivo"
                      className="bg-surface-card"
                    />
                    <Input
                      value={att.url}
                      onChange={(e) =>
                        updateAttachment(index, { url: e.target.value })
                      }
                      placeholder="https://drive.google.com/..."
                      className="bg-surface-card"
                    />
                    <Select
                      value={att.type}
                      onValueChange={(value) =>
                        updateAttachment(index, {
                          type: value as AttachmentType,
                        })
                      }
                    >
                      <SelectTrigger className="w-full bg-surface-card">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ATTACHMENT_TYPES.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            )}

            {error && (
              <p className="text-sm text-danger" role="alert">
                {error}
              </p>
            )}
          </div>

          <DialogFooter className="-mx-0 -mb-0 shrink-0 flex-row justify-end gap-2 border-t border-border bg-surface px-5 py-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={!canPublish}>
              {isPending ? "Publicando…" : "Publicar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
