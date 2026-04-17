import type { LugarCercano } from '../utilidades/tipos';
import { calcularDistanciaMetros } from '../utilidades/geometria';

const categoriasConsulta = ['amenity', 'tourism', 'shop', 'leisure', 'historic', 'public_transport', 'healthcare', 'office', 'building'];

const nombresCategoria: Record<string, string> = {
  doctors: 'Consultorio médico',
  hospital: 'Hospital',
  clinic: 'Clínica',
  pharmacy: 'Farmacia',
  dentist: 'Odontología',
  cafe: 'Cafetería',
  restaurant: 'Restaurante',
  fast_food: 'Comida rápida',
  bar: 'Bar',
  bank: 'Banco',
  atm: 'Cajero automático',
  parking: 'Parqueadero',
  park: 'Parque',
  supermarket: 'Supermercado',
  convenience: 'Tienda',
  school: 'Escuela',
  university: 'Universidad',
  bus_stop: 'Paradero',
  station: 'Estación',
  hotel: 'Hotel',
  museum: 'Museo',
  cinema: 'Cine',
  mall: 'Centro comercial',
  yes: 'Lugar de interés',
};

const tituloDesdeCategoria = (tags: Record<string, string>): string => {
  for (const clave of categoriasConsulta) {
    const valor = tags[clave];
    if (valor) {
      return nombresCategoria[valor] ?? valor.replaceAll('_', ' ');
    }
  }

  const etiquetaGenerica = tags.amenity ?? tags.shop ?? tags.tourism ?? tags.leisure ?? tags.historic ?? tags.public_transport;
  return (etiquetaGenerica && nombresCategoria[etiquetaGenerica]) || 'Lugar cercano';
};

const descripcionDesdeTags = (tags: Record<string, string>): string | undefined => {
  const partes = [tags.brand, tags.operator, tags.official_name, tags.short_name].filter(Boolean);
  if (partes.length > 0) {
    return partes.join(' · ');
  }

  if (tags.addr_street || tags.addr_housenumber) {
    return [tags.addr_street, tags.addr_housenumber].filter(Boolean).join(' ');
  }

  return undefined;
};

const endpointsOverpass = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
  'https://overpass.openstreetmap.ru/api/interpreter',
];

const generadoresFallback = [
  { nombre: 'Cafetería cercana', categoria: 'cafe', latitudOffset: 0.0012, longitudOffset: 0.0006 },
  { nombre: 'Farmacia cercana', categoria: 'pharmacy', latitudOffset: -0.0008, longitudOffset: 0.0009 },
  { nombre: 'Parque cercano', categoria: 'park', latitudOffset: 0.0015, longitudOffset: -0.001 },
  { nombre: 'Restaurante cercano', categoria: 'restaurant', latitudOffset: -0.0011, longitudOffset: -0.0007 },
  { nombre: 'Paradero cercano', categoria: 'bus_stop', latitudOffset: 0.0007, longitudOffset: 0.0014 },
];

const crearFallback = (latitud: number, longitud: number): LugarCercano[] =>
  generadoresFallback.map((item, indice) => {
    const lat = latitud + item.latitudOffset;
    const lng = longitud + item.longitudOffset;

    return {
      id: `fallback-${indice}-${item.nombre}`,
      nombre: item.nombre,
      categoria: item.categoria,
      descripcion: 'Sugerencia local generada',
      fuente: 'fallback',
      latitud: lat,
      longitud: lng,
      distanciaMetros: calcularDistanciaMetros(
        { latitud, longitud },
        { latitud: lat, longitud: lng },
      ),
    } satisfies LugarCercano;
  });

export const obtenerLugaresCercanos = async (
  latitud: number,
  longitud: number,
  radioMetros = 1200,
): Promise<LugarCercano[]> => {
  const query = `
    [out:json][timeout:25];
    (
      nwr(around:${radioMetros},${latitud},${longitud})[amenity];
      nwr(around:${radioMetros},${latitud},${longitud})[tourism];
      nwr(around:${radioMetros},${latitud},${longitud})[shop];
      nwr(around:${radioMetros},${latitud},${longitud})[leisure];
      nwr(around:${radioMetros},${latitud},${longitud})[historic];
      nwr(around:${radioMetros},${latitud},${longitud})[public_transport];
      nwr(around:${radioMetros},${latitud},${longitud})[healthcare];
      nwr(around:${radioMetros},${latitud},${longitud})[office];
      nwr(around:${radioMetros},${latitud},${longitud})[building];
      nwr(around:${radioMetros},${latitud},${longitud})[name];
    );
    out center 40;
  `;

  const obtenerDatos = async (): Promise<{ elements?: Array<Record<string, unknown>> } | null> => {
    for (const endpoint of endpointsOverpass) {
      try {
        const controlador = new AbortController();
        const tiempo = window.setTimeout(() => controlador.abort(), 12000);
        const respuesta = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
          },
          body: `data=${encodeURIComponent(query)}`,
          signal: controlador.signal,
        });
        window.clearTimeout(tiempo);

        if (!respuesta.ok) {
          continue;
        }

        const datos = (await respuesta.json()) as { elements?: Array<Record<string, unknown>> };
        if ((datos.elements?.length ?? 0) > 0) {
          return datos;
        }
      } catch {
        continue;
      }
    }

    return null;
  };

  const datos = await obtenerDatos();
  if (!datos) {
    return crearFallback(latitud, longitud);
  }

  const lugaresMapeados = (datos.elements ?? [])
    .map((elemento, indice) => {
      const lat = (elemento.lat as number | undefined) ?? (elemento.center as { lat?: number } | undefined)?.lat;
      const lng = (elemento.lon as number | undefined) ?? (elemento.center as { lon?: number } | undefined)?.lon;
      const tags = (elemento.tags as Record<string, string> | undefined) ?? {};

      if (typeof lat !== 'number' || typeof lng !== 'number') {
        return null;
      }

      const nombre = tags.name?.trim() || tituloDesdeCategoria(tags);
      const categoria = categoriasConsulta.find((valor) => tags[valor]) ?? 'lugar';
      const distanciaMetros = calcularDistanciaMetros(
        { latitud, longitud },
        { latitud: lat, longitud: lng },
      );

      const lugar: LugarCercano = {
        id: `${nombre}-${indice}`,
        nombre,
        categoria: tags[categoria] ?? categoria,
        descripcion: descripcionDesdeTags(tags),
        fuente: 'api',
        latitud: lat,
        longitud: lng,
        distanciaMetros,
      };

      return lugar;
    })
    .filter((valor): valor is LugarCercano => valor !== null);

  const sinDuplicados = lugaresMapeados.filter((lugar, indice, lista) => {
    const clave = `${lugar.nombre}-${lugar.latitud.toFixed(5)}-${lugar.longitud.toFixed(5)}`;
    return indice === lista.findIndex((otro) => `${otro.nombre}-${otro.latitud.toFixed(5)}-${otro.longitud.toFixed(5)}` === clave);
  });

  const lugares = sinDuplicados.sort((a, b) => a.distanciaMetros - b.distanciaMetros).slice(0, 8);

  return lugares.length > 0 ? lugares : crearFallback(latitud, longitud);
};
