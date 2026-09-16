// Safe configuration loader for Firebase
// Reads from Vite environment variables first, falls back to local firebase-applet-config.json if available

// Vite eager glob resolves relative to this file
const localConfigFiles = import.meta.glob<Record<string, any>>(
  '../../firebase-applet-config.json',
  { eager: true }
);

const localModule = Object.values(localConfigFiles)[0] as any;
const localJson: Record<string, string> = localModule?.default || localModule || {};

const env: Record<string, string | undefined> = (import.meta as any).env || {};

export const firebaseConfig = {
  projectId: env.VITE_FIREBASE_PROJECT_ID || localJson.projectId || 'basic-passage-jwh20',
  appId: env.VITE_FIREBASE_APP_ID || localJson.appId || '1:1091755957864:web:5e256b9e15a0c6ee33a5dd',
  apiKey: env.VITE_FIREBASE_API_KEY || localJson.apiKey || 'AIzaSyDRBoo68v_MKDWjofyhb7HQJ2Ic4Xiqdxs',
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || localJson.authDomain || 'basic-passage-jwh20.firebaseapp.com',
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || localJson.storageBucket || 'basic-passage-jwh20.firebasestorage.app',
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || localJson.messagingSenderId || '1091755957864',
  measurementId: env.VITE_FIREBASE_MEASUREMENT_ID || localJson.measurementId || '',
  oAuthClientId: env.VITE_FIREBASE_OAUTH_CLIENT_ID || localJson.oAuthClientId || '1091755957864-ql3jhuaqk0bsovne4ev0de78t7r3enr1.apps.googleusercontent.com',
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.apiKey.length > 5 &&
  firebaseConfig.apiKey !== 'YOUR_FIREBASE_API_KEY' &&
  firebaseConfig.projectId
);
