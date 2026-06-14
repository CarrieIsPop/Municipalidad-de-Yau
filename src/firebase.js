import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// REEMPLAZA ESTO CON TUS CLAVES DE LA CONSOLA DE FIREBASE
const firebaseConfig = {
    apiKey: "TU_API_KEY",
    authDomain: "muniyau-tramites.firebaseapp.com",
    projectId: "muniyau-tramites",
    storageBucket: "muniyau-tramites.appspot.com",
    messagingSenderId: "TU_SENDER_ID",
    appId: "TU_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);