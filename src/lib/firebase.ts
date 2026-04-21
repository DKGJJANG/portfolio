import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "",
  firestoreDatabaseId: import.meta.env.VITE_FIREBASE_DATABASE_ID || ""
};

// Only initialize if we have at least the API Key
const isConfigValid = !!firebaseConfig.apiKey && firebaseConfig.apiKey !== "REPLACED_BY_ENV_VAR";

if (!isConfigValid) {
  // Silent failing if not configured
}

const app = isConfigValid ? initializeApp(firebaseConfig) : null;
export const auth = app ? getAuth(app) : ({} as any);
export const db = app ? getFirestore(app, firebaseConfig.firestoreDatabaseId) : ({} as any);

async function testConnection() {
  if (!app || !db) return;
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error: any) {
    if (error.message?.includes('the client is offline')) {
      console.error("Please check your Firebase configuration.");
    }
  }
}
testConnection();

export { isConfigValid };
