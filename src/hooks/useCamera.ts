import { useCallback, useState } from 'react';
import {
  Camera,
  CameraPhoto,
  CameraResultType,
  CameraSource,
} from '@capacitor/camera';

export interface UseCameraResult {
  photo: CameraPhoto | null;
  taking: boolean;
  error: string | null;
  takePhoto: () => Promise<void>;
}

export const useCamera = (): UseCameraResult => {
  const [photo, setPhoto] = useState<CameraPhoto | null>(null);
  const [taking, setTaking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const takePhoto = useCallback(async () => {
    setTaking(true);
    setError(null);
    try {
      const result = await Camera.getPhoto({
        resultType: CameraResultType.Uri,
        source: CameraSource.Prompt,
        quality: 80,
      });
      setPhoto(result);
    } catch (err) {
      // Si el usuario cancela, normalmente se lanza un error; lo tratamos de forma amigable
      setError((err as Error).message);
    } finally {
      setTaking(false);
    }
  }, []);

  return {
    photo,
    taking,
    error,
    takePhoto,
  };
};
