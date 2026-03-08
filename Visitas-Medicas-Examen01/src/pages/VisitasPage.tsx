import React from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonReorderGroup, IonSegment, IonSegmentButton, IonLabel, IonAlert } from '@ionic/react';
import VisitaItem from '../components/VisitaItem';
const visitasMock = [
  { id: 1, paciente: 'Sofia Estrella', estado: 'pendiente' },
  { id: 2, paciente: 'Miguel Duran Gamboa', estado: 'en camino' },
  { id: 3, paciente: 'Maria Camila Velez', estado: 'pendiente' },
  { id: 4, paciente: 'Federico Gonzalez Cardenas', estado: 'finalizada' },
];
const estados = ['pendiente', 'en camino', 'finalizada'];
const VisitasPage: React.FC = () => {
  const [segment, setSegment] = React.useState<string | number>('pendiente');
  const [alertOpen, setAlertOpen] = React.useState(false);
  const [cancelMotivo, setCancelMotivo] = React.useState('');
  const [visitaCancelar, setVisitaCancelar] = React.useState<number | null>(null);
  const handleCancelar = (id: number) => {
    setVisitaCancelar(id);
    setAlertOpen(true);
  };
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Visitas del día</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonSegment value={segment} onIonChange={e => setSegment(e.detail.value!)}>
          {estados.map(e => (
            <IonSegmentButton key={e} value={e}>
              <IonLabel>{e.charAt(0).toUpperCase() + e.slice(1)}</IonLabel>
            </IonSegmentButton>
          ))}
        </IonSegment>
        <IonReorderGroup disabled={false}>
          <IonList>
            {visitasMock.filter(v => v.estado === segment).map(v => (
              <VisitaItem key={v.id} id={v.id} paciente={v.paciente} estado={v.estado} onCancelar={handleCancelar} />
            ))}
          </IonList>
        </IonReorderGroup>
        <IonAlert
          isOpen={alertOpen}
          header="Motivo de cancelación"
          inputs={[{ name: 'motivo', type: 'text', placeholder: 'Motivo' }]}
          buttons={[
            { text: 'Cancelar', role: 'cancel', handler: () => setAlertOpen(false) },
            { text: 'Aceptar', handler: (data) => { setCancelMotivo(data.motivo); setAlertOpen(false); } },
          ]}
        />
      </IonContent>
    </IonPage>
  );
};
export default VisitasPage;
