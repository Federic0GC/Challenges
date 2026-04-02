import { useCallback, useState } from 'react';
import {
  Haptics,
  ImpactStyle,
} from '@capacitor/haptics';

export interface UseHapticsResult {
  lastAction: string | null;
  error: string | null;
  impactLight: () => Promise<void>;
  impactMedium: () => Promise<void>;
  impactHeavy: () => Promise<void>;
  vibrate: () => Promise<void>;
}

export const useHaptics = (): UseHapticsResult => {
  const [lastAction, setLastAction] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const impact = useCallback(async (style: ImpactStyle, label: string) => {
    setError(null);
    try {
      await Haptics.impact({ style });
      setLastAction(label);
    } catch (err) {
      setError((err as Error).message);
    }
  }, []);

  const impactLight = useCallback(
    () => impact(ImpactStyle.Light, 'Impacto ligero'),
    [impact]
  );

  const impactMedium = useCallback(
    () => impact(ImpactStyle.Medium, 'Impacto medio'),
    [impact]
  );

  const impactHeavy = useCallback(
    () => impact(ImpactStyle.Heavy, 'Impacto fuerte'),
    [impact]
  );

  const vibrate = useCallback(async () => {
    setError(null);
    try {
      await Haptics.vibrate();
      setLastAction('Vibración');
    } catch (err) {
      setError((err as Error).message);
    }
  }, []);

  return {
    lastAction,
    error,
    impactLight,
    impactMedium,
    impactHeavy,
    vibrate,
  };
};
