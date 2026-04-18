import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyAhqD77HSk3RjIF-nIc7IMfHLfqDl4ABWM',
  authDomain: 'examen02-334cb.firebaseapp.com',
  projectId: 'examen02-334cb',
  storageBucket: 'examen02-334cb.firebasestorage.app',
  messagingSenderId: '762111049588',
  appId: '1:762111049588:web:32d9cbe8aa1df11ce53621',
  measurementId: 'G-QNY5ZJB0ZP'
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
