import { IonButton, IonContent, IonHeader, IonItem, IonLabel, IonList, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './Tab1.css';

import React from 'react';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTasks } from '../hooks/useTasks';

const Tab1: React.FC = () => {
  const { logout } = useAuth();
  const history = useHistory();
  const { tasks } = useTasks();

  const handleLogout = async () => {
    try {
      await logout();
      history.push('/login');
    } catch {
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle style={{ textAlign: 'center', fontSize: '2rem', fontWeight: 'bold' }}>
            Administra tus tareas! Challenge 03 Federico
          </IonTitle>
          <IonButton slot="end" onClick={handleLogout}>
            Cerrar sesión
          </IonButton>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large" style={{ textAlign: 'center', fontSize: '2.5rem', fontWeight: 'bold' }}>
              Administra tus tareas! Challenge 03 Federico
            </IonTitle>
          </IonToolbar>
        </IonHeader>
        <div style={{ padding: 16 }}>
          {tasks.length === 0 && (
            <p style={{ textAlign: 'center', color: '#888', marginTop: 32, fontSize: '1.2rem' }}>
              No hay tareas para mostrar.
            </p>
          )}
          {tasks.length > 0 && (
            <IonList>
              {tasks.map(task => (
                <IonItem key={task.id} lines="full">
                  <IonLabel>
                    <h2 style={{ fontSize: '1.3rem', marginBottom: 8 }}>
                      {task.text}
                    </h2>
                    <p style={{ fontSize: '1.1rem' }}>
                      Estado: {task.completed ? 'Completada' : 'Pendiente'}
                    </p>
                  </IonLabel>
                </IonItem>
              ))}
            </IonList>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
