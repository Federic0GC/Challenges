import React from 'react';

interface TaskItemProps {
  task: { id: number; text: string; completed: boolean };
  onComplete: (id: number) => void;
  onDelete: (id: number) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onComplete, onDelete }) => {
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
      <button onClick={() => onComplete(task.id)} style={{ marginRight: 8 }}>
        {task.completed ? '✔️' : 'Completar'}
      </button>
      <button onClick={() => onDelete(task.id)} style={{ color: 'red' }}>
        Eliminar
      </button>
    </div>
  );
};

export default TaskItem;
import React from 'react';

interface TaskItemProps {
  task: { id: number; text: string; completed: boolean };
  onComplete: (id: number) => void;
  onDelete: (id: number) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onComplete, onDelete }) => {
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
      <button onClick={() => onComplete(task.id)} style={{ marginRight: 8 }}>
        {task.completed ? '✔️' : 'Completar'}
      </button>
      <button onClick={() => onDelete(task.id)} style={{ color: 'red' }}>
        Eliminar
      </button>
    </div>
  );
};

export default TaskItem;
