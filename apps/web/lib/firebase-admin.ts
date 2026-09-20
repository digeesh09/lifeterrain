import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  try {
    const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    if (serviceAccountKey) {
      const serviceAccount = JSON.parse(serviceAccountKey);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    } else {
      console.warn("FIREBASE_SERVICE_ACCOUNT_KEY is not set in environment variables.");
    }
  } catch (error) {
    console.error('Firebase Admin Initialization Error:', error);
    // Fallback for development if env var is missing, but will fail in production
    // You MUST set FIREBASE_SERVICE_ACCOUNT_KEY in cPanel environment variables
  }
}

export const adminDb = admin.apps.length ? admin.firestore() : null;
