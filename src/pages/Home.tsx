import { IonButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './Home.css';

const Home: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Challenge 07 - Implementación de sensores por Federico G</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Challenge 07 - Implementación de sensores</IonTitle>
          </IonToolbar>
        </IonHeader>
        <div className="home-buttons ion-padding">
          <IonButton className="home-button" expand="block" routerLink="/local-notifications">
            Local Notifications
          </IonButton>
          <IonButton className="home-button" expand="block" routerLink="/push-notifications">
            Push Notifications
          </IonButton>
          <IonButton className="home-button" expand="block" routerLink="/geolocation">
            Geolocalización
          </IonButton>
          <IonButton className="home-button" expand="block" routerLink="/camera">
            Cámara
          </IonButton>
          <IonButton className="home-button" expand="block" routerLink="/motion">
            Movimiento
          </IonButton>
          <IonButton className="home-button" expand="block" routerLink="/device">
            Dispositivo
          </IonButton>
          <IonButton className="home-button" expand="block" routerLink="/haptics">
            Haptics / Vibración
          </IonButton>
          <IonButton className="home-button" expand="block" routerLink="/filesystem">
            Filesystem
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
