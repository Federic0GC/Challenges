import React from 'react';
import { IonItemSliding, IonItem, IonLabel, IonBadge, IonItemOptions, IonItemOption } from '@ionic/react';

interface VisitaItemProps {
  id: number;
  paciente: string;
  estado: string;
  onCancelar: (id: number) => void;
}

const VisitaItem: React.FC<VisitaItemProps> = ({ id, paciente, estado, onCancelar }) => {
  return (
    <IonItemSliding>
      <IonItem button detail href={`/tabs/visitas/${id}`}>
        <IonLabel>{paciente}</IonLabel>
        <IonBadge color={estado === 'pendiente' ? 'warning' : estado === 'en camino' ? 'primary' : 'success'}>{estado}</IonBadge>
      </IonItem>
      <IonItemOptions side="end">
        <IonItemOption color="primary" onClick={() => {}}>
          En camino
        </IonItemOption>
        <IonItemOption color="danger" onClick={() => onCancelar(id)}>
          Cancelar
        </IonItemOption>
        <IonItemOption color="medium" href={`/tabs/visitas/${id}`}>
          Ver detalle
        </IonItemOption>
      </IonItemOptions>
    </IonItemSliding>
  );
};

export default VisitaItem;
