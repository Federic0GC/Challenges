import { useCallback, useEffect, useMemo, useState } from 'react';
import type { CoordenadaGeo, PuntoSeguimiento, SesionSeguimiento } from '../utilidades/tipos';
import { guardarSesionActiva, guardarSesiones, obtenerSesionActiva, obtenerSesionesGuardadas } from '../servicios/almacenamiento';

const crearId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

const convertirPunto = (coordenada: CoordenadaGeo): PuntoSeguimiento => ({
  ...coordenada,
  id: crearId(),
});

export const useSeguimiento = () => {
  const [sesiones, setSesiones] = useState<SesionSeguimiento[]>([]);
  const [sesionActiva, setSesionActiva] = useState<SesionSeguimiento | null>(null);

  useEffect(() => {
    setSesiones(obtenerSesionesGuardadas());
    setSesionActiva(obtenerSesionActiva());
  }, []);

  const sincronizarSesiones = useCallback((actualizadas: SesionSeguimiento[]) => {
    setSesiones(actualizadas);
    guardarSesiones(actualizadas);
  }, []);

  const iniciarSeguimiento = useCallback(
    (coordenada?: CoordenadaGeo, direccionInicio?: string) => {
      if (sesionActiva?.activa) {
        return sesionActiva;
      }

      const nuevaSesion: SesionSeguimiento = {
        id: crearId(),
        inicio: new Date().toISOString(),
        activa: true,
        direccionInicio,
        puntos: coordenada ? [convertirPunto(coordenada)] : [],
      };

      setSesionActiva(nuevaSesion);
      guardarSesionActiva(nuevaSesion);
      return nuevaSesion;
    },
    [sesionActiva],
  );

  const agregarPunto = useCallback(
    (coordenada: CoordenadaGeo) => {
      if (!sesionActiva?.activa) {
        return;
      }

      const punto = convertirPunto(coordenada);
      const actualizada = {
        ...sesionActiva,
        puntos: [...sesionActiva.puntos, punto],
      };

      setSesionActiva(actualizada);
      guardarSesionActiva(actualizada);
    },
    [sesionActiva],
  );

  const detenerSeguimiento = useCallback(
    (motivoFin?: string, direccionFin?: string) => {
      if (!sesionActiva) {
        return null;
      }

      const finalizada: SesionSeguimiento = {
        ...sesionActiva,
        activa: false,
        fin: new Date().toISOString(),
        motivoFin,
        direccionFin,
      };

      const actualizadas = sesiones.some((sesion) => sesion.id === finalizada.id)
        ? sesiones.map((sesion) => (sesion.id === finalizada.id ? finalizada : sesion))
        : [finalizada, ...sesiones];

      sincronizarSesiones(actualizadas);
      setSesionActiva(null);
      guardarSesionActiva(null);
      return finalizada;
    },
    [sesionActiva, sesiones, sincronizarSesiones],
  );

  const limpiarHistorial = useCallback(() => {
    sincronizarSesiones([]);
    setSesionActiva(null);
    guardarSesionActiva(null);
  }, [sincronizarSesiones]);

  const totalPuntos = useMemo(() => sesiones.reduce((acumulado, sesion) => acumulado + sesion.puntos.length, 0), [sesiones]);

  return {
    sesiones,
    sesionActiva,
    totalPuntos,
    estaSeguimientoActivo: Boolean(sesionActiva?.activa),
    iniciarSeguimiento,
    agregarPunto,
    detenerSeguimiento,
    limpiarHistorial,
    setSesiones: sincronizarSesiones,
  };
};
