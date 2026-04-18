import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './config';
import { ProgressData } from '../types';

export const saveProgressToFirebase = async (uid: string, progress: ProgressData) => {
  await setDoc(doc(db, 'users', uid), progress, { merge: true });
};

export const getProgressFromFirebase = async (uid: string): Promise<ProgressData | null> => {
  const snapshot = await getDoc(doc(db, 'users', uid));
  if (!snapshot.exists()) {
    return null;
  }
  const data = snapshot.data() as ProgressData;
  return {
    points: typeof data.points === 'number' ? data.points : 0,
    missions: Array.isArray(data.missions) ? data.missions : []
  };
};
