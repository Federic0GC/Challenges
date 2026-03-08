import React from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList } from '@ionic/react';
import PacienteCard from '../components/PacienteCard';

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
            <PacienteCard key={idx} nombre={p} />
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default MisPacientesPage;
