import React from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton } from '@ionic/react';
import { useHistory } from 'react-router-dom';

const List: React.FC = () => {
  const history = useHistory();

  const handleLogout = () => {
    localStorage.removeItem('logged');
    history.push('/login');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Página de Bienvenida Challenge-04 Bienvenido Federico</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding" style={{ background: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <h2 style={{ textAlign: 'center' }}>Usuario Correcto, Bienvenido Federico</h2>
        <IonButton expand="block" onClick={handleLogout}>Cerrar sesión</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default List;
