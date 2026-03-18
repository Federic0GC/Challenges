import React from 'react';
import { useHistory } from 'react-router-dom';

interface TareaItemProps {
  task: { id: number; text: string; completed: boolean };
  onComplete: (id: number) => void;
  onDelete: (id: number) => void;
}

const TareaItem: React.FC<TareaItemProps> = ({ task, onComplete, onDelete }) => {
  const history = useHistory();

  const goToDetail = () => {
    history.push(`/tasks/detail/${task.id}`);
  };

  const goToEdit = () => {
    history.push(`/tasks/${task.id}/edit`);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
      <span
        style={{
          textDecoration: task.completed ? 'line-through' : 'none',
          flex: 1,
        }}
      >
        {task.text}
      </span>
      <button onClick={goToDetail} style={{ marginRight: 8 }}>
        Ver
      </button>
      <button onClick={goToEdit} style={{ marginRight: 8 }}>
        Editar
      </button>
      <button onClick={() => onComplete(task.id)} style={{ marginRight: 8 }}>
        {task.completed ? '✔️' : 'Completar'}
      </button>
      <button onClick={() => onDelete(task.id)} style={{ color: 'red' }}>
        Eliminar
      </button>
    </div>
  );
};

export default TareaItem;
