import React from 'react';
import { IonItem, IonLabel } from '@ionic/react';

interface PacienteCardProps {
  nombre: string;
}

const PacienteCard: React.FC<PacienteCardProps> = ({ nombre }) => (
  <IonItem>
    <IonLabel>{nombre}</IonLabel>
  </IonItem>
);

export default PacienteCard;
