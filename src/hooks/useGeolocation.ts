import { Geolocation, Position, PositionOptions } from '@capacitor/geolocation';

type PositionHandler = (position: Position) => void | Promise<void>;
type ErrorHandler = (error: Error) => void | Promise<void>;

const normalizeGeoError = (error: unknown): Error => {
  if (error instanceof Error) {
    const lower = error.message.toLowerCase();
    if (lower.includes('location services are not enabled') || lower.includes('settings') || lower.includes('provider')) {
      return new Error('Activa la ubicacion del telefono');
    }
    if (lower.includes('denied') || lower.includes('permission')) {
      return new Error('Permiso de ubicacion denegado');
    }
    return error;
  }

  if (typeof error === 'string') {
    const lower = error.toLowerCase();
    if (lower.includes('location services are not enabled') || lower.includes('settings') || lower.includes('provider')) {
      return new Error('Activa la ubicacion del telefono');
    }
    if (lower.includes('denied') || lower.includes('permission')) {
      return new Error('Permiso de ubicacion denegado');
    }
    return new Error(error);
  }

  if (typeof error === 'object' && error && 'message' in error) {
    const message = String((error as { message: unknown }).message ?? '');
    const lower = message.toLowerCase();
    if (lower.includes('location services are not enabled') || lower.includes('settings') || lower.includes('provider')) {
      return new Error('Activa la ubicacion del telefono');
    }
    if (lower.includes('denied') || lower.includes('permission')) {
      return new Error('Permiso de ubicacion denegado');
    }
    return new Error(message || 'No se pudo iniciar la geolocalizacion');
  }

  return new Error('No se pudo iniciar la geolocalizacion');
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
