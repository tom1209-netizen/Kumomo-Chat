// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
export const provider = new GoogleAuthProvider();