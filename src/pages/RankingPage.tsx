import {
  IonButton,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar
} from '@ionic/react';
import { useMemo } from 'react';
import { useApp } from '../context/AppContext';

type Entry = {
  name: string;
  points: number;
};

const RankingPage = () => {
  const { points, user } = useApp();

  const { top5, userPosition } = useMemo(() => {
    const base: Entry[] = [
      { name: 'Camila', points: 620 },
      { name: 'Mateo', points: 560 },
      { name: 'Sofia', points: 500 },
      { name: 'Valentina', points: 420 },
      { name: 'Lucas', points: 360 },
      { name: 'Martina', points: 340 },
      { name: 'Diego', points: 280 }
    ];

    const myName = user?.email?.split('@')[0] || 'TuUsuario';
    const ranking = [...base, { name: myName, points }].sort((a, b) => b.points - a.points);
    const position = ranking.findIndex((r) => r.name === myName && r.points === points) + 1;

    return {
      top5: ranking.slice(0, 5),
      userPosition: position
    };
  }, [points, user]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Ranking</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonText>
          <h1>Top 5</h1>
        </IonText>
        <IonList>
          {top5.map((entry, index) => (
            <IonItem key={`${entry.name}-${entry.points}`}>
              <IonLabel>
                <h2>
                  {index + 1}. {entry.name}
                </h2>
                <p>{entry.points} puntos</p>
              </IonLabel>
            </IonItem>
          ))}
        </IonList>

        <IonText>
          <p>Tu posicion actual: {userPosition}</p>
        </IonText>

        <IonButton expand="block" routerLink="/home" className="ion-margin-top">
          Volver
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default RankingPage;
