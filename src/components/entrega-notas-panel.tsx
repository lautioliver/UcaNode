"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  EntregaNotasEditor,
  EMPTY_TIPTAP_DOC,
} from "@/components/entrega-notas-editor";
import { Skeleton } from "@/components/ui/skeleton";
import {
  guardarNotasEntrega,
  obtenerNotasEntrega,
} from "@/lib/actions";
import type { TiptapDoc } from "@/lib/schemas";

export type NotasSaveStatus = "idle" | "dirty" | "saving" | "saved" | "error";

const AUTOSAVE_MS = 1500;

export function EntregaNotasPanel({
  entregaId,
  onStatusChange,
}: {
  entregaId: string;
  onStatusChange?: (status: NotasSaveStatus) => void;
}) {
  const [status, setStatus] = useState<NotasSaveStatus>("idle");
  const [loadError, setLoadError] = useState<string | null>(null);
  const [initial, setInitial] = useState<TiptapDoc | null | undefined>(
    undefined,
  );

  const contentRef = useRef<TiptapDoc | null>(null);
  const dirtyRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const entregaIdRef = useRef(entregaId);
  const lastSavedRef = useRef<string>(JSON.stringify(EMPTY_TIPTAP_DOC));

  useEffect(() => {
    entregaIdRef.current = entregaId;
  }, [entregaId]);

  const updateStatus = useCallback(
    (next: NotasSaveStatus) => {
      setStatus(next);
      onStatusChange?.(next);
    },
    [onStatusChange],
  );

  const persist = useCallback(async () => {
    if (!dirtyRef.current) return;
    dirtyRef.current = false;
    updateStatus("saving");
    const result = await guardarNotasEntrega(
      entregaIdRef.current,
      contentRef.current,
    );
    if (result.success) {
      lastSavedRef.current = JSON.stringify(contentRef.current ?? EMPTY_TIPTAP_DOC);
      updateStatus("saved");
      return;
    }
    dirtyRef.current = true;
    updateStatus("error");
  }, [updateStatus]);

  useEffect(() => {
    let cancelled = false;

    void obtenerNotasEntrega(entregaId).then((result) => {
      if (cancelled) return;
      if (!result.success) {
        setLoadError(result.message ?? "No se pudieron cargar las notas");
        setInitial(null);
        return;
      }
      setInitial(result.contenido ?? null);
      lastSavedRef.current = JSON.stringify(
        result.contenido ?? EMPTY_TIPTAP_DOC,
      );
    });

    return () => {
      cancelled = true;
    };
  }, [entregaId]);

  useEffect(() => {
    function onVisibility() {
      if (document.visibilityState === "hidden") {
        if (timerRef.current) clearTimeout(timerRef.current);
        void persist();
      }
    }
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      if (timerRef.current) clearTimeout(timerRef.current);
      if (dirtyRef.current) {
        void guardarNotasEntrega(entregaIdRef.current, contentRef.current);
      }
    };
  }, [persist]);

  function handleChange(doc: TiptapDoc) {
    const serialized = JSON.stringify(doc);
    if (serialized === lastSavedRef.current) return;
    contentRef.current = doc;
    dirtyRef.current = true;
    updateStatus("dirty");
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      void persist();
    }, AUTOSAVE_MS);
  }

  if (initial === undefined) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-8 w-full bg-surface-hover" />
        <Skeleton className="h-64 w-full bg-surface-hover" />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {loadError && (
        <p className="text-sm text-danger">{loadError}</p>
      )}
      <EntregaNotasEditor
        key={entregaId}
        initialContent={initial}
        onChange={handleChange}
      />
      {status === "error" && (
        <p className="text-sm text-danger">
          No se pudieron guardar los apuntes. Se reintenta al seguir escribiendo.
        </p>
      )}
    </div>
  );
}
