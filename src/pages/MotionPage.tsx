import {
  IonButton,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { useAccelerometer } from '../hooks/useAccelerometer';

const MotionPage: React.FC = () => {
  const { accel, orientation, listening, error, start, stop } =
    useAccelerometer();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Movimiento</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonButton
          expand="block"
          color={listening ? 'danger' : 'primary'}
          onClick={listening ? stop : start}
        >
          {listening ? 'Detener sensores' : 'Iniciar sensores'}
        </IonButton>

        <IonList>
          {accel && (
            <IonItem>
              <IonLabel>
                <h2>Acelerómetro</h2>
                <p>
                  x: {accel.acceleration.x?.toFixed(2)} | y:{' '}
                  {accel.acceleration.y?.toFixed(2)} | z:{' '}
                  {accel.acceleration.z?.toFixed(2)}
                </p>
              </IonLabel>
            </IonItem>
          )}

          {orientation && (
            <IonItem>
              <IonLabel>
                <h2>Orientación</h2>
                <p>
                  alpha: {orientation.alpha?.toFixed(2)} | beta:{' '}
                  {orientation.beta?.toFixed(2)} | gamma:{' '}
                  {orientation.gamma?.toFixed(2)}
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

export default MotionPage;
