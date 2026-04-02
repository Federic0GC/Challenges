import { useCallback, useEffect, useState } from 'react';
import { Geolocation, Position, PermissionStatus } from '@capacitor/geolocation';

export interface UseGeolocationResult {
  permission: PermissionStatus | null;
  currentPosition: Position | null;
  lastWatchPosition: Position | null;
  watching: boolean;
  loading: boolean;
  error: string | null;
  getCurrentPosition: () => Promise<void>;
  startWatch: (options?: any) => Promise<void>;
  stopWatch: () => Promise<void>;
}

export const useGeolocation = (): UseGeolocationResult => {
  const [permission, setPermission] = useState<PermissionStatus | null>(null);
  const [currentPosition, setCurrentPosition] = useState<Position | null>(null);
  const [lastWatchPosition, setLastWatchPosition] = useState<Position | null>(
    null
  );
  const [watchId, setWatchId] = useState<string | null>(null);
  const [watching, setWatching] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkPermission = useCallback(async () => {
    try {
      const status = await Geolocation.checkPermissions();
      setPermission(status);
    } catch (err) {
      setError((err as Error).message);
    }
  }, []);

  const getCurrentPositionFn = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const position = await Geolocation.getCurrentPosition();
      setCurrentPosition(position);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  const startWatchFn = useCallback(
    async (options?: any) => {
      setError(null);
      if (watchId) {
        return;
      }

      const id = await Geolocation.watchPosition(options ?? {}, (position, err) => {
        if (err) {
          setError(String(err));
          return;
        }
        if (position) {
          setLastWatchPosition(position);
        }
      });
      setWatchId(id);
      setWatching(true);
    },
    [watchId]
  );

  const stopWatchFn = useCallback(async () => {
    if (!watchId) return;
    await Geolocation.clearWatch({ id: watchId });
    setWatchId(null);
    setWatching(false);
  }, [watchId]);

  useEffect(() => {
    checkPermission();
    return () => {
      if (watchId) {
        Geolocation.clearWatch({ id: watchId }).catch(() => undefined);
      }
    };
  }, [checkPermission, watchId]);

  return {
    permission,
    currentPosition,
    lastWatchPosition,
    watching,
    loading,
    error,
    getCurrentPosition: getCurrentPositionFn,
    startWatch: startWatchFn,
    stopWatch: stopWatchFn,
  };
};
