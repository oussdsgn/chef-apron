import "server-only";
import type { App } from "firebase-admin/app";
import type { Auth } from "firebase-admin/auth";
import type { Firestore } from "firebase-admin/firestore";

/*
 * firebase-admin is loaded lazily (dynamic import) rather than when the server starts.
 * If loading or configuring it fails, the error surfaces inside the request, where pages
 * fall back to built-in content and /api/health can report the exact message, instead of
 * crashing every page of the site.
 */

/**
 * Credentials, in order of preference:
 *  1. FIREBASE_SERVICE_ACCOUNT: the whole service-account JSON file pasted as one value
 *  2. FIREBASE_PROJECT_ID + FIREBASE_CLIENT_EMAIL + FIREBASE_PRIVATE_KEY
 *  3. Local emulators (FIRESTORE_EMULATOR_HOST set): only a project id is needed
 */
function credentials() {
  const json = process.env.FIREBASE_SERVICE_ACCOUNT?.trim();
  if (json) {
    let sa: { project_id?: string; client_email?: string; private_key?: string };
    try {
      sa = JSON.parse(json);
    } catch {
      throw new Error("FIREBASE_SERVICE_ACCOUNT is not valid JSON. Paste the whole downloaded file, unchanged.");
    }
    if (!sa.project_id || !sa.client_email || !sa.private_key) {
      throw new Error("FIREBASE_SERVICE_ACCOUNT is missing project_id, client_email or private_key.");
    }
    return { projectId: sa.project_id, clientEmail: sa.client_email, privateKey: sa.private_key.replace(/\\n/g, "\n") };
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

declare global {
  // eslint-disable-next-line no-var
  var __apronApp: Promise<App> | undefined;
  // eslint-disable-next-line no-var
  var __apronFirestore: Promise<Firestore> | undefined;
}

async function createApp(): Promise<App> {
  const { cert, getApps, initializeApp } = await import("firebase-admin/app");
  const existing = getApps()[0];
  if (existing) return existing;
  const creds = credentials();
  const storageBucket = process.env.FIREBASE_STORAGE_BUCKET || undefined;
  if (creds) return initializeApp({ credential: cert(creds), projectId: creds.projectId, storageBucket });
  if (process.env.FIRESTORE_EMULATOR_HOST) {
    return initializeApp({ projectId: process.env.FIREBASE_PROJECT_ID ?? "demo-apron", storageBucket });
  }
  throw new Error("Firebase is not configured. Set FIREBASE_SERVICE_ACCOUNT (the service-account JSON) on Vercel and redeploy.");
}

/** Retries on the next request if setup failed (e.g. after fixing an environment variable). */
function memo<T>(key: "__apronApp" | "__apronFirestore", make: () => Promise<T>): Promise<T> {
  const g = globalThis as unknown as Record<string, Promise<T> | undefined>;
  g[key] ??= make().catch((err) => {
    g[key] = undefined;
    throw err;
  });
  return g[key]!;
}

export const firebaseApp = () => memo("__apronApp", createApp);

export function firestore(): Promise<Firestore> {
  return memo("__apronFirestore", async () => {
    const [{ getFirestore }, app] = await Promise.all([import("firebase-admin/firestore"), firebaseApp()]);
    const db = getFirestore(app);
    db.settings({ ignoreUndefinedProperties: true });
    return db;
  });
}

export async function adminAuth(): Promise<Auth> {
  const [{ getAuth }, app] = await Promise.all([import("firebase-admin/auth"), firebaseApp()]);
  return getAuth(app);
}

export async function storageBucket() {
  if (!process.env.FIREBASE_STORAGE_BUCKET) return null;
  const [{ getStorage }, app] = await Promise.all([import("firebase-admin/storage"), firebaseApp()]);
  return getStorage(app).bucket();
}
