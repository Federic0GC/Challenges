import { realtimeDb } from "../firebase/config";
import { DataSnapshot, onValue, push, ref, remove, update } from "firebase/database";

export interface TaskDto {
  id: string;
  text: string;
  completed: boolean;
  createdByName?: string | null;
  createdByEmail?: string | null;
  createdAt?: string;
}

export function subscribeToTasks(
  userId: string,
  callback: (tasks: TaskDto[]) => void
) {
  const tasksRef = ref(realtimeDb, `tasks/${userId}`);

  return onValue(tasksRef, (snapshot: DataSnapshot) => {
    const data = snapshot.val() || {};
    const tasks: TaskDto[] = Object.entries<any>(data).map(([id, value]) => ({
      id,
      text: value.text,
      completed: value.completed,
      createdByName: value.createdByName ?? null,
      createdByEmail: value.createdByEmail ?? null,
      createdAt: value.createdAt,
    }));
    callback(tasks);
  });
}

export async function addTask(
  userId: string,
  text: string,
  createdByName: string | null,
  createdByEmail: string | null
) {
  const tasksRef = ref(realtimeDb, `tasks/${userId}`);
  await push(tasksRef, {
    text,
    completed: false,
    createdByName,
    createdByEmail,
    createdAt: new Date().toISOString(),
  });
}

export async function toggleTask(userId: string, taskId: string, completed: boolean) {
  const taskRef = ref(realtimeDb, `tasks/${userId}/${taskId}`);
  await update(taskRef, { completed: !completed });
}

export async function deleteTask(userId: string, taskId: string) {
  const taskRef = ref(realtimeDb, `tasks/${userId}/${taskId}`);
  await remove(taskRef);
}

export async function updateTaskText(userId: string, taskId: string, text: string) {
  const taskRef = ref(realtimeDb, `tasks/${userId}/${taskId}`);
  await update(taskRef, { text });
}
