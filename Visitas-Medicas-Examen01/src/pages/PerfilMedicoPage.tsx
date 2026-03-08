import React from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonAvatar, IonLabel, IonButton } from '@ionic/react';

const PerfilMedicoPage: React.FC = () => {
  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Perfil Médico</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonAvatar style={{ margin: 'auto', width: 100, height: 100 }}>
          <img src="/juan.jpg" alt="avatar" />
        </IonAvatar>
        <IonLabel style={{ display: 'block', textAlign: 'center', marginTop: 16 }}>
          <strong>Juan David</strong><br />
          <span style={{ fontSize: '0.95em', color: '#666' }}>juan_david@medicare.com</span><br />
          <span style={{ fontSize: '1em', color: '#222', marginTop: 8, display: 'block' }}>Clínica Imbanaco</span>
          <span style={{ fontSize: '1em', color: '#222', display: 'block' }}>Neurologo</span>
        </IonLabel>
        <IonButton expand="block" color="danger" onClick={handleLogout} style={{ marginTop: 32 }}>
          Cerrar sesión
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default PerfilMedicoPage;
