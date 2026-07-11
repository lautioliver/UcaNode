"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import { Wand2 } from "lucide-react";
import type { ActionResult } from "@/lib/actions";
import {
  estadoMateriaLabel,
  tipoEntregaLabel,
  estadoEntregaLabel,
  diaSemanaLabel,
  modalidadLabel,
  categoriaLinkLabel,
} from "@/lib/labels";
import { createCorrelatividadesHelpers, type MateriaAutoInfo, type MateriaPlan } from "@/lib/correlatividades";

function FormFeedback({
  state,
  pending,
  submitLabel = "Guardar",
}: {
  state: ActionResult;
  pending: boolean;
  submitLabel?: string;
}) {
  return (
    <>
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60 sm:col-span-2"
      >
        {pending ? "Guardando..." : submitLabel}
      </button>
      {state.message && (
        <p
          className={`text-sm sm:col-span-2 ${state.success ? "text-success" : "text-danger"}`}
        >
          {state.message}
        </p>
      )}
      {state.errors && (
        <ul className="text-sm text-danger sm:col-span-2">
          {Object.entries(state.errors).map(([field, msgs]) =>
            msgs.map((msg, i) => <li key={`${field}-${i}`}>{field}: {msg}</li>)
          )}
        </ul>
      )}
    </>
  );
}

const input =
  "rounded-lg border border-border bg-surface px-3 py-2 text-sm text-primary placeholder:text-muted outline-none transition focus:border-border-accent focus:ring-2 focus:ring-accent/40";
const select = input;
const labelClass =
  "block text-[11px] font-medium uppercase tracking-wider text-muted mb-1";

function Field({
  label,
  children,
  span,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  span?: boolean;
  hint?: string;
}) {
  return (
    <div className={span ? "sm:col-span-2" : ""}>
      <label className={labelClass}>{label}</label>
      {children}
      {hint && <p className="mt-1 text-[10px] text-muted">{hint}</p>}
    </div>
  );
}

function PlanSuggestion({
  info,
  onApply,
}: {
  info: MateriaAutoInfo | null;
  onApply: () => void;
}) {
  if (!info) return null;
  return (
    <div className="sm:col-span-2 flex flex-col gap-2 rounded-lg border border-[color:var(--accent)]/30 bg-accent-ghost px-3 py-2 text-xs text-primary sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-0.5">
        <span className="text-[11px] font-medium uppercase tracking-wider text-accent">
          Detectada en el plan
        </span>
        <span className="font-medium">
          {info.nombreOficial} · {info.codigo}
        </span>
        <span className="text-muted">
          {info.anio}° año — {info.semestreLabel}
          {info.correlativas ? ` · ${info.correlativas}` : ""}
        </span>
      </div>
      <button
        type="button"
        onClick={onApply}
        className="inline-flex items-center justify-center gap-1.5 rounded-md bg-accent px-2.5 py-1.5 text-xs font-medium text-white transition hover:bg-accent-hover"
      >
        <Wand2 className="h-3.5 w-3.5" />
        Autocompletar
      </button>
    </div>
  );
}

function applyPlanInfo(
  info: MateriaAutoInfo,
  setters: {
    setNombre: (v: string) => void;
    setCodigo: (v: string) => void;
    setAnio: (v: string) => void;
    setCuatrimestre: (v: string) => void;
    setSemestre: (v: string) => void;
    setCorrelativas: (v: string) => void;
  },
) {
  setters.setNombre(info.nombreOficial);
  setters.setCodigo(info.codigo);
  setters.setAnio(String(info.anio));
  setters.setCuatrimestre(info.cuatrimestre != null ? String(info.cuatrimestre) : "");
  setters.setSemestre(info.semestreLabel);
  setters.setCorrelativas(info.correlativas);
}

// ── MATERIA ─────────────────────────────────────────────

