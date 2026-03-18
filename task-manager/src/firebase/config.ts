import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAXoEIYZRq89tb5txlGoedTh262fdMgRL0",
  authDomain: "challengetasks-b28b2.firebaseapp.com",
  projectId: "challengetasks-b28b2",
  storageBucket: "challengetasks-b28b2.firebasestorage.app",
  messagingSenderId: "916945280107",
  appId: "1:916945280107:web:7f4abf874bbcab4d77a52e",
  measurementId: "G-TPNV7QHPMR",
};
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
