import React, { useState } from 'react';
import { IonContent, IonInput, IonButton, IonItem, IonLabel, IonLoading, IonToast, IonIcon } from '@ionic/react';
import { eye, eyeOff } from 'ionicons/icons';

const MOCK_USER = 'juan_david@medicare.com';
const MOCK_PASS = 'medico';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (email === MOCK_USER && password === MOCK_PASS) {
        localStorage.setItem('user', JSON.stringify({ email }));
        window.location.href = '/tabs/visitas';
      } else {
        setError('Credenciales incorrectas');
      }
    }, 1500);
  };

  return (
    <IonContent className="ion-padding">
      <IonItem>
        <IonLabel position="stacked">Correo</IonLabel>
        <IonInput type="email" value={email} onIonChange={e => setEmail(e.detail.value!)} />
      </IonItem>
      <IonItem>
        <IonLabel position="stacked">Contraseña</IonLabel>
        <IonInput type={showPassword ? 'text' : 'password'} value={password} onIonChange={e => setPassword(e.detail.value!)} />
        <IonButton fill="clear" slot="end" onClick={() => setShowPassword(!showPassword)}>
          <IonIcon icon={showPassword ? eyeOff : eye} />
        </IonButton>
      </IonItem>
      <IonButton expand="block" onClick={handleLogin}>Ingresar</IonButton>
      <IonLoading isOpen={loading} message="Ingresando..." duration={1500} />
      <IonToast isOpen={!!error} message={error} duration={2000} color="danger" onDidDismiss={() => setError('')} />
    </IonContent>
  );
};

export default LoginPage;
