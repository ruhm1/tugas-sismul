import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

if (!getApps().length) {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n');

  if (!projectId || !clientEmail || !privateKey) {
    console.warn(
      'Firebase Admin credentials not fully configured. ' +
      'Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY in .env'
    );
  }

  initializeApp({
    credential: cert({
      projectId: projectId || 'placeholder',
      clientEmail: clientEmail || 'placeholder@placeholder.iam.gserviceaccount.com',
      privateKey: privateKey || 'placeholder',
    }),
  });
}

export const db = getFirestore();
export const auth = getAuth();
