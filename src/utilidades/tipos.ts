export interface CoordenadaGeo {
  latitud: number;
  longitud: number;
  precision?: number;
  velocidadMetrosSegundo?: number | null;
  altitud?: number | null;
  marcaTemporal: number;
}

export interface PuntoSeguimiento extends CoordenadaGeo {
  id: string;
}

export interface SesionSeguimiento {
  id: string;
  inicio: string;
  fin?: string;
  activa: boolean;
  motivoFin?: string;
  direccionInicio?: string;
  direccionFin?: string;
  puntos: PuntoSeguimiento[];
}

export interface DireccionActual {
  texto: string;
  ciudad?: string;
  pais?: string;
}

export interface LugarCercano {
  id: string;
  nombre: string;
  categoria: string;
  descripcion?: string;
  fuente?: 'api' | 'fallback';
  latitud: number;
  longitud: number;
  distanciaMetros: number;
}

export interface EstadoRedMovil {
  conectado: boolean;
  tipo: string;
  wifi: boolean;
}

export interface EstadoBateria {
  nivel: number;
  cargando: boolean;
}

export interface ImagenConMarca {
  dataUrl: string;
  latitud: number;
  longitud: number;
  fecha: string;
}
