"use client";

import { useId, useState } from "react";
import { ComposerFormatBar } from "@/app/comunidad/components/community-composer";
import type { MateriaPlanFuente } from "@/lib/planes-estudio/types";
import { slugifyMateria, type CommunityPost } from "@/app/comunidad/components/mock-data";
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

type CreatePostModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  planMaterias: MateriaPlanFuente[];
  carreraNombre: string;
  authorName: string;
  onPublish: (post: CommunityPost) => void;
};

export function CreatePostModal({
  open,
  onOpenChange,
  planMaterias,
  carreraNombre,
  authorName,
  onPublish,
}: CreatePostModalProps) {
  const formId = useId();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [materiaCodigo, setMateriaCodigo] = useState("");
  const [includeFile, setIncludeFile] = useState(false);

  const materiaOptions = [
    { codigo: "general", nombre: "General" },
    ...planMaterias.map((m) => ({ codigo: m.codigo, nombre: m.nombre })),
  ];

  function resetForm() {
    setTitle("");
    setBody("");
    setMateriaCodigo("");
    setIncludeFile(false);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;

    const materia =
      materiaOptions.find((m) => m.codigo === materiaCodigo) ??
      materiaOptions[0];

    const id = `post-${Date.now()}`;
    const post: CommunityPost = {
      id,
      title: title.trim(),
      excerpt: body.trim().slice(0, 160) + (body.length > 160 ? "…" : ""),
      body: body.trim(),
      author: { name: authorName, year: 3, karma: 0 },
      materia: {
        slug: slugifyMateria(materia.nombre),
        label: materia.nombre,
      },
      carrera: carreraNombre,
      createdAt: new Date().toISOString(),
      votes: { up: 1, down: 0 },
      commentCount: 0,
      attachments: includeFile
        ? [{ name: "archivo_adjunto.pdf", type: "pdf" as const }]
        : undefined,
      comments: [],
    };

    onPublish(post);
    resetForm();
    onOpenChange(false);
  }

  const canPublish = Boolean(title.trim() && body.trim());

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
              />
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
                attachActive={includeFile}
                onAttach={() => setIncludeFile((v) => !v)}
              />
            </div>
          </div>

          <DialogFooter className="-mx-0 -mb-0 shrink-0 flex-row justify-end gap-2 border-t border-border bg-surface px-5 py-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={!canPublish}>
              Publicar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
