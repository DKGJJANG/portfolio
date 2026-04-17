import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// In AI Studio, the config is injected. We'll use a safer way to access it.
let firebaseConfig = {};
try {
  // @ts-ignore
  firebaseConfig = await import('../firebase-applet-config.json');
  if ('default' in firebaseConfig) firebaseConfig = firebaseConfig.default;
} catch (e) {
  console.warn('Firebase config not found, using environment variables if available.');
}

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, (firebaseConfig as any).firestoreDatabaseId);
export const auth = getAuth(app);
