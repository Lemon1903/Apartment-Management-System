import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB7s_fl9MuyhoaEMXL89tQNkbPbL58yP3Q",
  authDomain: "tenants-management-80fda.firebaseapp.com",
  projectId: "tenants-management-80fda",
  storageBucket: "tenants-management-80fda.appspot.com",
  messagingSenderId: "558262093320",
  appId: "1:558262093320:web:94d6fdb5cdadd08c51b3bd",
  measurementId: "G-MLL8G333KC",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const firestore = getFirestore(app);
