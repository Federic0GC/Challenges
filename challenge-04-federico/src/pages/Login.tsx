import React, { useState, useEffect } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonInput, IonButton, IonItem, IonLabel, IonToast } from '@ionic/react';
import { useHistory } from 'react-router-dom';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showToast, setShowToast] = useState(false);
  const history = useHistory();

  useEffect(() => {
    if (localStorage.getItem('logged') === 'true') {
      history.replace('/list');
    }
  }, [history]);

  const handleLogin = () => {
    if (email === 'user@mail.com' && password === '123') {
      localStorage.setItem('logged', 'true');
      history.push('/list');
    } else {
      setShowToast(true);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Challenge -04 Federico G. Login Demo con Rutas internas</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding" style={{ background: '#fff', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

        <div style={{ width: '100%', maxWidth: 350, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <IonItem style={{ marginBottom: '20px', width: '100%', maxWidth: 300, display: 'flex', alignItems: 'center' }}>
            <IonLabel style={{ marginRight: '10px', minWidth: '120px' }}>Correo electrónico:</IonLabel>
            <IonInput style={{ flex: 1 }} type="email" value={email} onIonChange={e => setEmail(e.detail.value!)} />
          </IonItem>
          <IonItem style={{ marginBottom: '30px', width: '100%', maxWidth: 300, display: 'flex', alignItems: 'center' }}>
            <IonLabel style={{ marginRight: '10px', minWidth: '120px' }}>Contraseña:</IonLabel>
            <IonInput style={{ flex: 1 }} type="password" value={password} onIonChange={e => setPassword(e.detail.value!)} />
          </IonItem>
          <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <IonButton style={{ borderRadius: '12px', minWidth: '120px' }} onClick={handleLogin}>Iniciar sesión</IonButton>
          </div>
        </div>
        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message="Credenciales inválidas"
          duration={2000}
        />
      </IonContent>
    </IonPage>
  );
};

export default Login;
