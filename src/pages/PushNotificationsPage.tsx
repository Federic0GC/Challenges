import {
  IonButton,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonPage,
  IonTitle,
  IonToolbar,
  IonSpinner,
} from '@ionic/react';
import { usePushNotifications } from '../hooks/usePushNotifications';

const PushNotificationsPage: React.FC = () => {
  const {
    permission,
    token,
    notifications,
    lastAction,
    registering,
    error,
    register,
    clearNotifications,
  } = usePushNotifications();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Push Notifications</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonButton expand="block" onClick={register} disabled={registering}>
          {registering ? <IonSpinner name="dots" /> : 'Registrar dispositivo'}
        </IonButton>

        <IonButton expand="block" color="medium" onClick={clearNotifications}>
          Limpiar notificaciones en memoria
        </IonButton>

        <IonList>
          <IonItem>
            <IonLabel>Permisos</IonLabel>
            <IonNote slot="end">
              {permission ? JSON.stringify(permission) : 'Desconocido'}
            </IonNote>
          </IonItem>

          {token && (
            <IonItem>
              <IonLabel>
                <h2>Token</h2>
                <p style={{ wordBreak: 'break-all' }}>{token.value}</p>
              </IonLabel>
            </IonItem>
          )}

          {notifications.map((n) => (
            <IonItem key={n.id}>
              <IonLabel>
                <h2>{n.title}</h2>
                <p>{n.body}</p>
              </IonLabel>
            </IonItem>
          ))}

          {lastAction && (
            <IonItem>
              <IonLabel>
                <h2>Última acción</h2>
                <p>{JSON.stringify(lastAction)}</p>
              </IonLabel>
            </IonItem>
          )}

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

export default PushNotificationsPage;
