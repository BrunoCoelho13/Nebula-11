import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyBykta2kSMsjR6oWPoP0gBCmyQF4gva1K0",
  authDomain: "nebula-d0e0f.firebaseapp.com",
  projectId: "nebula-d0e0f",
  storageBucket: "nebula-d0e0f.firebasestorage.app",
  messagingSenderId: "907381420148",
  appId: "1:907381420148:web:5f191715f965d81568a121",
  measurementId: "G-FSXN44K2FR"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

export { auth, db };