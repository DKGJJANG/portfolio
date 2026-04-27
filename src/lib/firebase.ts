import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import firebaseConfig from '../../firebase-applet-config.json';

// Only initialize if we have a valid API Key
const isConfigValid = !!firebaseConfig.apiKey && 
                     firebaseConfig.apiKey !== "REPLACED_BY_ENV_VAR" && 
                     firebaseConfig.apiKey.length > 0;

let auth: any = null;
let db: any = null;
let storage: any = null;

if (isConfigValid) {
  try {
    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    db = firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== "REPLACED_BY_ENV_VAR"
      ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
      : getFirestore(app);
    storage = getStorage(app);
    console.log("Firebase initialized successfully.");
    
    // Test connection
    const testConnection = async () => {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (error: any) {
        if (error.message?.includes('the client is offline')) {
          console.error("Please check your Firebase configuration. The client is reporting as offline.");
        }
      }
    };
    testConnection();
  } catch (error) {
    console.error("Firebase initialization failed:", error);
  }
}

export { auth, db, storage, isConfigValid };
