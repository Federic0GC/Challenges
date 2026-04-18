import { IonCard, IonCardContent, IonProgressBar, IonText } from '@ionic/react';

type Props = {
  progressPercent: number;
  completedCount: number;
  total: number;
};

export const ProgressCard = ({ progressPercent, completedCount, total }: Props) => {
  return (
    <IonCard>
      <IonCardContent>
        <IonText>
          <h2>Progreso</h2>
          <p>
            {progressPercent}% completado ({completedCount}/{total})
          </p>
        </IonText>
        <IonProgressBar value={progressPercent / 100} />
      </IonCardContent>
    </IonCard>
  );
};
