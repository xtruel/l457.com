// Firebase Modular SDK Configuration
// Use this file when using bundlers like webpack, rollup, or vite

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCWlYJp3xZDnNtU7CoBngWZZdg27aOlIdE",
  authDomain: "l457-4444.firebaseapp.com",
  projectId: "l457-4444",
  storageBucket: "l457-4444.firebasestorage.app",
  messagingSenderId: "548269746173",
  appId: "1:548269746173:web:df9197133eb30c4cd45b94",
  measurementId: "G-36R3C46TV0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Export Firebase services for use in other modules
export { app, analytics, auth, db, storage, firebaseConfig };

// Make available globally for compatibility
if (typeof window !== 'undefined') {
  window.firebaseApp = app;
  window.firebaseConfig = firebaseConfig;
}

console.log('Firebase modular SDK initialized successfully');