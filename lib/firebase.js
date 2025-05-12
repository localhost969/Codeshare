import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCQjSDO2vzUAI781qxJcDEC-KMHrWFfq6U",
  authDomain: "ngit-horizon.firebaseapp.com",
  projectId: "ngit-horizon",
  storageBucket: "ngit-horizon.appspot.com",
  messagingSenderId: "604022887514",
  appId: "1:604022887514:web:5340d9bda1298f1d637463"
};

// Initialize Firebase
let app;

// Check if Firebase has been initialized
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
