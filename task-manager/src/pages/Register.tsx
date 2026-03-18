import React, { useState } from 'react';
import { IonButton, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Register: React.FC = () => {
  const { register } = useAuth();
  const history = useHistory();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await register(email, password);
      history.push('/tasks');
    } catch (err) {
      setError('Error al registrarse. Revisa tus datos.');
    }
  };

  const goToLogin = () => {
    history.push('/login');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Registrarse</IonTitle>
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
            Crear cuenta
          </IonButton>
        </form>
        <IonButton fill="clear" expand="block" onClick={goToLogin} style={{ marginTop: 8 }}>
          ¿Ya tienes cuenta? Inicia sesión
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Register;
