import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar,
  useIonToast
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { MissionList } from '../components/MissionList';
import { ProgressCard } from '../components/ProgressCard';
import { useApp } from '../context/AppContext';

const HomePage = () => {
  const {
    points,
    missions,
    progressPercent,
    completedCount,
    moveTracking,
    stillTracking,
    takePhotoMission,
    startMoveMission,
    startStillMission,
    logout,
    user
  } = useApp();

  const history = useHistory();
  const [present] = useIonToast();

  const safeCall = async (fn: () => Promise<void>, errorMsg: string) => {
    try {
      await fn();
    } catch (error) {
      const message =
        error instanceof Error && error.message
          ? error.message
          : typeof error === 'string'
            ? error
            : typeof error === 'object' && error && 'message' in error
              ? String((error as { message?: unknown }).message || errorMsg)
              : errorMsg;
      present({ message, duration: 1800, color: 'danger' });
    }
  };

  const handleLogout = async () => {
    await logout();
    history.replace('/login');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Examen 02 - APP de logro y desbloqueo de misiones</IonTitle>
          <IonButtons slot="end">
            <IonButton routerLink="/results">Resultados</IonButton>
            <IonButton routerLink="/ranking">Ranking</IonButton>
            <IonButton onClick={handleLogout}>Salir</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonText>
          <h1>{user?.email}</h1>
          <h2>Total de puntos: {points}</h2>
        </IonText>

        <ProgressCard progressPercent={progressPercent} completedCount={completedCount} total={missions.length} />

        <MissionList
          missions={missions}
          moveTracking={moveTracking}
          stillTracking={stillTracking}
          onMission1={() => safeCall(takePhotoMission, 'No se pudo completar la mision de foto')}
          onMission2={() => safeCall(startMoveMission, 'No se pudo iniciar geolocalizacion')}
          onMission3={() => safeCall(startStillMission, 'No se pudo iniciar mision de quietud')}
        />
      </IonContent>
    </IonPage>
  );
};

export default HomePage;
