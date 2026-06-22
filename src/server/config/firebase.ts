import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

let initialized = false;

try {
  if (!getApps().length) {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n');

    if (!projectId || !clientEmail || !privateKey || privateKey.includes('YOUR_KEY_HERE')) {
      console.warn(
        '⚠ Firebase Admin credentials not configured. ' +
        'Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY in .env'
      );
    } else {
      initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
      initialized = true;
    }
  } else {
    initialized = true;
  }
} catch (err) {
  console.error('Firebase Admin initialization failed:', err);
}

export const db = initialized ? getFirestore() : null;
export const auth = initialized ? getAuth() : null;
