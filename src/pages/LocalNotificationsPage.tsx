import {
  IonButton,
  IonContent,
  IonHeader,
  IonList,
  IonItem,
  IonLabel,
  IonNote,
  IonPage,
  IonTitle,
  IonToolbar,
  IonSpinner,
} from '@ionic/react';
import { useLocalNotifications } from '../hooks/useLocalNotifications';

const LocalNotificationsPage: React.FC = () => {
  const {
    permission,
    pending,
    requesting,
    scheduling,
    error,
    requestPermission,
    scheduleTestNotification,
    cancelAll,
  } = useLocalNotifications();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Local Notifications</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonButton expand="block" onClick={requestPermission} disabled={requesting}>
          {requesting ? <IonSpinner name="dots" /> : 'Solicitar permisos'}
        </IonButton>

        <IonButton
          expand="block"
          color="primary"
          onClick={scheduleTestNotification}
          disabled={scheduling}
        >
          {scheduling ? <IonSpinner name="dots" /> : 'Programar notificación de prueba'}
        </IonButton>

        <IonButton expand="block" color="medium" onClick={cancelAll}>
          Cancelar todas
        </IonButton>

        <IonList>
          <IonItem>
            <IonLabel>Estado de permisos</IonLabel>
            <IonNote slot="end">
              {permission ? JSON.stringify(permission) : 'Desconocido'}
            </IonNote>
          </IonItem>

          {pending.map((n) => (
            <IonItem key={n.id}>
              <IonLabel>
                <h2>{n.title}</h2>
                <p>{n.body}</p>
              </IonLabel>
            </IonItem>
          ))}

          {error && (
            <IonItem color="danger">
              <IonLabel>{error}</IonLabel>
            </IonItem>
          )}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default LocalNotificationsPage;
