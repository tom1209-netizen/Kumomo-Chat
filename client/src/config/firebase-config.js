import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';

// const firebaseConfig = {
//   apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
//   authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.REACT_APP_FIREBASE_APP_ID,
//   measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
// };

const firebaseConfig = {
  apiKey: 'AIzaSyAL4SvkdYPvOzVPiEv0WRpn_-xwHdMPhLk',
  authDomain: 'kumomo-61de5.firebaseapp.com',
  projectId: 'kumomo-61de5',
  storageBucket: 'kumomo-61de5.appspot.com',
  messagingSenderId: '586022792301',
  appId: '1:586022792301:web:3b0c7b7156288378a92364',
  measurementId: 'G-TZFDLDZZBP'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);