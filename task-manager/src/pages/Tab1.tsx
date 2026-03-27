import { IonBadge, IonButton, IonContent, IonHeader, IonItem, IonLabel, IonList, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './Tab1.css';

import React from 'react';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTasks } from '../hooks/useTasks';

const Tab1: React.FC = () => {
  const { logout } = useAuth();
  const history = useHistory();
  const { tasks, isOnline, toggleTask } = useTasks();

  const handleLogout = async () => {
    try {
      await logout();
      history.push('/login');
    } catch {
    }
  };

  const goToContacts = () => {
    history.push('/contacts');
  };

  const goToFruits = () => {
    history.push('/fruits');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle style={{ textAlign: 'center', fontSize: '2rem', fontWeight: 'bold' }}>
            Challenge 06 - App multifuncional con Firebase Realtime Database, Firestore y Dexie
          </IonTitle>
          <IonButton slot="start" onClick={goToContacts}>
            Contacts
          </IonButton>
          <IonButton slot="start" onClick={goToFruits}>
            Fruits
          </IonButton>
          <IonButton slot="end" onClick={handleLogout}>
            Cerrar sesión
          </IonButton>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large" style={{ textAlign: 'center', fontSize: '2.5rem', fontWeight: 'bold' }}>
              Challenge 06 - App multifuncional con Firebase Realtime Database, Firestore y Dexie
            </IonTitle>
          </IonToolbar>
        </IonHeader>
        <div style={{ padding: 16 }}>
          {!isOnline && (
            <p style={{ textAlign: 'center', color: 'orange', marginBottom: 16 }}>
              Sin conexión: no puedes modificar tareas.
            </p>
          )}
          {tasks.length === 0 && (
            <p style={{ textAlign: 'center', color: '#888', marginTop: 32, fontSize: '1.2rem' }}>
              No hay tareas para mostrar.
            </p>
          )}
          {tasks.length > 0 && (
            <IonList>
              {tasks.map(task => (
                <IonItem key={task.id} lines="full" button={isOnline} onClick={isOnline ? () => toggleTask(task.id, task.completed) : undefined}>
                  <IonLabel>
                    <h2 style={{ fontSize: '1.3rem', marginBottom: 8 }}>
                      {task.text}
                    </h2>
                    <p style={{ fontSize: '1.1rem' }}>
                      Estado: {task.completed ? 'Completada' : 'Pendiente'}
                    </p>
                  </IonLabel>
                  <IonBadge color={task.completed ? 'success' : 'medium'}>
                    {task.completed ? '✔' : ''}
                  </IonBadge>
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
