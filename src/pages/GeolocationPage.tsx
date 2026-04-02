import {
  IonButton,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonPage,
  IonSpinner,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { useGeolocation } from '../hooks/useGeolocation';

const GeolocationPage: React.FC = () => {
  const {
    permission,
    currentPosition,
    lastWatchPosition,
    watching,
    loading,
    error,
    getCurrentPosition,
    startWatch,
    stopWatch,
  } = useGeolocation();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Geolocalización</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonButton expand="block" onClick={getCurrentPosition} disabled={loading}>
          {loading ? <IonSpinner name="dots" /> : 'Obtener ubicación actual'}
        </IonButton>

        <IonButton
          expand="block"
          color={watching ? 'danger' : 'primary'}
          onClick={watching ? stopWatch : () => startWatch()}
        >
          {watching ? 'Detener seguimiento' : 'Comenzar seguimiento'}
        </IonButton>

        <IonList>
          <IonItem>
            <IonLabel>Permisos</IonLabel>
            <IonNote slot="end">
              {permission ? JSON.stringify(permission) : 'Desconocido'}
            </IonNote>
          </IonItem>

          {currentPosition && (
            <IonItem>
              <IonLabel>
                <h2>Última ubicación puntual</h2>
                <p>
                  Lat: {currentPosition.coords.latitude.toFixed(5)} - Lng:{' '}
                  {currentPosition.coords.longitude.toFixed(5)}
                </p>
              </IonLabel>
            </IonItem>
          )}

          {lastWatchPosition && (
            <IonItem>
              <IonLabel>
                <h2>Última ubicación por watch</h2>
                <p>
                  Lat: {lastWatchPosition.coords.latitude.toFixed(5)} - Lng:{' '}
                  {lastWatchPosition.coords.longitude.toFixed(5)}
                </p>
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

export default GeolocationPage;
