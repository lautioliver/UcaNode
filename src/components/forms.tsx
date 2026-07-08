"use client";

import { useActionState } from "react";
import type { ActionResult } from "@/lib/actions";
import {
  estadoMateriaLabel,
  tipoEntregaLabel,
  estadoEntregaLabel,
  diaSemanaLabel,
  modalidadLabel,
  categoriaLinkLabel,
} from "@/lib/labels";

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

// ── MATERIA ─────────────────────────────────────────────

export function MateriaCreateForm({
  action,
  dia,
}: {
  action: (prev: ActionResult, data: FormData) => Promise<ActionResult>;
  dia?: string;
}) {
  const [state, formAction, pending] = useActionState(action, { success: true });

  return (
    <form action={formAction} className="grid gap-4 sm:grid-cols-2">
      <Field label="Nombre" span>
        <input
          name="nombre"
          required
          placeholder="Ej: Algoritmos y Estructuras de Datos"
          className={`${input} w-full`}
        />
      </Field>
      <Field label="Código" hint="Sirve como prefijo en las entregas">
        <input
          name="codigo"
          placeholder="Ej: INF-201"
          className={`${input} w-full`}
        />
      </Field>
      <Field label="Estado">
        <select name="estado" defaultValue="CURSANDO" className={`${select} w-full`}>
          {Object.entries(estadoMateriaLabel).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </Field>
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
      <Field label="Cuatrimestre">
        <input
          name="cuatrimestre"
          type="number"
          min={1}
          max={2}
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
          placeholder="1 a 6"
          className={`${input} w-full`}
        />
      </Field>
      <Field label="Semestre">
        <input
          name="semestre"
          placeholder="Ej: 1° Semestre o Anual"
          className={`${input} w-full`}
        />
      </Field>
      <Field label="Correlativas" span>
        <input
          name="correlativas"
          placeholder="Ej: INF-101, MAT-101"
          className={`${input} w-full`}
        />
      </Field>
      <Field label="Notas" span>
        <input
          name="notas"
          placeholder="Observaciones libres"
          className={`${input} w-full`}
        />
      </Field>
      <label className="flex items-center gap-2 text-sm text-secondary sm:col-span-2">
        <input name="promocional" type="checkbox" className="rounded border-border" />
        Promocional
      </label>
      <FormFeedback state={state} pending={pending} submitLabel="Agregar materia" />
    </form>
  );
}

export function MateriaEditForm({
  action,
  defaultValues,
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
}) {
  const [state, formAction, pending] = useActionState(action, { success: true });

  return (
    <form action={formAction} className="grid gap-4 sm:grid-cols-2">
      <input type="hidden" name="id" value={defaultValues.id} />
      <Field label="Nombre" span>
        <input
          name="nombre"
          required
          defaultValue={defaultValues.nombre}
          placeholder="Ej: Algoritmos y Estructuras de Datos"
          className={`${input} w-full`}
        />
      </Field>
      <Field label="Código" hint="Sirve como prefijo en las entregas">
        <input
          name="codigo"
          defaultValue={defaultValues.codigo ?? ""}
          placeholder="Ej: INF-201"
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
          defaultValue={defaultValues.cuatrimestre ?? ""}
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
          defaultValue={defaultValues.anio ?? ""}
          placeholder="1 a 6"
          className={`${input} w-full`}
        />
      </Field>
      <Field label="Semestre">
        <input
          name="semestre"
          defaultValue={defaultValues.semestre ?? ""}
          placeholder="Ej: 1° Semestre o Anual"
          className={`${input} w-full`}
        />
      </Field>
      <Field label="Correlativas" span>
        <input
          name="correlativas"
          defaultValue={defaultValues.correlativas ?? ""}
          placeholder="Ej: INF-101, MAT-101"
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
    </form>
  );
}

// ── ENTREGA ─────────────────────────────────────────────

export function EntregaCreateForm({
  action,
  materias,
}: {
  action: (prev: ActionResult, data: FormData) => Promise<ActionResult>;
  materias: { id: string; nombre: string }[];
}) {
  const [state, formAction, pending] = useActionState(action, { success: true });

  return (
    <form action={formAction} className="grid gap-4 sm:grid-cols-2">
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
        <input name="fecha" type="date" required className={`${input} w-full`} />
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
      <Field label="Recurso" span hint="Link al enunciado, consigna o repo (opcional)">
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
}: {
  action: (prev: ActionResult, data: FormData) => Promise<ActionResult>;
  materias: { id: string; nombre: string }[];
  defaultValues: {
    id: string;
    titulo: string;
    tipo: string;
    fecha: string;
    estado: string;
    materiaId: string;
    recurso: string | null;
    prioridad: string | null;
  };
}) {
  const [state, formAction, pending] = useActionState(action, { success: true });

  return (
    <form action={formAction} className="grid gap-4 sm:grid-cols-2">
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
          defaultValue={defaultValues.tipo}
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
      <Field label="Recurso" span hint="Link al enunciado, consigna o repo (opcional)">
        <input
          name="recurso"
          type="url"
          defaultValue={defaultValues.recurso ?? ""}
          placeholder="https://..."
          className={`${input} w-full`}
        />
      </Field>
      <FormFeedback state={state} pending={pending} submitLabel="Guardar cambios" />
    </form>
  );
}

// ── HORARIO ─────────────────────────────────────────────

export function HorarioCreateForm({
  action,
  materias,
}: {
  action: (prev: ActionResult, data: FormData) => Promise<ActionResult>;
  materias: { id: string; nombre: string }[];
}) {
  const [state, formAction, pending] = useActionState(action, { success: true });

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
}) {
  const [state, formAction, pending] = useActionState(action, { success: true });

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
}: {
  action: (prev: ActionResult, data: FormData) => Promise<ActionResult>;
}) {
  const [state, formAction, pending] = useActionState(action, { success: true });

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
    carrera: string;
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
      <Field label="Carrera" span>
        <input
          name="carrera"
          required
          defaultValue={defaultValues.carrera}
          placeholder="Ej: Ingeniería Informática"
          className={`${input} w-full`}
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
