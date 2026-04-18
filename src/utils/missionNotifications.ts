import { LocalNotifications } from '@capacitor/local-notifications';

export const requestMissionNotificationPermission = async () => {
  await LocalNotifications.requestPermissions();
};

export const notifyMissionProgress = async (title: string, remaining: number) => {
  await LocalNotifications.schedule({
    notifications: [
      {
        id: Date.now() % 1000000,
        title: 'Has completado una mision',
        body: `${title} completada`
      }
    ]
  });

  if (remaining === 1) {
    await LocalNotifications.schedule({
      notifications: [
        {
          id: (Date.now() + 1) % 1000000,
          title: 'Te falta 1 mision para completar',
          body: 'Ya casi terminas todas las misiones'
        }
      ]
    });
  }

  if (remaining === 0) {
    await LocalNotifications.schedule({
      notifications: [
        {
          id: (Date.now() + 2) % 1000000,
          title: 'Completaste todas las misiones',
          body: 'Excelente, terminaste todos los retos'
        }
      ]
    });
  }
};
