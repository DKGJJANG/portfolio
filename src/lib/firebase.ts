import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Access config from a global or a direct fetch to avoid TS module resolution issues with root JSON
// In this environment, we can reliably import it if we cast it or use a .ts wrapper
import firebaseConfig from '../../firebase-applet-config.json' assert { type: 'json' };

const app = initializeApp(firebaseConfig);
// Use the specific firestoreDatabaseId from the config
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const storage = getStorage(app);
