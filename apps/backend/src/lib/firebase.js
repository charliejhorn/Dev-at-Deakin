// initialize and export a singleton firestore admin instance
const admin = require('firebase-admin');

let initialized = false;
let db;

function initFirebase() {
  if (initialized && db) return db;
  try {
    // prefer explicit service account json via base64 env var
    if (!admin.apps.length) {
      const saB64 = process.env.FIREBASE_SERVICE_ACCOUNT;
      if (saB64) {
        // parse service account from base64
        const json = Buffer.from(saB64, 'base64').toString('utf8');
        const creds = JSON.parse(json);
        admin.initializeApp({
          credential: admin.credential.cert(creds),
          projectId: process.env.FIRESTORE_PROJECT_ID || creds.project_id,
        });
      } else {
        // fallback to adc or GOOGLE_APPLICATION_CREDENTIALS
        admin.initializeApp({
          credential: admin.credential.applicationDefault(),
          projectId: process.env.FIRESTORE_PROJECT_ID,
        });
      }
    }
    db = admin.firestore();
    initialized = true;
    return db;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('firestore not initialized. set FIREBASE_SERVICE_ACCOUNT (base64) or GOOGLE_APPLICATION_CREDENTIALS.');
    return null;
  }
}

module.exports = { initFirebase };
