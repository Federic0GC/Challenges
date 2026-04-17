import { IonButton, IonButtons, IonHeader, IonIcon, IonPage, IonRouterOutlet, IonTitle, IonToolbar } from '@ionic/react';
import { Redirect, Route, useHistory } from 'react-router-dom';
import { locationOutline, timeOutline } from 'ionicons/icons';
import Inicio from './paginas/Inicio';
import Historial from './paginas/Historial';

const Encabezado = () => {
  const history = useHistory();

  return (
    <IonHeader translucent>
      <IonToolbar className="barra-principal">
        <IonTitle>Challenge-08</IonTitle>
        <IonButtons slot="end">
          <IonButton onClick={() => history.push('/')}>
            <IonIcon icon={locationOutline} slot="start" />
            Inicio
          </IonButton>
          <IonButton onClick={() => history.push('/historial')}>
            <IonIcon icon={timeOutline} slot="start" />
            Historial
          </IonButton>
        </IonButtons>
      </IonToolbar>
    </IonHeader>
  );
};

export default function App() {
  return (
    <IonRouterOutlet>
      <Route
        exact
        path="/"
        render={() => (
          <IonPage>
            <Encabezado />
            <Inicio />
          </IonPage>
        )}
      />
      <Route
        exact
        path="/historial"
        render={() => (
          <IonPage>
            <Encabezado />
            <Historial />
          </IonPage>
        )}
      />
      <Route render={() => <Redirect to="/" />} />
    </IonRouterOutlet>
  );
}
