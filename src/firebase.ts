import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAwC4ItpaFJj4OmuPFfM0gd4sF42UvngGQ",
  authDomain: "resilience-fc32b.firebaseapp.com",
  projectId: "resilience-fc32b",
  storageBucket: "resilience-fc32b.firebasestorage.app",
  messagingSenderId: "439777149972",
  appId: "1:439777149972:web:f3af867b86c839b4c71301",
  measurementId: "G-BKSECKPL5T"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