export function MateriaCreateForm({
  action,
  dia,
  onSuccess,
  planMaterias,
}: {
  action: (prev: ActionResult, data: FormData) => Promise<ActionResult>;
  dia?: string;
  onSuccess?: () => void;
  planMaterias?: MateriaPlan[];
}) {
  const [state, formAction, pending] = useActionState(action, { success: true });

  const [nombre, setNombre] = useState("");
  const [codigo, setCodigo] = useState("");
  const [anio, setAnio] = useState("");
  const [cuatrimestre, setCuatrimestre] = useState("");
  const [semestre, setSemestre] = useState("");
  const [correlativas, setCorrelativas] = useState("");
  const [autoFilled, setAutoFilled] = useState(false);

  const planHelpers = useMemo(
    () => createCorrelatividadesHelpers(planMaterias ?? []),
    [planMaterias],
  );

  const detectedByCodigo = useMemo(
    () => planHelpers.autoInfoFromCodigo(codigo),
    [planHelpers, codigo],
  );
  const detectedByNombre = useMemo(
    () => planHelpers.autoInfoFromName(nombre),
    [planHelpers, nombre],
  );
  const detected = detectedByCodigo ?? detectedByNombre;

  const hydrateFromPlan = (info: MateriaAutoInfo) => {
    applyPlanInfo(info, {
      setNombre,
      setCodigo,
      setAnio,
      setCuatrimestre,
      setSemestre,
      setCorrelativas,
    });
    setAutoFilled(true);
  };

  useEffect(() => {
    if (detectedByCodigo) {
      hydrateFromPlan(detectedByCodigo);
    }
  }, [detectedByCodigo?.codigo]);

  useEffect(() => {
    if (state.success && state.message === "Materia creada") onSuccess?.();
  }, [state.success, state.message, onSuccess]);

  return (
    <form action={formAction} className="grid gap-4 sm:grid-cols-2">
      <Field label="Código de materia" hint="Ingresá el código del plan o Moodle para autocompletar">
        <input
          name="codigo"
          value={codigo}
          onChange={(e) => {
            setCodigo(e.target.value);
            setAutoFilled(false);
          }}
          placeholder="Ej: 35-1050"
          className={`${input} w-full`}
          autoFocus
        />
      </Field>
      <Field label="Nombre">
        <input
          name="nombre"
          required
          value={nombre}
          onChange={(e) => {
            setNombre(e.target.value);
            if (!detectedByCodigo) setAutoFilled(false);
          }}
          placeholder="Se completa desde el plan"
          readOnly={autoFilled}
          className={`${input} w-full ${autoFilled ? "cursor-not-allowed opacity-80" : ""}`}
        />
      </Field>
      {detected && !autoFilled && (
        <PlanSuggestion info={detected} onApply={() => hydrateFromPlan(detected)} />
      )}
      {autoFilled && (
        <div className="sm:col-span-2 rounded-lg border border-border bg-surface px-3 py-2 text-xs text-slate-600 dark:text-slate-300">
          <span className="font-medium text-accent">Plan detectado:</span>{" "}
          {detected?.nombreOficial} · {detected?.anio}° año — {detected?.semestreLabel}
          {detected?.correlativas ? ` · ${detected.correlativas}` : ""}
        </div>
      )}
      <input type="hidden" name="anio" value={anio} />
      <input type="hidden" name="cuatrimestre" value={cuatrimestre} />
      <input type="hidden" name="semestre" value={semestre} />
      <input type="hidden" name="correlativas" value={correlativas} />
      <input type="hidden" name="estado" value="CURSANDO" />
      <Field label="Día de cursado">
        {dia ? (
          <>
            <input type="hidden" name="dia" value={dia} />
            <input
              value={diaSemanaLabel[dia as keyof typeof diaSemanaLabel] ?? dia}
              readOnly
              className={`${input} w-full cursor-not-allowed opacity-70`}
            />
          </>
        ) : (
          <select name="dia" defaultValue="" className={`${select} w-full`}>
            <option value="">Sin día asignado</option>
            {Object.entries(diaSemanaLabel).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        )}
      </Field>
      <Field label="Profesor">
        <input
          name="profesor"
          placeholder="Ej: Ing. López"
          className={`${input} w-full`}
        />
      </Field>
      <Field label="Notas" span>
        <input
          name="notas"
          placeholder="Observaciones personales"
          className={`${input} w-full`}
        />
      </Field>
      <FormFeedback state={state} pending={pending} submitLabel="Agregar materia" />
    </form>
  );
}

export function MateriaEditForm({
  action,
  defaultValues,
  onSuccess,
  onDelete,
  planMaterias,
}: {
  action: (prev: ActionResult, data: FormData) => Promise<ActionResult>;
  defaultValues: {
    id: string;
    nombre: string;
    codigo: string | null;
    estado: string;
    profesor: string | null;
    cuatrimestre: number | null;
    anio: number | null;
    semestre: string | null;
    correlativas: string | null;
    notas: string | null;
    promocional: boolean;
    dia: string | null;
  };
  onSuccess?: () => void;
  onDelete?: () => void;
  planMaterias?: MateriaPlan[];
}) {
  const [state, formAction, pending] = useActionState(action, { success: true });

  const [nombre, setNombre] = useState(defaultValues.nombre);
  const [codigo, setCodigo] = useState(defaultValues.codigo ?? "");
  const [anio, setAnio] = useState(defaultValues.anio != null ? String(defaultValues.anio) : "");
  const [cuatrimestre, setCuatrimestre] = useState(
    defaultValues.cuatrimestre != null ? String(defaultValues.cuatrimestre) : "",
  );
  const [semestre, setSemestre] = useState(defaultValues.semestre ?? "");
  const [correlativas, setCorrelativas] = useState(defaultValues.correlativas ?? "");

  const planHelpers = useMemo(
    () => createCorrelatividadesHelpers(planMaterias ?? []),
    [planMaterias],
  );

  const detectedByCodigo = useMemo(
    () => planHelpers.autoInfoFromCodigo(codigo),
    [planHelpers, codigo],
  );
  const detectedByNombre = useMemo(
    () => planHelpers.autoInfoFromName(nombre),
    [planHelpers, nombre],
  );
  const detected = detectedByCodigo ?? detectedByNombre;
  const showSuggestion =
    detected != null &&
    (codigo !== detected.codigo ||
      anio !== String(detected.anio) ||
      semestre !== detected.semestreLabel);

  const applyPlan = () => {
    if (!detected) return;
    applyPlanInfo(detected, {
      setNombre,
      setCodigo,
      setAnio,
      setCuatrimestre,
      setSemestre,
      setCorrelativas,
    });
  };

  useEffect(() => {
    if (state.success && state.message === "Materia actualizada") onSuccess?.();
  }, [state.success, state.message, onSuccess]);

  return (
    <form action={formAction} className="grid gap-4 sm:grid-cols-2">
      <input type="hidden" name="id" value={defaultValues.id} />
      <Field label="Nombre" span>
        <input
          name="nombre"
          required
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Ej: Algoritmos y Estructuras de Datos"
          className={`${input} w-full`}
        />
      </Field>
      <PlanSuggestion info={showSuggestion ? detected : null} onApply={applyPlan} />
      <Field label="Código" hint="Sirve como prefijo en las entregas">
        <input
          name="codigo"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
          placeholder="Ej: 35-1050"
          className={`${input} w-full`}
        />
      </Field>
      <Field label="Estado">
        <select
          name="estado"
          defaultValue={defaultValues.estado}
          className={`${select} w-full`}
        >
          {Object.entries(estadoMateriaLabel).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Día de cursado">
        <select
          name="dia"
          defaultValue={defaultValues.dia ?? ""}
          className={`${select} w-full`}
        >
          <option value="">Sin día asignado</option>
          {Object.entries(diaSemanaLabel).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Profesor">
        <input
          name="profesor"
          defaultValue={defaultValues.profesor ?? ""}
          placeholder="Ej: Ing. López"
          className={`${input} w-full`}
        />
      </Field>
      <Field label="Cuatrimestre">
        <input
          name="cuatrimestre"
          type="number"
          min={1}
          max={2}
          value={cuatrimestre}
          onChange={(e) => setCuatrimestre(e.target.value)}
          placeholder="1 o 2"
          className={`${input} w-full`}
        />
      </Field>
      <Field label="Año">
        <input
          name="anio"
          type="number"
          min={1}
          max={6}
          value={anio}
          onChange={(e) => setAnio(e.target.value)}
          placeholder="1 a 6"
          className={`${input} w-full`}
        />
      </Field>
      <Field label="Semestre">
        <input
          name="semestre"
          value={semestre}
          onChange={(e) => setSemestre(e.target.value)}
          placeholder="Ej: 1° Semestre o Anual"
          className={`${input} w-full`}
        />
      </Field>
      <Field label="Correlativas" span hint="Se completan automáticamente desde el plan al detectar la materia">
        <input
          name="correlativas"
          value={correlativas}
          onChange={(e) => setCorrelativas(e.target.value)}
          placeholder="Ej: Reg: LENG 1 · Aprob: FI"
          className={`${input} w-full`}
        />
      </Field>
      <Field label="Notas" span>
        <input
          name="notas"
          defaultValue={defaultValues.notas ?? ""}
          placeholder="Observaciones libres"
          className={`${input} w-full`}
        />
      </Field>
      <label className="flex items-center gap-2 text-sm text-secondary sm:col-span-2">
        <input
          name="promocional"
          type="checkbox"
          defaultChecked={defaultValues.promocional}
          className="rounded border-border"
        />
        Promocional
      </label>
      <FormFeedback state={state} pending={pending} submitLabel="Guardar cambios" />
      {onDelete && (
        <button
          type="button"
          onClick={onDelete}
          className="mt-2 w-full rounded-lg border border-danger/30 px-4 py-2 text-sm text-danger transition hover:bg-danger-ghost sm:col-span-2"
        >
          Eliminar materia
        </button>
      )}
    </form>
  );
}

// ── ENTREGA ─────────────────────────────────────────────

export function EntregaCreateForm({
  action,
  materias,
  defaultFecha,
  onSuccess,
  compact = false,
}: {
  action: (prev: ActionResult, data: FormData) => Promise<ActionResult>;
  materias: { id: string; nombre: string }[];
  defaultFecha?: string;
  onSuccess?: () => void;
  compact?: boolean;
}) {
  const [state, formAction, pending] = useActionState(action, { success: true });

  useEffect(() => {
    if (state.success && state.message === "Entrega creada") onSuccess?.();
  }, [state, onSuccess]);

  return (
    <form action={formAction} className={`grid gap-4 ${compact ? "" : "sm:grid-cols-2"}`}>
      <Field label="Título" span>
        <input
          name="titulo"
          required
          placeholder="Ej: TP1 - Introducción"
          className={`${input} w-full`}
        />
      </Field>
      <Field label="Materia">
        <select name="materiaId" required defaultValue="" className={`${select} w-full`}>
          <option value="" disabled>
            Elegí una materia
          </option>
          {materias.map((m) => (
            <option key={m.id} value={m.id}>
              {m.nombre}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Tipo">
        <select name="tipo" required className={`${select} w-full`}>
          {Object.entries(tipoEntregaLabel).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Fecha de entrega">
        <input
          name="fecha"
          type="date"
          required
          defaultValue={defaultFecha ?? ""}
          className={`${input} w-full`}
        />
      </Field>
      <Field label="Estado">
        <select name="estado" defaultValue="PENDIENTE" className={`${select} w-full`}>
          {Object.entries(estadoEntregaLabel).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Prioridad">
        <select name="prioridad" defaultValue="" className={`${select} w-full`}>
          <option value="">Sin prioridad</option>
          <option value="baja">Baja</option>
          <option value="media">Media</option>
          <option value="alta">Alta</option>
          <option value="urgente">Urgente</option>
        </select>
      </Field>
      <Field
        label={compact ? "Apuntes / enlace" : "Recurso"}
        span
        hint={
          compact
            ? "Notas, link al enunciado o repo (opcional)"
            : "Link al enunciado, consigna o repo (opcional)"
        }
      >
        <input
          name="recurso"
          type="url"
          placeholder="https://..."
          className={`${input} w-full`}
        />
      </Field>
      <FormFeedback state={state} pending={pending} submitLabel="Agregar entrega" />
    </form>
  );
}

export function EntregaEditForm({
  action,
  materias,
  defaultValues,
  onSuccess,
  onDelete,
  compact = false,
}: {
  action: (prev: ActionResult, data: FormData) => Promise<ActionResult>;
  materias: { id: string; nombre: string }[];
  defaultValues: {
    id: string;
    titulo: string;
    tipo: string;
    fecha: string;
    estado: string;
    nota: number | null;
    materiaId: string;
    recurso: string | null;
    prioridad: string | null;
  };
  onSuccess?: () => void;
  onDelete?: () => void;
  compact?: boolean;
}) {
  const [state, formAction, pending] = useActionState(action, { success: true });
  const [tipo, setTipo] = useState(defaultValues.tipo);

  useEffect(() => {
    if (state.success && state.message === "Entrega actualizada") onSuccess?.();
  }, [state, onSuccess]);

  return (
    <form action={formAction} className={`grid gap-4 ${compact ? "" : "sm:grid-cols-2"}`}>
      <input type="hidden" name="id" value={defaultValues.id} />
      <Field label="Título" span>
        <input
          name="titulo"
          required
          defaultValue={defaultValues.titulo}
          placeholder="Ej: TP1 - Introducción"
          className={`${input} w-full`}
        />
      </Field>
      <Field label="Materia">
        <select
          name="materiaId"
          required
          defaultValue={defaultValues.materiaId}
          className={`${select} w-full`}
        >
          <option value="" disabled>
            Elegí una materia
          </option>
          {materias.map((m) => (
            <option key={m.id} value={m.id}>
              {m.nombre}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Tipo">
        <select
          name="tipo"
          required
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
          className={`${select} w-full`}
        >
          {Object.entries(tipoEntregaLabel).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Fecha de entrega">
        <input
          name="fecha"
          type="date"
          required
          defaultValue={defaultValues.fecha}
          className={`${input} w-full`}
        />
      </Field>
      <Field label="Estado">
        <select
          name="estado"
          defaultValue={defaultValues.estado}
          className={`${select} w-full`}
        >
          {Object.entries(estadoEntregaLabel).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </Field>
      {tipo === "PARCIAL" && (
        <Field label="Nota" span hint="Calificación del parcial (0 a 10), cargala cuando te la den">
          <input
            name="nota"
            type="number"
            step="0.1"
            min="0"
            max="10"
            defaultValue={defaultValues.nota ?? ""}
            placeholder="Ej: 8"
            className={`${input} w-full`}
          />
        </Field>
      )}
      <Field label="Prioridad">
        <select
          name="prioridad"
          defaultValue={defaultValues.prioridad ?? ""}
          className={`${select} w-full`}
        >
          <option value="">Sin prioridad</option>
          <option value="baja">Baja</option>
          <option value="media">Media</option>
          <option value="alta">Alta</option>
          <option value="urgente">Urgente</option>
        </select>
      </Field>
      <Field
        label={compact ? "Apuntes / enlace" : "Recurso"}
        span
        hint={
          compact
            ? "Notas, link al enunciado o repo (opcional)"
            : "Link al enunciado, consigna o repo (opcional)"
        }
      >
        <input
          name="recurso"
          type="url"
          defaultValue={defaultValues.recurso ?? ""}
          placeholder="https://..."
          className={`${input} w-full`}
        />
      </Field>
      <FormFeedback state={state} pending={pending} submitLabel="Guardar cambios" />
      {onDelete && (
        <button
          type="button"
          onClick={onDelete}
          className="mt-2 w-full rounded-lg border border-danger/30 px-4 py-2 text-sm text-danger transition hover:bg-danger-ghost"
        >
          Eliminar entrega
        </button>
      )}
    </form>
  );
}

// ── HORARIO ─────────────────────────────────────────────

export function HorarioCreateForm({
  action,
  materias,
  dia,
  onSuccess,
}: {
  action: (prev: ActionResult, data: FormData) => Promise<ActionResult>;
  materias: { id: string; nombre: string }[];
  dia?: string;
  onSuccess?: () => void;
}) {
  const [state, formAction, pending] = useActionState(action, { success: true });

  useEffect(() => {
    if (state.success && state.message === "Horario creado") onSuccess?.();
  }, [state.success, state.message, onSuccess]);

  return (
    <form action={formAction} className="grid gap-4 sm:grid-cols-2">
      <Field label="Materia" span>
        <select name="materiaId" required defaultValue="" className={`${select} w-full`}>
          <option value="" disabled>
            Elegí una materia
          </option>
          {materias.map((m) => (
            <option key={m.id} value={m.id}>
              {m.nombre}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Día">
        {dia ? (
          <>
            <input type="hidden" name="dia" value={dia} />
            <input
              value={diaSemanaLabel[dia as keyof typeof diaSemanaLabel] ?? dia}
              readOnly
              className={`${input} w-full cursor-not-allowed opacity-70`}
            />
          </>
        ) : (
          <select name="dia" required defaultValue="" className={`${select} w-full`}>
            <option value="" disabled>
              Elegí un día
            </option>
            {Object.entries(diaSemanaLabel).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        )}
      </Field>
      <Field label="Modalidad">
        <select name="modalidad" defaultValue="PRESENCIAL" className={`${select} w-full`}>
          {Object.entries(modalidadLabel).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Hora de inicio">
        <input name="horaInicio" type="time" required className={`${input} w-full`} />
      </Field>
      <Field label="Hora de fin">
        <input name="horaFin" type="time" required className={`${input} w-full`} />
      </Field>
      <Field label="Aula o link" span hint="Aula presencial o URL del meet/aula virtual">
        <input
          name="aulaLink"
          placeholder="Ej: Aula 12 o https://meet.google.com/..."
          className={`${input} w-full`}
        />
      </Field>
      <FormFeedback state={state} pending={pending} submitLabel="Agregar horario" />
    </form>
  );
}

export function HorarioEditForm({
  action,
  materias,
  defaultValues,
  onSuccess,
}: {
  action: (prev: ActionResult, data: FormData) => Promise<ActionResult>;
  materias: { id: string; nombre: string }[];
  defaultValues: {
    id: string;
    dia: string;
    horaInicio: string;
    horaFin: string;
    modalidad: string;
    aulaLink: string | null;
    materiaId: string;
  };
  onSuccess?: () => void;
}) {
  const [state, formAction, pending] = useActionState(action, { success: true });

  useEffect(() => {
    if (state.success && state.message === "Horario actualizado") onSuccess?.();
  }, [state.success, state.message, onSuccess]);

  return (
    <form action={formAction} className="grid gap-4 sm:grid-cols-2">
      <input type="hidden" name="id" value={defaultValues.id} />
      <Field label="Materia" span>
        <select
          name="materiaId"
          required
          defaultValue={defaultValues.materiaId}
          className={`${select} w-full`}
        >
          <option value="" disabled>
            Elegí una materia
          </option>
          {materias.map((m) => (
            <option key={m.id} value={m.id}>
              {m.nombre}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Día">
        <select
          name="dia"
          required
          defaultValue={defaultValues.dia}
          className={`${select} w-full`}
        >
          {Object.entries(diaSemanaLabel).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Modalidad">
        <select
          name="modalidad"
          defaultValue={defaultValues.modalidad}
          className={`${select} w-full`}
        >
          {Object.entries(modalidadLabel).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Hora de inicio">
        <input
          name="horaInicio"
          type="time"
          required
          defaultValue={defaultValues.horaInicio}
          className={`${input} w-full`}
        />
      </Field>
      <Field label="Hora de fin">
        <input
          name="horaFin"
          type="time"
          required
          defaultValue={defaultValues.horaFin}
          className={`${input} w-full`}
        />
      </Field>
      <Field label="Aula o link" span>
        <input
          name="aulaLink"
          defaultValue={defaultValues.aulaLink ?? ""}
          placeholder="Ej: Aula 12 o https://meet.google.com/..."
          className={`${input} w-full`}
        />
      </Field>
      <FormFeedback state={state} pending={pending} submitLabel="Guardar cambios" />
    </form>
  );
}

// ── LINK ────────────────────────────────────────────────

export function LinkCreateForm({
  action,
  onSuccess,
}: {
  action: (prev: ActionResult, data: FormData) => Promise<ActionResult>;
  onSuccess?: () => void;
}) {
  const [state, formAction, pending] = useActionState(action, { success: true });

  useEffect(() => {
    if (state.success && state.message === "Link creado") onSuccess?.();
  }, [state.success, state.message, onSuccess]);

  return (
    <form action={formAction} className="grid gap-4 sm:grid-cols-2">
      <Field label="Nombre">
        <input
          name="nombre"
          required
          placeholder="Ej: Campus Ucasal"
          className={`${input} w-full`}
        />
      </Field>
      <Field label="Categoría">
        <select name="categoria" defaultValue="OTRO" className={`${select} w-full`}>
          {Object.entries(categoriaLinkLabel).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </Field>
      <Field label="URL" span>
        <input
          name="url"
          type="url"
          required
          placeholder="https://campus.ucasal.edu.ar"
          className={`${input} w-full`}
        />
      </Field>
      <label className="flex items-center gap-2 text-sm text-secondary sm:col-span-2">
        <input name="favorito" type="checkbox" className="rounded border-border" />
        Marcar como favorito
      </label>
      <FormFeedback state={state} pending={pending} submitLabel="Agregar link" />
    </form>
  );
}

export function LinkEditForm({
  action,
  defaultValues,
}: {
  action: (prev: ActionResult, data: FormData) => Promise<ActionResult>;
  defaultValues: {
    id: string;
    nombre: string;
    url: string;
    categoria: string;
    favorito: boolean;
  };
}) {
  const [state, formAction, pending] = useActionState(action, { success: true });

  return (
    <form action={formAction} className="grid gap-4 sm:grid-cols-2">
      <input type="hidden" name="id" value={defaultValues.id} />
      <Field label="Nombre">
        <input
          name="nombre"
          required
          defaultValue={defaultValues.nombre}
          placeholder="Ej: Campus Ucasal"
          className={`${input} w-full`}
        />
      </Field>
      <Field label="Categoría">
        <select
          name="categoria"
          defaultValue={defaultValues.categoria}
          className={`${select} w-full`}
        >
          {Object.entries(categoriaLinkLabel).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </Field>
      <Field label="URL" span>
        <input
          name="url"
          type="url"
          required
          defaultValue={defaultValues.url}
          placeholder="https://..."
          className={`${input} w-full`}
        />
      </Field>
      <label className="flex items-center gap-2 text-sm text-secondary sm:col-span-2">
        <input
          name="favorito"
          type="checkbox"
          defaultChecked={defaultValues.favorito}
          className="rounded border-border"
        />
        Marcar como favorito
      </label>
      <FormFeedback state={state} pending={pending} submitLabel="Guardar cambios" />
    </form>
  );
}

// ── PERFIL ──────────────────────────────────────────────

export function PerfilForm({
  action,
  defaultValues,
}: {
  action: (prev: ActionResult, data: FormData) => Promise<ActionResult>;
  defaultValues: {
    nombre: string;
    emailUcasal: string;
    carreraNombre: string | null;
    anioIngreso: number;
    legajo: string | null;
    password: string | null;
  };
}) {
  const [state, formAction, pending] = useActionState(action, { success: true });

  return (
    <form action={formAction} className="grid gap-4 sm:grid-cols-2">
      <Field label="Nombre">
        <input
          name="nombre"
          required
          defaultValue={defaultValues.nombre}
          placeholder="Tu nombre completo"
          className={`${input} w-full`}
        />
      </Field>
      <Field label="Contraseña" hint="Se guarda local, sin cifrar (a mejorar)">
        <input
          name="password"
          type="password"
          defaultValue={defaultValues.password ?? ""}
          placeholder="••••••••"
          className={`${input} w-full`}
        />
      </Field>
      <Field label="Email Ucasal" span>
        <input
          name="emailUcasal"
          type="email"
          required
          defaultValue={defaultValues.emailUcasal}
          placeholder="nombre.apellido@ucasal.edu.ar"
          className={`${input} w-full`}
        />
      </Field>
      <Field label="Carrera" span hint="Se define en el onboarding inicial">
        <input
          value={defaultValues.carreraNombre ?? "Sin carrera asignada"}
          readOnly
          className={`${input} w-full cursor-not-allowed opacity-80`}
        />
      </Field>
      <Field label="Año de ingreso">
        <input
          name="anioIngreso"
          type="number"
          min={2000}
          max={2100}
          required
          defaultValue={defaultValues.anioIngreso}
          placeholder="Ej: 2024"
          className={`${input} w-full`}
        />
      </Field>
      <Field label="Legajo">
        <input
          name="legajo"
          defaultValue={defaultValues.legajo ?? ""}
          placeholder="Ej: INF-0000 (opcional)"
          className={`${input} w-full`}
        />
      </Field>
      <FormFeedback state={state} pending={pending} submitLabel="Guardar perfil" />
    </form>
  );
}
