// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAADITUJ52qReCtk1FMLhTazu-z_Y_gK1Y",
  authDomain: "enbla-ordering-system.firebaseapp.com",
  projectId: "enbla-ordering-system",
  storageBucket: "enbla-ordering-system.firebasestorage.app",
  messagingSenderId: "980386115733",
  appId: "1:980386115733:web:4af92fea0e485135e9eb9c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);