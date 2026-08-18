export type UniversidadEstado = "activa" | "en_construccion";

export type UniversidadNovedad = {
  fecha: string;
  titulo: string;
  cuerpo: string;
};

export type UniversidadCatalogo = {
  slug: string;
  nombre: string;
  nombreCorto: string;
  estado: UniversidadEstado;
  tagline: string;
  descripcion: string;
  sitioOficial?: string;
  novedades: UniversidadNovedad[];
};
