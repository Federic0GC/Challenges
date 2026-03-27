import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { TaskDto, addTask as addTaskDb, deleteTask as deleteTaskDb, subscribeToTasks, toggleTask as toggleTaskDb, updateTaskText } from '../services/tasksService';
import { useNetwork } from './NetworkContext';

export interface Task extends TaskDto {}

interface TasksContextValue {
  tasks: Task[];
  addTask: (text: string, createdByName: string | null, createdByEmail: string | null) => Promise<void>;
  toggleTask: (id: string, completed: boolean) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  updateTask: (id: string, text: string) => Promise<void>;
  getTaskById: (id: string) => Task | undefined;
  isOnline: boolean;
}

const TasksContext = createContext<TasksContextValue | undefined>(undefined);

export const TasksProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { isOnline } = useNetwork();
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    if (!user) {
      setTasks([]);
      return;
    }
    const unsubscribe = subscribeToTasks(user.uid, setTasks);
    return () => unsubscribe();
  }, [user]);

  const addTask = async (text: string, createdByName: string | null, createdByEmail: string | null) => {
    if (!user || !isOnline) return;
    await addTaskDb(user.uid, text, createdByName, createdByEmail);
  };

  const toggleTask = async (id: string, completed: boolean) => {
    if (!user || !isOnline) return;
    await toggleTaskDb(user.uid, id, completed);
  };

  const deleteTask = async (id: string) => {
    if (!user || !isOnline) return;
    await deleteTaskDb(user.uid, id);
  };

  const updateTask = async (id: string, text: string) => {
    if (!user || !isOnline) return;
    await updateTaskText(user.uid, id, text);
  };

  const getTaskById = (id: string) => tasks.find(task => task.id === id);

  const value: TasksContextValue = {
    tasks,
    addTask,
    toggleTask,
    deleteTask,
    updateTask,
    getTaskById,
    isOnline,
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
