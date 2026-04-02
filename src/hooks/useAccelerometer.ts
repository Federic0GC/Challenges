import { useCallback, useEffect, useState } from 'react';
import {
  Motion,
  AccelListenerEvent,
  OrientationListenerEvent,
} from '@capacitor/motion';

export interface UseAccelerometerResult {
  accel: AccelListenerEvent | null;
  orientation: OrientationListenerEvent | null;
  listening: boolean;
  error: string | null;
  start: () => Promise<void>;
  stop: () => Promise<void>;
}

export const useAccelerometer = (): UseAccelerometerResult => {
  const [accel, setAccel] = useState<AccelListenerEvent | null>(null);
  const [orientation, setOrientation] =
    useState<OrientationListenerEvent | null>(null);
  const [listening, setListening] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [accelListenerAdded, setAccelListenerAdded] = useState(false);
  const [orientationListenerAdded, setOrientationListenerAdded] =
    useState(false);

  const start = useCallback(async () => {
    if (listening) return;
    setError(null);

    try {
      await Motion.addListener('accel', (event) => {
        setAccel(event);
      });
      setAccelListenerAdded(true);

      await Motion.addListener('orientation', (event) => {
        setOrientation(event);
      });
      setOrientationListenerAdded(true);

      setListening(true);
    } catch (err) {
      setError((err as Error).message);
    }
  }, [listening]);

  const stop = useCallback(async () => {
    try {
      await Motion.removeAllListeners();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setListening(false);
      setAccelListenerAdded(false);
      setOrientationListenerAdded(false);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (accelListenerAdded || orientationListenerAdded) {
        Motion.removeAllListeners().catch(() => undefined);
      }
    };
  }, [accelListenerAdded, orientationListenerAdded]);

  return {
    accel,
    orientation,
    listening,
    error,
    start,
    stop,
  };
};
