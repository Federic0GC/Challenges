import {
  IonButton,
  IonContent,
  IonHeader,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar
} from '@ionic/react';
import { useApp } from '../context/AppContext';

const ResultsPage = () => {
  const { points, completedCount, missions, progressPercent } = useApp();

  const stateText =
    completedCount === missions.length
      ? 'Todas las misiones completadas'
      : completedCount > 0
        ? 'En progreso'
        : 'Sin avances';

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Resultados</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonText>
          <h1>Resumen general</h1>
          <p>Total de puntos: {points}</p>
          <p>
            Misiones completadas: {completedCount}/{missions.length}
          </p>
          <p>Porcentaje: {progressPercent}%</p>
          <p>Estado general: {stateText}</p>
        </IonText>

        <IonButton expand="block" routerLink="/home" className="ion-margin-top">
          Volver
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default ResultsPage;
