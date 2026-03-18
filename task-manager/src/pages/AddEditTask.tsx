import React, { useEffect, useState } from 'react';
import { IonButton, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { useHistory, useParams } from 'react-router-dom';
import { useTasks } from '../hooks/useTasks';
import { useAuth } from '../hooks/useAuth';

interface Params {
  id?: string;
}

const AddEditTask: React.FC = () => {
  const { id } = useParams<Params>();
  const isEdit = Boolean(id);
  const { addTask, updateTask, getTaskById } = useTasks();
  const history = useHistory();
  const [text, setText] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    if (isEdit && id) {
      const task = getTaskById(Number(id));
      if (task) {
        setText(task.text);
      }
    }
  }, [id, isEdit, getTaskById]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    if (isEdit && id) {
      updateTask(Number(id), text.trim());
    } else {
      const createdByName = user?.displayName ?? null;
      const createdByEmail = user?.email ?? null;
      addTask(text.trim(), createdByName, createdByEmail);
    }

    history.push('/tasks');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>{isEdit ? 'Editar tarea' : 'Nueva tarea'}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <form onSubmit={handleSubmit}>
          <IonItem>
            <IonLabel position="stacked">Descripción</IonLabel>
            <IonInput
              value={text}
              onIonChange={e => setText(e.detail.value || '')}
            />
          </IonItem>
          <IonButton expand="block" type="submit" style={{ marginTop: 16 }}>
            {isEdit ? 'Guardar cambios' : 'Agregar tarea'}
          </IonButton>
        </form>
      </IonContent>
    </IonPage>
  );
};

export default AddEditTask;
