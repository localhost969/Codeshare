import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FB_AK,
  authDomain: process.env.NEXT_PUBLIC_FB_AD,
  projectId: process.env.NEXT_PUBLIC_FB_PID,
  storageBucket: process.env.NEXT_PUBLIC_FB_SB,
  messagingSenderId: process.env.NEXT_PUBLIC_FB_MSID,
  appId: process.env.NEXT_PUBLIC_FB_AID
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
