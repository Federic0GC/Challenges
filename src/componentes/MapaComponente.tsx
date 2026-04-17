import { useEffect, useMemo } from 'react';
import L from 'leaflet';
import { MapContainer, Marker, Polyline, Popup, TileLayer, useMap } from 'react-leaflet';
import type { CoordenadaGeo, PuntoSeguimiento } from '../utilidades/tipos';

delete (L.Icon.Default.prototype as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: new URL('leaflet/dist/images/marker-icon-2x.png', import.meta.url).href,
  iconUrl: new URL('leaflet/dist/images/marker-icon.png', import.meta.url).href,
  shadowUrl: new URL('leaflet/dist/images/marker-shadow.png', import.meta.url).href,
});

const EnfocarMapa = ({ centro }: { centro: [number, number] }) => {
  const mapa = useMap();

  useEffect(() => {
    mapa.setView(centro, Math.max(mapa.getZoom(), 15), { animate: true });
    window.setTimeout(() => {
      mapa.invalidateSize();
    }, 50);
  }, [centro, mapa]);

  return null;
};

interface MapaComponenteProps {
  posicion?: CoordenadaGeo | null;
  ruta?: PuntoSeguimiento[];
  altura?: number;
}

export default function MapaComponente({ posicion, ruta = [], altura = 360 }: MapaComponenteProps) {
  const centro = useMemo<[number, number]>(() => {
    if (posicion) {
      return [posicion.latitud, posicion.longitud];
    }

    const primerPunto = ruta[0];
    if (primerPunto) {
      return [primerPunto.latitud, primerPunto.longitud];
    }

    return [40.4168, -3.7038];
  }, [posicion, ruta]);

  return (
    <div className="mapa-externo" style={{ height: altura }}>
      <MapContainer center={centro} zoom={15} scrollWheelZoom className="mapa-contenedor">
        <EnfocarMapa centro={centro} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {posicion ? (
          <Marker position={[posicion.latitud, posicion.longitud]}>
            <Popup>
              <strong>Posición actual</strong>
              <br />
              {posicion.latitud.toFixed(6)}, {posicion.longitud.toFixed(6)}
            </Popup>
          </Marker>
        ) : null}

        {ruta.length > 1 ? <Polyline positions={ruta.map((punto) => [punto.latitud, punto.longitud])} pathOptions={{ color: '#f97316', weight: 4 }} /> : null}

        {ruta.map((punto) => (
          <Marker key={punto.id} position={[punto.latitud, punto.longitud]}>
            <Popup>
              <strong>Punto guardado</strong>
              <br />
              {new Date(punto.marcaTemporal).toLocaleString('es-ES')}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
