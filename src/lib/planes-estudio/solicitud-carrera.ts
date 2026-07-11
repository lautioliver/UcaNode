/**
 * Formulario para solicitar nuevas carreras/planes de estudio.
 * Crear el form en Google Forms y pegar la URL pública acá.
 */
export const CARRERA_SOLICITUD_FORM_URL =
  process.env.NEXT_PUBLIC_CARRERA_SOLICITUD_FORM_URL ?? "";

export function carreraSolicitudFormDisponible(): boolean {
  return CARRERA_SOLICITUD_FORM_URL.length > 0;
}
