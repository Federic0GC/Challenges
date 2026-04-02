import { useCallback, useEffect, useState } from 'react';
import {
  LocalNotifications,
  PermissionStatus,
  PendingLocalNotificationSchema,
} from '@capacitor/local-notifications';

export interface UseLocalNotificationsResult {
  permission: PermissionStatus | null;
  pending: PendingLocalNotificationSchema[];
  requesting: boolean;
  scheduling: boolean;
  error: string | null;
  requestPermission: () => Promise<void>;
  scheduleTestNotification: () => Promise<void>;
  cancelAll: () => Promise<void>;
  refreshPending: () => Promise<void>;
}

export const useLocalNotifications = (): UseLocalNotificationsResult => {
  const [permission, setPermission] = useState<PermissionStatus | null>(null);
  const [pending, setPending] = useState<PendingLocalNotificationSchema[]>([]);
  const [requesting, setRequesting] = useState(false);
  const [scheduling, setScheduling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPermission = useCallback(async () => {
    try {
      const status = await LocalNotifications.checkPermissions();
      setPermission(status);
    } catch (err) {
      setError((err as Error).message);
    }
  }, []);

  const refreshPending = useCallback(async () => {
    try {
      const result = await LocalNotifications.getPending();
      setPending(result.notifications);
    } catch (err) {
      setError((err as Error).message);
    }
  }, []);

  const requestPermission = useCallback(async () => {
    setRequesting(true);
    setError(null);
    try {
      const status = await LocalNotifications.requestPermissions();
      setPermission(status);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setRequesting(false);
    }
  }, []);

  const scheduleTestNotification = useCallback(async () => {
    setScheduling(true);
    setError(null);
    try {
      await LocalNotifications.schedule({
        notifications: [
          {
            // En Android el id debe ser un int Java. Para el ejemplo usamos 1.
            id: 1,
            title: 'Local Notification',
            body: 'Hola desde Local Notifications!',
            schedule: { at: new Date(Date.now() + 3000) },
          },
        ],
      });
      await refreshPending();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setScheduling(false);
    }
  }, [refreshPending]);

  const cancelAll = useCallback(async () => {
    setError(null);
    try {
      await LocalNotifications.cancel({ notifications: [] });
      await refreshPending();
    } catch (err) {
      setError((err as Error).message);
    }
  }, [refreshPending]);

  useEffect(() => {
    loadPermission();
    refreshPending();
  }, [loadPermission, refreshPending]);

  return {
    permission,
    pending,
    requesting,
    scheduling,
    error,
    requestPermission,
    scheduleTestNotification,
    cancelAll,
    refreshPending,
  };
};
