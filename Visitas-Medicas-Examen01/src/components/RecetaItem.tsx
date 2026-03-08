import React from 'react';
import { IonItem, IonLabel, IonBadge } from '@ionic/react';

interface RecetaItemProps {
  medicamento: string;
}

const RecetaItem: React.FC<RecetaItemProps> = ({ medicamento }) => (
  <IonItem>
    <IonLabel>{medicamento}</IonLabel>
    <IonBadge color="success">Receta</IonBadge>
  </IonItem>
);

export default RecetaItem;
