import React, { useState } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonButton, IonInput, IonBadge } from '@ionic/react';
import RecetaItem from '../components/RecetaItem';

const DetalleVisitaPage: React.FC = () => {
  const [medicamento, setMedicamento] = useState('');
  const [receta, setReceta] = useState<string[]>([]);

  const agregarMedicamento = () => {
    if (medicamento) {
      setReceta([...receta, medicamento]);
      setMedicamento('');
    }
  };

  const finalizarVisita = () => {
    // Lógica para finalizar visita
    alert('Visita finalizada');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Detalle de Visita</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          <IonItem>
            <IonLabel>Registrar atención</IonLabel>
            <IonButton>Atendido</IonButton>
          </IonItem>
          <IonItem>
            <IonLabel>Agregar medicamento</IonLabel>
            <IonInput value={medicamento} onIonChange={e => setMedicamento(e.detail.value!)} placeholder="Medicamento" />
            <IonButton onClick={agregarMedicamento}>Agregar</IonButton>
          </IonItem>
          <IonItem>
            <IonLabel>Receta</IonLabel>
            <IonBadge color="success">{receta.length}</IonBadge>
          </IonItem>
          {receta.map((med, idx) => (
            <RecetaItem key={idx} medicamento={med} />
          ))}
        </IonList>
        <IonButton expand="block" color="primary" onClick={finalizarVisita}>Finalizar visita</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default DetalleVisitaPage;
