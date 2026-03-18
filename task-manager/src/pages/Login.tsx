import React, { useState } from 'react';
import { IonButton, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Login: React.FC = () => {
  const { login } = useAuth();
  const history = useHistory();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      history.push('/tasks');
    } catch (err) {
      setError('Error al iniciar sesión. Revisa tus datos.');
    }
  };

  const goToRegister = () => {
    history.push('/register');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Iniciar sesión</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <form onSubmit={handleSubmit}>
          <IonItem>
            <IonLabel position="stacked">Email</IonLabel>
            <IonInput
              type="email"
              value={email}
              onIonChange={e => setEmail(e.detail.value || '')}
            />
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Contraseña</IonLabel>
            <IonInput
              type="password"
              value={password}
              onIonChange={e => setPassword(e.detail.value || '')}
            />
          </IonItem>
          {error && <p style={{ color: 'red', marginTop: 8 }}>{error}</p>}
          <IonButton expand="block" type="submit" style={{ marginTop: 16 }}>
            Entrar
          </IonButton>
        </form>
        <IonButton fill="clear" expand="block" onClick={goToRegister} style={{ marginTop: 8 }}>
          ¿No tienes cuenta? Regístrate
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Login;
