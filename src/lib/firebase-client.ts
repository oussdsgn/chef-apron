"use client";

import { getApps, initializeApp } from "firebase/app";
import { connectAuthEmulator, getAuth } from "firebase/auth";

/** Public web-app config from Firebase console → Project settings → Your apps. */
const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const firebaseConfigured = Boolean(config.apiKey && config.authDomain && config.projectId);

export function clientAuth() {
  const app = getApps()[0] ?? initializeApp(config);
  const auth = getAuth(app);
  const emulator = process.env.NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR;
  if (emulator && !(auth as unknown as { _emulatorConfig?: unknown })._emulatorConfig) {
    connectAuthEmulator(auth, emulator, { disableWarnings: true });
  }
  return auth;
}
