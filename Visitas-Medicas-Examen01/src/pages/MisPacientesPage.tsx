import React from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel } from '@ionic/react';

const pacientes = [
  'Sofia Estrella',
  'Miguel Duran Gamboa',
  'Maria Camila Velez',
];

const MisPacientesPage: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Mis Pacientes</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          {pacientes.map((p, idx) => (
            <IonItem key={idx}>
              <IonLabel>{p}</IonLabel>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default MisPacientesPage;
