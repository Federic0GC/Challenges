import { IonContent, IonHeader, IonItem, IonLabel, IonList, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './Tab3.css';
import { useTasks } from '../hooks/useTasks';

const Tab3: React.FC = () => {
  const { tasks } = useTasks();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Detalles de tareas</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">
        {tasks.length === 0 && <p>No hay tareas para mostrar.</p>}
        {tasks.length > 0 && (
          <IonList>
            {tasks.map(task => (
              <IonItem key={task.id} lines="full">
                <IonLabel>
                  <h2 style={{ fontSize: '1.3rem', marginBottom: 8 }}>
                    {task.text}
                  </h2>
                  <p style={{ fontSize: '1.1rem', marginBottom: 4 }}>
                    Estado: {task.completed ? 'Completada' : 'Pendiente'}
                  </p>
                  {task.createdAt && (
                    <p style={{ fontSize: '1rem', marginBottom: 4 }}>
                      Creada el: {new Date(task.createdAt).toLocaleString()}
                    </p>
                  )}
                  {task.createdByEmail && (
                    <p style={{ fontSize: '1rem' }}>
                      Correo: {task.createdByEmail}
                    </p>
                  )}
                </IonLabel>
              </IonItem>
            ))}
          </IonList>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Tab3;
