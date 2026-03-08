import React from 'react';
import { IonTabs, IonTabBar, IonTabButton, IonLabel, IonIcon, IonRouterOutlet, IonBadge } from '@ionic/react';
import { Redirect, Route } from 'react-router-dom';
import { calendar, people, person } from 'ionicons/icons';
import VisitasPage from './pages/VisitasPage';
import DetalleVisitaPage from './pages/DetalleVisitaPage';
import MisPacientesPage from './pages/MisPacientesPage';
import PerfilMedicoPage from './pages/PerfilMedicoPage';

const Tabs: React.FC = () => {
  // Badge dinámico ejemplo
  const visitasPendientes = 3;
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route path="/tabs/visitas" component={VisitasPage} exact />
        <Route path="/tabs/visitas/:id" component={DetalleVisitaPage} exact />
        <Route path="/tabs/pacientes" component={MisPacientesPage} exact />
        <Route path="/tabs/perfil" component={PerfilMedicoPage} exact />
        <Redirect exact from="/tabs" to="/tabs/visitas" />
      </IonRouterOutlet>
      <IonTabBar slot="bottom">
        <IonTabButton tab="visitas" href="/tabs/visitas">
          <IonIcon icon={calendar} />
          <IonLabel>Visitas</IonLabel>
          <IonBadge color="danger">{visitasPendientes}</IonBadge>
        </IonTabButton>
        <IonTabButton tab="pacientes" href="/tabs/pacientes">
          <IonIcon icon={people} />
          <IonLabel>Pacientes</IonLabel>
        </IonTabButton>
        <IonTabButton tab="perfil" href="/tabs/perfil">
          <IonIcon icon={person} />
          <IonLabel>Perfil</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default Tabs;
