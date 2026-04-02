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
import { useHaptics } from '../hooks/useHaptics';

const HapticsPage: React.FC = () => {
  const { lastAction, error, impactLight, impactMedium, impactHeavy, vibrate } =
    useHaptics();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Haptics / Vibración</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonButton expand="block" onClick={impactLight}>
          Impacto ligero
        </IonButton>
        <IonButton expand="block" color="secondary" onClick={impactMedium}>
          Impacto medio
        </IonButton>
        <IonButton expand="block" color="tertiary" onClick={impactHeavy}>
          Impacto fuerte
        </IonButton>
        <IonButton expand="block" color="medium" onClick={vibrate}>
          Vibrar
        </IonButton>

        <IonList>
          {lastAction && (
            <IonItem>
              <IonLabel>Última acción: {lastAction}</IonLabel>
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

export default HapticsPage;
