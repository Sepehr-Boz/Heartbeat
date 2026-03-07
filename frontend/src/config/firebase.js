// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getMessaging } from "firebase/messaging";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// Import the functions you need from the SDKs you need


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBuh0CKL5VqTmX0RcsRGzzwfDW67t5wSbo",
  authDomain: "heartbeat-781e3.firebaseapp.com",
  projectId: "heartbeat-781e3",
  storageBucket: "heartbeat-781e3.firebasestorage.app",
  messagingSenderId: "123602565832",
  appId: "1:123602565832:web:1f41145fcf001b115bc3fd",
  measurementId: "G-G3QNSKH6WW"
};

// 
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence);
export const db = getFirestore(app);
export const messaging = getMessaging(app);


