import type { PuntoSeguimiento } from './tipos';

const radioTierraMetros = 6371000;

export const calcularDistanciaMetros = (
  origen: { latitud: number; longitud: number },
  destino: { latitud: number; longitud: number },
): number => {
  const latOrigen = (origen.latitud * Math.PI) / 180;
  const latDestino = (destino.latitud * Math.PI) / 180;
  const deltaLat = ((destino.latitud - origen.latitud) * Math.PI) / 180;
  const deltaLng = ((destino.longitud - origen.longitud) * Math.PI) / 180;

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(latOrigen) * Math.cos(latDestino) * Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return radioTierraMetros * c;
};

export const calcularVelocidadKmh = (anterior: PuntoSeguimiento, actual: PuntoSeguimiento): number => {
  const distancia = calcularDistanciaMetros(anterior, actual);
  const tiempoHoras = (actual.marcaTemporal - anterior.marcaTemporal) / 1000 / 60 / 60;

  if (tiempoHoras <= 0) {
    return 0;
  }

  return distancia / 1000 / tiempoHoras;
};
