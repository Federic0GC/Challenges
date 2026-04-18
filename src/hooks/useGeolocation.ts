import { Geolocation, Position, PositionOptions } from '@capacitor/geolocation';

type PositionHandler = (position: Position) => void | Promise<void>;
type ErrorHandler = (error: Error) => void | Promise<void>;

const normalizeGeoError = (error: unknown): Error => {
  const text = String(error instanceof Error ? error.message : error ?? '').toLowerCase();
  if (text.includes('denied') || text.includes('permission')) {
    return new Error('Permiso de ubicacion denegado');
  }
  if (text.includes('location services are not enabled') || text.includes('provider')) {
    return new Error('Activa la ubicacion del telefono');
  }
  return new Error('No se pudo iniciar geolocalizacion');
};

export const useGeolocation = () => {
  const hasPermission = async () => {
    const status = await Geolocation.checkPermissions();
    return status.location === 'granted' || status.coarseLocation === 'granted';
  };

  const requestPermission = async () => {
    try {
      const status = await Geolocation.requestPermissions();
      const granted = status.location === 'granted' || status.coarseLocation === 'granted';
      if (!granted) {
        throw new Error('Permiso de ubicacion denegado');
      }
    } catch (error) {
      throw normalizeGeoError(error);
    }
  };

  const ensurePermission = async () => {
    try {
      const granted = await hasPermission();
      if (!granted) {
        await requestPermission();
      }
    } catch (error) {
      throw normalizeGeoError(error);
    }
  };

  const getCurrent = async (options?: PositionOptions) => {
    try {
      await ensurePermission();
      return await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
        ...options
      });
    } catch (error) {
      throw normalizeGeoError(error);
    }
  };

  const watch = async (onPosition: PositionHandler, onError?: ErrorHandler, options?: PositionOptions) => {
    try {
      await ensurePermission();
      const watchId = await Geolocation.watchPosition(
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
          ...options
        },
        async (position, err) => {
          if (err) {
            if (onError) {
              await onError(normalizeGeoError(err));
            }
            return;
          }
          if (!position) {
            return;
          }
          await onPosition(position);
        }
      );
      return watchId;
    } catch (error) {
      throw normalizeGeoError(error);
    }
  };

  const clearWatch = async (watchId: string | null) => {
    if (!watchId) {
      return;
    }
    await Geolocation.clearWatch({ id: watchId });
  };

  return {
    requestPermission,
    ensurePermission,
    getCurrent,
    watch,
    clearWatch
  };
};
