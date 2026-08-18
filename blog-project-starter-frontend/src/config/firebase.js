import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyC-4aitVOOxHsvUlsTzxHUvsbfKjDJkvDo",
  authDomain: "blog-project-f60d1.firebaseapp.com",
  projectId: "blog-project-f60d1",
  storageBucket: "blog-project-f60d1.firebasestorage.app",
  messagingSenderId: "604482424998",
  appId: "1:604482424998:web:357c5d33749a0b48d4a467",
  measurementId: "G-WK98E1XRKM"
};


const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);