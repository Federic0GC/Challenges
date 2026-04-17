import type { DireccionActual } from '../utilidades/tipos';

const claveOpenCage = import.meta.env.VITE_OPENCAGE_API_KEY as string | undefined;

const construirDireccion = (respuesta: Record<string, unknown>): DireccionActual => {
  const componentes = (respuesta.components as Record<string, string> | undefined) ?? {};
  const texto =
    (respuesta.formatted as string | undefined) ??
    [componentes.road, componentes.suburb, componentes.city, componentes.country].filter(Boolean).join(', ');

  return {
    texto: texto || 'Dirección no disponible',
    ciudad: componentes.city || componentes.town || componentes.village,
    pais: componentes.country,
  };
};

export const obtenerDireccionActual = async (latitud: number, longitud: number): Promise<DireccionActual> => {
  if (claveOpenCage) {
    const respuesta = await fetch(
      `https://api.opencagedata.com/geocode/v1/json?q=${latitud}+${longitud}&key=${claveOpenCage}&language=es&pretty=1`,
    );

    if (respuesta.ok) {
      const datos = (await respuesta.json()) as { results?: Array<Record<string, unknown>> };
      const primerResultado = datos.results?.[0];
      if (primerResultado) {
        return construirDireccion(primerResultado);
      }
    }
  }

  const respuestaAlternativa = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitud}&lon=${longitud}&accept-language=es`,
  );

  if (!respuestaAlternativa.ok) {
    return { texto: 'No fue posible obtener la dirección' };
  }

  const datos = (await respuestaAlternativa.json()) as Record<string, unknown>;
  const direccion = (datos.address as Record<string, string> | undefined) ?? {};

  return {
    texto: (datos.display_name as string | undefined) ?? 'Dirección no disponible',
    ciudad: direccion.city || direccion.town || direccion.village,
    pais: direccion.country,
  };
};
