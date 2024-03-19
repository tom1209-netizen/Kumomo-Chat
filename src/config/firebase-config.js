import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAL4SvkdYPvOzVPiEv0WRpn_-xwHdMPhLk",
  authDomain: "kumomo-61de5.firebaseapp.com",
  projectId: "kumomo-61de5",
  storageBucket: "kumomo-61de5.appspot.com",
  messagingSenderId: "586022792301",
  appId: "1:586022792301:web:3b0c7b7156288378a92364",
  measurementId: "G-TZFDLDZZBP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);