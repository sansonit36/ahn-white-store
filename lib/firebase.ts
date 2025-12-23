import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCSUcRyvC3fH08ZzcVusWinasWUp575zqc",
    authDomain: "ahnskin-6e3cf.firebaseapp.com",
    projectId: "ahnskin-6e3cf",
    storageBucket: "ahnskin-6e3cf.firebasestorage.app",
    messagingSenderId: "170129636522",
    appId: "1:170129636522:web:31dd34a235c88b4fc0a4d3",
    measurementId: "G-RKBJSJXEB1"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
