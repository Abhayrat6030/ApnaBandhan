import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC4BycTKZDDjS2F1IJL2wVRawRtIrzpW4k",
  authDomain: "studio-5455681471-6a9b7.firebaseapp.com",
  projectId: "studio-5455681471-6a9b7",
  storageBucket: "studio-5455681471-6a9b7.appspot.com",
  messagingSenderId: "217556320126",
  appId: "1:217556320126:web:5eb284890e155496807d2f",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
