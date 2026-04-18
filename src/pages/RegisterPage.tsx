import { useState } from 'react';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar,
  useIonToast
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/config';

const RegisterPage = () => {
  const history = useHistory();
  const [present] = useIonToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email.trim(), password);
      history.replace('/home');
    } catch {
      present({ message: 'No se pudo registrar', duration: 1700, color: 'danger' });
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Registro</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonText>
          <h1>Crear cuenta</h1>
        </IonText>
        <IonItem className="ion-margin-top">
          <IonInput
            type="email"
            label="Correo"
            labelPlacement="stacked"
            value={email}
            onIonInput={(e) => setEmail(e.detail.value || '')}
          />
        </IonItem>
        <IonItem>
          <IonInput
            type="password"
            label="Contrasena"
            labelPlacement="stacked"
            value={password}
            onIonInput={(e) => setPassword(e.detail.value || '')}
          />
        </IonItem>

        <IonButton expand="block" className="ion-margin-top" onClick={handleRegister}>
          Registrarme
        </IonButton>

        <IonButton fill="clear" expand="block" routerLink="/login">
          Volver a login
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default RegisterPage;
