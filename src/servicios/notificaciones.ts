import { LocalNotifications } from '@capacitor/local-notifications';

export const solicitarPermisoNotificaciones = async (): Promise<void> => {
  await LocalNotifications.requestPermissions();
};

export const notificar = async (titulo: string, cuerpo: string): Promise<void> => {
  try {
    await LocalNotifications.schedule({
      notifications: [
        {
          id: Date.now() % 100000,
          title: titulo,
          body: cuerpo,
          schedule: { at: new Date(Date.now() + 250) },
        },
      ],
    });
  } catch {}
};
