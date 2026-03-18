import React from 'react';
import { IonButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { useParams, useHistory } from 'react-router-dom';
import { useTasks } from '../hooks/useTasks';

interface Params {
  id: string;
}

const TaskDetail: React.FC = () => {
  const { id } = useParams<Params>();
  const { getTaskById } = useTasks();
  const history = useHistory();

  const taskId = Number(id);
  const task = getTaskById(taskId);

  const goBack = () => history.goBack();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Detalle de tarea</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {!task && <p style={{ fontSize: '1.2rem', textAlign: 'center' }}>Tarea no encontrada.</p>}
        {task && (
          <div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: 12 }}>{task.text}</h2>
            <p style={{ fontSize: '1.2rem', marginBottom: 8 }}>
              Estado: {task.completed ? 'Completada' : 'Pendiente'}
            </p>
            {task.createdAt && (
              <p style={{ fontSize: '1rem', marginBottom: 4 }}>
                Creada el: {new Date(task.createdAt).toLocaleString()}
              </p>
            )}
            {task.createdByName && (
              <p style={{ fontSize: '1rem', marginBottom: 4 }}>
                Creada por: {task.createdByName}
              </p>
            )}
            {task.createdByEmail && (
              <p style={{ fontSize: '1rem' }}>Correo: {task.createdByEmail}</p>
            )}
          </div>
        )}
        <IonButton expand="block" onClick={goBack} style={{ marginTop: 16 }}>
          Volver
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default TaskDetail;
