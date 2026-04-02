import { useCallback, useEffect, useState } from 'react';
import {
  PushNotifications,
  Token,
  PushNotificationSchema,
  ActionPerformed,
  PermissionStatus,
} from '@capacitor/push-notifications';

export interface UsePushNotificationsResult {
  permission: PermissionStatus | null;
  token: Token | null;
  notifications: PushNotificationSchema[];
  lastAction: ActionPerformed | null;
  registering: boolean;
  error: string | null;
  register: () => Promise<void>;
  clearNotifications: () => void;
}

export const usePushNotifications = (): UsePushNotificationsResult => {
  const [permission, setPermission] = useState<PermissionStatus | null>(null);
  const [token, setToken] = useState<Token | null>(null);
  const [notifications, setNotifications] = useState<PushNotificationSchema[]>(
    []
  );
  const [lastAction, setLastAction] = useState<ActionPerformed | null>(null);
  const [registering, setRegistering] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register = useCallback(async () => {
    setRegistering(true);
    setError(null);
    try {
      const permStatus = await PushNotifications.requestPermissions();
      setPermission(permStatus);

      if (permStatus.receive === 'granted') {
        await PushNotifications.register();
      } else {
        setError('Permiso de push denegado');
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setRegistering(false);
    }
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
    setLastAction(null);
  }, []);

  useEffect(() => {
    PushNotifications.checkPermissions()
      .then(setPermission)
      .catch((err) => setError((err as Error).message));

    const regListener = PushNotifications.addListener(
      'registration',
      (t: Token) => {
        setToken(t);
      }
    );

    const regErrorListener = PushNotifications.addListener(
      'registrationError',
      (err) => {
        setError(JSON.stringify(err));
      }
    );

    const receivedListener = PushNotifications.addListener(
      'pushNotificationReceived',
      (notification: PushNotificationSchema) => {
        setNotifications((current) => [...current, notification]);
      }
    );

    const actionListener = PushNotifications.addListener(
      'pushNotificationActionPerformed',
      (action: ActionPerformed) => {
        setLastAction(action);
      }
    );

    return () => {
      regListener.then((l) => l.remove());
      regErrorListener.then((l) => l.remove());
      receivedListener.then((l) => l.remove());
      actionListener.then((l) => l.remove());
    };
  }, []);

  return {
    permission,
    token,
    notifications,
    lastAction,
    registering,
    error,
    register,
    clearNotifications,
  };
};
