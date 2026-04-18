import {
  IonButton,
  IonCard,
  IonCardContent,
  IonChip,
  IonItem,
  IonLabel,
  IonList
} from '@ionic/react';
import { Mission } from '../types';

type Props = {
  missions: Mission[];
  moveTracking: boolean;
  stillTracking: boolean;
  onMission1: () => void;
  onMission2: () => void;
  onMission3: () => void;
};

export const MissionList = ({
  missions,
  moveTracking,
  stillTracking,
  onMission1,
  onMission2,
  onMission3
}: Props) => {
  const mission2Done = missions.find((m) => m.id === 2)?.completed;

  return (
    <IonCard>
      <IonCardContent>
        <IonList>
          {missions.map((mission) => (
            <IonItem key={mission.id} lines="full">
              <IonLabel>
                <h2>{mission.title}</h2>
                <p>{mission.points} puntos</p>
              </IonLabel>
              <IonChip color={mission.completed ? 'success' : 'warning'}>
                <IonLabel>{mission.completed ? 'completada' : 'pendiente'}</IonLabel>
              </IonChip>
            </IonItem>
          ))}
        </IonList>

        <IonButton
          expand="block"
          fill="outline"
          className="ion-margin-top"
          disabled={missions.find((m) => m.id === 1)?.completed}
          onClick={onMission1}
        >
          Tomar foto
        </IonButton>

        <IonButton
          expand="block"
          fill="outline"
          disabled={missions.find((m) => m.id === 2)?.completed || moveTracking}
          onClick={onMission2}
        >
          {moveTracking ? 'Buscando si te mueves...' : 'Empezar geolocalizacion'}
        </IonButton>

        <IonButton
          expand="block"
          fill="outline"
          disabled={!mission2Done || missions.find((m) => m.id === 3)?.completed || stillTracking}
          onClick={onMission3}
        >
          {stillTracking ? 'Mirando si sigues quieto...' : 'Quedarme quieto 10s'}
        </IonButton>
      </IonCardContent>
    </IonCard>
  );
};
