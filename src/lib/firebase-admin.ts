import "server-only";
import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

/**
 * Credentials, in order of preference:
 *  1. FIREBASE_SERVICE_ACCOUNT: the whole service-account JSON file pasted as one value
 *  2. FIREBASE_PROJECT_ID + FIREBASE_CLIENT_EMAIL + FIREBASE_PRIVATE_KEY
 *  3. Local emulators (FIRESTORE_EMULATOR_HOST set): only a project id is needed
 */
function credentials() {
  const json = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (json) {
    const sa = JSON.parse(json) as { project_id: string; client_email: string; private_key: string };
    return { projectId: sa.project_id, clientEmail: sa.client_email, privateKey: sa.private_key };
  }
  const { FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY } = process.env;
  if (FIREBASE_PROJECT_ID && FIREBASE_CLIENT_EMAIL && FIREBASE_PRIVATE_KEY) {
    return {
      projectId: FIREBASE_PROJECT_ID,
      clientEmail: FIREBASE_CLIENT_EMAIL,
      // Vercel stores newlines in the key as "\n"
      privateKey: FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    };
  }
  return null;
}

function app(): App {
  const existing = getApps()[0];
  if (existing) return existing;
  const creds = credentials();
  const storageBucket = process.env.FIREBASE_STORAGE_BUCKET || undefined;
  if (creds) {
    return initializeApp({ credential: cert(creds), projectId: creds.projectId, storageBucket });
  }
  if (process.env.FIRESTORE_EMULATOR_HOST) {
    return initializeApp({ projectId: process.env.FIREBASE_PROJECT_ID ?? "demo-apron", storageBucket });
  }
  throw new Error(
    "Firebase is not configured. Set FIREBASE_SERVICE_ACCOUNT (the service-account JSON) on Vercel and redeploy.",
  );
}

declare global {
  // eslint-disable-next-line no-var
  var __apronFirestore: Firestore | undefined;
}

export function firestore() {
  if (!globalThis.__apronFirestore) {
    const db = getFirestore(app());
    db.settings({ ignoreUndefinedProperties: true });
    globalThis.__apronFirestore = db;
  }
  return globalThis.__apronFirestore;
}

export const adminAuth = () => getAuth(app());
export const storageBucket = () => (process.env.FIREBASE_STORAGE_BUCKET ? getStorage(app()).bucket() : null);
