import { useCallback, useEffect, useRef, useState } from 'react';
import { Geolocation } from '@capacitor/geolocation';
import type { CoordenadaGeo } from '../utilidades/tipos';

type PosicionGeolocalizacion = {
  coords: {
    latitude: number;
    longitude: number;
    accuracy: number;
    speed: number | null;
    altitude: number | null;
  };
  timestamp: number;
};

const convertirPosicion = (posicion: PosicionGeolocalizacion): CoordenadaGeo => ({
  latitud: posicion.coords.latitude,
  longitud: posicion.coords.longitude,
  precision: posicion.coords.accuracy,
  velocidadMetrosSegundo: posicion.coords.speed,
  altitud: posicion.coords.altitude,
  marcaTemporal: posicion.timestamp,
});

export const useGeolocalizacion = () => {
  const [posicion, setPosicion] = useState<CoordenadaGeo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);
  const [observando, setObservando] = useState(false);
  const idObservacion = useRef<string | undefined>(undefined);

  const solicitarPermisoUbicacion = useCallback(async (): Promise<boolean> => {
    try {
      const permisosActuales = await Geolocation.checkPermissions();
      if (permisosActuales.location === 'granted' || permisosActuales.coarseLocation === 'granted') {
        return true;
      }

      const permisosSolicitados = await Geolocation.requestPermissions({ permissions: ['location', 'coarseLocation'] });
      if (permisosSolicitados.location === 'granted' || permisosSolicitados.coarseLocation === 'granted') {
        return true;
      }

      setError('Permiso de ubicación denegado. Habilítalo en ajustes de Android para continuar.');
      return false;
    } catch {
      setError('No fue posible solicitar permisos de ubicación. Revisa los ajustes del dispositivo.');
      return false;
    }
  }, []);

  const obtenerPosicionActual = useCallback(async () => {
    setCargando(true);
    setError(null);

    try {
      const permitido = await solicitarPermisoUbicacion();
      if (!permitido) {
        return null;
      }

      const respuesta = await Geolocation.getCurrentPosition({ enableHighAccuracy: true, timeout: 12000 });
      const nuevaPosicion = convertirPosicion(respuesta);
      setPosicion(nuevaPosicion);
      return nuevaPosicion;
    } catch (fallo) {
      const mensajeBase = fallo instanceof Error ? fallo.message : 'No fue posible obtener la ubicación';
      const mensaje = /permission|denied|not authorized/i.test(mensajeBase)
        ? 'Sin permiso de ubicación. Ve a Ajustes > Apps > Challenge-08 > Permisos y habilita Ubicación.'
        : mensajeBase;
      setError(mensaje);
      return null;
    } finally {
      setCargando(false);
    }
  }, [solicitarPermisoUbicacion]);

  const iniciarObservacion = useCallback(async () => {
    if (idObservacion.current) {
      return;
    }

    setError(null);

    const permitido = await solicitarPermisoUbicacion();
    if (!permitido) {
      return;
    }

    try {
      idObservacion.current = await Geolocation.watchPosition(
        { enableHighAccuracy: true, timeout: 15000 },
        (resultado) => {
          if (!resultado) {
            return;
          }

          const posicionActual = resultado as PosicionGeolocalizacion;
          setPosicion({
            latitud: posicionActual.coords.latitude,
            longitud: posicionActual.coords.longitude,
            precision: posicionActual.coords.accuracy,
            velocidadMetrosSegundo: posicionActual.coords.speed,
            altitud: posicionActual.coords.altitude,
            marcaTemporal: posicionActual.timestamp,
          });
        },
      );

      setObservando(true);
    } catch {
      setError('No se pudo iniciar el seguimiento de ubicación. Verifica permisos y GPS activo.');
    }
  }, [solicitarPermisoUbicacion]);

  const detenerObservacion = useCallback(async () => {
    if (!idObservacion.current) {
      return;
    }

    await Geolocation.clearWatch({ id: idObservacion.current });
    idObservacion.current = undefined;
    setObservando(false);
  }, []);

  useEffect(() => {
    void obtenerPosicionActual();
    void iniciarObservacion();

    return () => {
      void detenerObservacion();
    };
  }, [detenerObservacion, iniciarObservacion, obtenerPosicionActual]);

  return {
    posicion,
    error,
    cargando,
    observando,
    obtenerPosicionActual,
    iniciarObservacion,
    detenerObservacion,
    setPosicion,
  };
};
