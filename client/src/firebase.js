// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-c7e83.firebaseapp.com",
  projectId: "mern-blog-c7e83",
  storageBucket: "mern-blog-c7e83.appspot.com",
  messagingSenderId: "341075824217",
  appId: "1:341075824217:web:54a62e31f49b7c4f78eb48"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);