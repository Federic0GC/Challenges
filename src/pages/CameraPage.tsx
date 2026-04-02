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
import { useCamera } from '../hooks/useCamera';

const CameraPage: React.FC = () => {
  const { photo, taking, error, takePhoto } = useCamera();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Cámara</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonButton expand="block" onClick={takePhoto} disabled={taking}>
          {taking ? <IonSpinner name="dots" /> : 'Tomar foto'}
        </IonButton>

        <IonList>
          {photo && (
            <IonItem>
              <IonLabel>
                <h2>Foto tomada</h2>
              </IonLabel>
              <IonNote slot="end">{photo.format}</IonNote>
            </IonItem>
          )}

          {error && (
            <IonItem color="danger">
              <IonLabel>{error}</IonLabel>
            </IonItem>
          )}
        </IonList>

        {photo?.webPath && (
          <img
            src={photo.webPath}
            alt="Foto tomada"
            style={{ width: '100%', marginTop: 16, borderRadius: 8 }}
          />
        )}
      </IonContent>
    </IonPage>
  );
};

export default CameraPage;
