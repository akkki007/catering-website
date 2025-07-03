// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyDGrWeIw73Ntuva3z-Su4SIbMIF2IyFZ_I",
  authDomain: "website-b2814.firebaseapp.com",
  projectId: "website-b2814",
  storageBucket: "website-b2814.firebasestorage.app",
  messagingSenderId: "821495283209",
  appId: "1:821495283209:web:0b047887d3cfcbe512c2d8",
  measurementId: "G-XDFRFSNX3W"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);