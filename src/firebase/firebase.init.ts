// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, collection, addDoc, updateDoc, onSnapshot, getDocs, query, getDoc, where, deleteDoc, } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: import.meta.env.VITE_VUE_APP_API_KEY,
  authDomain: import.meta.env.VITE_VUE_APP_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_VUE_APP_PROJECT_ID,
  storageBucket: import.meta.env.VITE_VUE_APP_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_VUE_APP_SENDER_ID,
  appId: import.meta.env.VITE_VUE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export {db, doc, setDoc, collection, updateDoc, addDoc, onSnapshot, getDocs, query, getDoc, where, deleteDoc};