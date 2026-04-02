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
import { useDevice } from '../hooks/useDevice';

const DevicePage: React.FC = () => {
  const { info, batteryInfo, deviceId, loading, error, loadDeviceData } =
    useDevice();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Información del dispositivo</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonButton expand="block" onClick={loadDeviceData} disabled={loading}>
          {loading ? <IonSpinner name="dots" /> : 'Cargar información del dispositivo'}
        </IonButton>

        <IonList>
          {info && (
            <>
              <IonItem>
                <IonLabel>Modelo</IonLabel>
                <IonNote slot="end">{info.model}</IonNote>
              </IonItem>
              <IonItem>
                <IonLabel>Sistema operativo</IonLabel>
                <IonNote slot="end">
                  {info.platform} {info.osVersion}
                </IonNote>
              </IonItem>
            </>
          )}

          {batteryInfo && (
            <IonItem>
              <IonLabel>Batería</IonLabel>
              <IonNote slot="end">
                {batteryInfo.batteryLevel != null
                  ? `${Math.round(batteryInfo.batteryLevel * 100)}%`
                  : 'Desconocido'}
              </IonNote>
            </IonItem>
          )}

          {deviceId && (
            <IonItem>
              <IonLabel>ID del dispositivo</IonLabel>
              <IonNote slot="end" style={{ whiteSpace: 'normal' }}>
                {deviceId.identifier}
              </IonNote>
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

export default DevicePage;
