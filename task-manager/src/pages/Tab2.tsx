import { IonButton, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonList, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './Tab2.css';
import { useTasks } from '../hooks/useTasks';
import { useHistory } from 'react-router-dom';
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

const Tab2: React.FC = () => {
  const { tasks, addTask, deleteTask } = useTasks();
  const history = useHistory();
  const { user } = useAuth();
  const [newText, setNewText] = useState('');

  const handleAdd = () => {
    const text = newText.trim();
    if (!text) return;
    const createdByName = user?.displayName ?? null;
    const createdByEmail = user?.email ?? null;
    addTask(text, createdByName, createdByEmail);
    setNewText('');
  };

  const goToEdit = (id: number) => {
    history.push(`/tasks/${id}/edit`);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Editar / agregar tareas</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">
        <IonItem>
          <IonLabel position="stacked">Nueva tarea</IonLabel>
          <IonInput
            value={newText}
            placeholder="Descripción de la tarea"
            onIonChange={e => setNewText(e.detail.value || '')}
          />
        </IonItem>
        <IonButton expand="block" onClick={handleAdd} style={{ marginTop: 12, marginBottom: 24 }}>
          Agregar tarea
        </IonButton>

        {tasks.length === 0 && <p>No hay tareas para editar.</p>}
        {tasks.length > 0 && (
          <IonList>
            {tasks.map(task => (
              <IonItem key={task.id} lines="full">
                <IonLabel>
                  <h2>{task.text}</h2>
                  <p>Estado: {task.completed ? 'Completada' : 'Pendiente'}</p>
                </IonLabel>
                <IonButton slot="end" size="small" onClick={() => goToEdit(task.id)}>
                  Editar
                </IonButton>
                <IonButton
                  slot="end"
                  size="small"
                  color="danger"
                  onClick={() => deleteTask(task.id)}
                >
                  Eliminar
                </IonButton>
              </IonItem>
            ))}
          </IonList>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Tab2;
