import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: "devatdeakin-532f0.firebaseapp.com", // You can simplify this from your RTDB-specific URL
    projectId: "devatdeakin-532f0",
    storageBucket: "devatdeakin-532f0.firebasestorage.app",
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL, // This is specific to RTDB
};

export const app = initializeApp(firebaseConfig);