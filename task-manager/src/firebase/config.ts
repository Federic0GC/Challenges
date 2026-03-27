import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAXoEIYZRq89tb5txlGoedTh262fdMgRL0",
  authDomain: "challengetasks-b28b2.firebaseapp.com",
  databaseURL: "https://challengetasks-b28b2-default-rtdb.firebaseio.com",
  projectId: "challengetasks-b28b2",
  storageBucket: "challengetasks-b28b2.firebasestorage.app",
  messagingSenderId: "916945280107",
  appId: "1:916945280107:web:7f4abf874bbcab4d77a52e",
  measurementId: "G-TPNV7QHPMR",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const realtimeDb = getDatabase(app);
