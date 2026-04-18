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
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/config';

const LoginPage = () => {
  const history = useHistory();
  const [present] = useIonToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      history.replace('/home');
    } catch {
      present({ message: 'No pude iniciar sesion, proba otra vez', duration: 1700, color: 'danger' });
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
            <IonTitle>Misiones y Desafios - Examen 02</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonText>
          <h1>Iniciar sesion</h1>
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

        <IonButton expand="block" fill="clear" className="ion-margin-top" onClick={handleLogin}>
          Entrar
        </IonButton>

        <IonButton routerLink="/register" fill="clear" expand="block">
          Crear cuenta
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default LoginPage;
