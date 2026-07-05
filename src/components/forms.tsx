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
        className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60 sm:col-span-2"
      >
        {pending ? "Guardando..." : submitLabel}
      </button>
      {state.message && (
        <p
          className={`text-sm sm:col-span-2 ${state.success ? "text-accent" : "text-red-500"}`}
        >
          {state.message}
        </p>
      )}
      {state.errors && (
        <ul className="text-sm text-red-500 sm:col-span-2">
          {Object.entries(state.errors).map(([field, msgs]) =>
            msgs.map((msg, i) => <li key={`${field}-${i}`}>{field}: {msg}</li>)
          )}
        </ul>
      )}
    </>
  );
}

const input =
  "rounded-lg border border-border bg-surface px-3 py-2 text-sm text-primary placeholder:text-muted outline-none focus:ring-2 focus:ring-accent focus:ring-inset";
const select = input;

export function MateriaCreateForm({
  action,
}: {
  action: (prev: ActionResult, data: FormData) => Promise<ActionResult>;
}) {
  const [state, formAction, pending] = useActionState(action, { success: true });

  return (
    <form action={formAction} className="grid gap-3 sm:grid-cols-2">
      <input name="nombre" required placeholder="Nombre" className={input} />
      <input name="codigo" placeholder="Código (INF-201)" className={input} />
      <select name="estado" defaultValue="CURSANDO" className={select}>
        {Object.entries(estadoMateriaLabel).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
      <input name="profesor" placeholder="Profesor" className={input} />
      <input name="cuatrimestre" type="number" placeholder="Cuatrimestre" className={input} />
      <input name="anio" type="number" placeholder="Año" className={input} />
      <input name="semestre" placeholder="Semestre" className={input} />
      <input name="correlativas" placeholder="Correlativas" className={input} />
      <input name="notas" placeholder="Notas" className={`${input} sm:col-span-2`} />
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
  };
}) {
  const [state, formAction, pending] = useActionState(action, { success: true });

  return (
    <form action={formAction} className="grid gap-3 sm:grid-cols-2">
      <input type="hidden" name="id" value={defaultValues.id} />
      <input name="nombre" required defaultValue={defaultValues.nombre} className={input} />
      <input name="codigo" defaultValue={defaultValues.codigo ?? ""} className={input} />
      <select name="estado" defaultValue={defaultValues.estado} className={select}>
        {Object.entries(estadoMateriaLabel).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
      <input name="profesor" defaultValue={defaultValues.profesor ?? ""} className={input} />
      <input name="cuatrimestre" type="number" defaultValue={defaultValues.cuatrimestre ?? ""} className={input} />
      <input name="anio" type="number" defaultValue={defaultValues.anio ?? ""} className={input} />
      <input name="semestre" defaultValue={defaultValues.semestre ?? ""} className={input} />
      <input name="correlativas" defaultValue={defaultValues.correlativas ?? ""} className={input} />
      <input name="notas" defaultValue={defaultValues.notas ?? ""} className={`${input} sm:col-span-2`} />
      <label className="flex items-center gap-2 text-sm text-secondary sm:col-span-2">
        <input name="promocional" type="checkbox" defaultChecked={defaultValues.promocional} className="rounded border-border" />
        Promocional
      </label>
      <FormFeedback state={state} pending={pending} submitLabel="Guardar cambios" />
    </form>
  );
}

export function EntregaCreateForm({
  action,
  materias,
}: {
  action: (prev: ActionResult, data: FormData) => Promise<ActionResult>;
  materias: { id: string; nombre: string }[];
}) {
  const [state, formAction, pending] = useActionState(action, { success: true });

  return (
    <form action={formAction} className="grid gap-3 sm:grid-cols-2">
      <input name="titulo" required placeholder="Título" className={`${input} sm:col-span-2`} />
      <select name="materiaId" required className={select}>
        <option value="">Materia</option>
        {materias.map((m) => (
          <option key={m.id} value={m.id}>
            {m.nombre}
          </option>
        ))}
      </select>
      <select name="tipo" required className={select}>
        {Object.entries(tipoEntregaLabel).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
      <input name="fecha" type="date" required className={input} />
      <select name="estado" defaultValue="PENDIENTE" className={select}>
        {Object.entries(estadoEntregaLabel).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
      <select name="prioridad" className={select}>
        <option value="">Sin prioridad</option>
        <option value="baja">Baja</option>
        <option value="media">Media</option>
        <option value="alta">Alta</option>
        <option value="urgente">Urgente</option>
      </select>
      <input name="recurso" placeholder="Link al enunciado (opcional)" className={`${input} sm:col-span-2`} />
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
    <form action={formAction} className="grid gap-3 sm:grid-cols-2">
      <input type="hidden" name="id" value={defaultValues.id} />
      <input name="titulo" required defaultValue={defaultValues.titulo} className={`${input} sm:col-span-2`} />
      <select name="materiaId" required defaultValue={defaultValues.materiaId} className={select}>
        <option value="">Materia</option>
        {materias.map((m) => (
          <option key={m.id} value={m.id}>
            {m.nombre}
          </option>
        ))}
      </select>
      <select name="tipo" required defaultValue={defaultValues.tipo} className={select}>
        {Object.entries(tipoEntregaLabel).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
      <input name="fecha" type="date" required defaultValue={defaultValues.fecha} className={input} />
      <select name="estado" defaultValue={defaultValues.estado} className={select}>
        {Object.entries(estadoEntregaLabel).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
      <select name="prioridad" defaultValue={defaultValues.prioridad ?? ""} className={select}>
        <option value="">Sin prioridad</option>
        <option value="baja">Baja</option>
        <option value="media">Media</option>
        <option value="alta">Alta</option>
        <option value="urgente">Urgente</option>
      </select>
      <input name="recurso" placeholder="Link al enunciado (opcional)" defaultValue={defaultValues.recurso ?? ""} className={`${input} sm:col-span-2`} />
      <FormFeedback state={state} pending={pending} submitLabel="Guardar cambios" />
    </form>
  );
}

export function HorarioCreateForm({
  action,
  materias,
}: {
  action: (prev: ActionResult, data: FormData) => Promise<ActionResult>;
  materias: { id: string; nombre: string }[];
}) {
  const [state, formAction, pending] = useActionState(action, { success: true });

  return (
    <form action={formAction} className="grid gap-3 sm:grid-cols-2">
      <select name="materiaId" required className={select}>
        <option value="">Materia</option>
        {materias.map((m) => (
          <option key={m.id} value={m.id}>
            {m.nombre}
          </option>
        ))}
      </select>
      <select name="dia" required className={select}>
        {Object.entries(diaSemanaLabel).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
      <input name="horaInicio" required placeholder="Hora inicio (18:00)" className={input} />
      <input name="horaFin" required placeholder="Hora fin (22:00)" className={input} />
      <select name="modalidad" defaultValue="PRESENCIAL" className={select}>
        {Object.entries(modalidadLabel).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
      <input name="aulaLink" placeholder="Aula o link virtual" className={input} />
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
    <form action={formAction} className="grid gap-3 sm:grid-cols-2">
      <input type="hidden" name="id" value={defaultValues.id} />
      <select name="materiaId" required defaultValue={defaultValues.materiaId} className={select}>
        <option value="">Materia</option>
        {materias.map((m) => (
          <option key={m.id} value={m.id}>
            {m.nombre}
          </option>
        ))}
      </select>
      <select name="dia" required defaultValue={defaultValues.dia} className={select}>
        {Object.entries(diaSemanaLabel).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
      <input name="horaInicio" required defaultValue={defaultValues.horaInicio} className={input} />
      <input name="horaFin" required defaultValue={defaultValues.horaFin} className={input} />
      <select name="modalidad" defaultValue={defaultValues.modalidad} className={select}>
        {Object.entries(modalidadLabel).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
      <input name="aulaLink" defaultValue={defaultValues.aulaLink ?? ""} className={input} />
      <FormFeedback state={state} pending={pending} submitLabel="Guardar cambios" />
    </form>
  );
}

export function LinkCreateForm({
  action,
}: {
  action: (prev: ActionResult, data: FormData) => Promise<ActionResult>;
}) {
  const [state, formAction, pending] = useActionState(action, { success: true });

  return (
    <form action={formAction} className="grid gap-3 sm:grid-cols-2">
      <input name="nombre" required placeholder="Nombre" className={input} />
      <input name="url" type="url" required placeholder="https://..." className={input} />
      <select name="categoria" defaultValue="OTRO" className={select}>
        {Object.entries(categoriaLinkLabel).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
      <label className="flex items-center gap-2 text-sm text-secondary">
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
    <form action={formAction} className="grid gap-3 sm:grid-cols-2">
      <input type="hidden" name="id" value={defaultValues.id} />
      <input name="nombre" required defaultValue={defaultValues.nombre} className={input} />
      <input name="url" type="url" required defaultValue={defaultValues.url} className={input} />
      <select name="categoria" defaultValue={defaultValues.categoria} className={select}>
        {Object.entries(categoriaLinkLabel).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
      <label className="flex items-center gap-2 text-sm text-secondary">
        <input name="favorito" type="checkbox" defaultChecked={defaultValues.favorito} className="rounded border-border" />
        Marcar como favorito
      </label>
      <FormFeedback state={state} pending={pending} submitLabel="Guardar cambios" />
    </form>
  );
}

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
    <form action={formAction} className="grid max-w-lg gap-3 sm:grid-cols-2">
      <input name="nombre" required defaultValue={defaultValues.nombre} placeholder="Usuario Ucasal" className={input} />
      <input name="password" type="password" defaultValue={defaultValues.password ?? ""} placeholder="Contraseña" className={input} />
      <input name="emailUcasal" type="email" required defaultValue={defaultValues.emailUcasal} placeholder="email@ucasal.edu.ar" className={`${input} sm:col-span-2`} />
      <input name="carrera" required defaultValue={defaultValues.carrera} className={`${input} sm:col-span-2`} />
      <input name="anioIngreso" type="number" required defaultValue={defaultValues.anioIngreso} className={input} />
      <input name="legajo" defaultValue={defaultValues.legajo ?? ""} placeholder="Legajo (opcional)" className={input} />
      <FormFeedback state={state} pending={pending} submitLabel="Guardar perfil" />
    </form>
  );
}
