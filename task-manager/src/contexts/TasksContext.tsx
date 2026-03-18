import React, { createContext, useContext, useState } from 'react';

export interface Task {
  id: number;
  text: string;
  completed: boolean;
  createdByName?: string | null;
  createdByEmail?: string | null;
  createdAt?: string;
}

interface TasksContextValue {
  tasks: Task[];
  addTask: (text: string, createdByName: string | null, createdByEmail: string | null) => void;
  toggleTask: (id: number) => void;
  deleteTask: (id: number) => void;
  updateTask: (id: number, text: string) => void;
  getTaskById: (id: number) => Task | undefined;
}

const TasksContext = createContext<TasksContextValue | undefined>(undefined);

export const TasksProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);

  const addTask = (text: string, createdByName: string | null, createdByEmail: string | null) => {
    setTasks(prev => [
      ...prev,
      {
        id: Date.now(),
        text,
        completed: false,
        createdByName,
        createdByEmail,
        createdAt: new Date().toISOString(),
      },
    ]);
  };

  const toggleTask = (id: number) => {
    setTasks(prev =>
      prev.map(task => (task.id === id ? { ...task, completed: !task.completed } : task))
    );
  };

  const deleteTask = (id: number) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const updateTask = (id: number, text: string) => {
    setTasks(prev =>
      prev.map(task => (task.id === id ? { ...task, text } : task))
    );
  };

  const getTaskById = (id: number) => tasks.find(task => task.id === id);

  const value: TasksContextValue = {
    tasks,
    addTask,
    toggleTask,
    deleteTask,
    updateTask,
    getTaskById,
  };

  return <TasksContext.Provider value={value}>{children}</TasksContext.Provider>;
};

export const useTasksContext = (): TasksContextValue => {
  const ctx = useContext(TasksContext);
  if (!ctx) {
    throw new Error('useTasksContext debe usarse dentro de un TasksProvider');
  }
  return ctx;
};
