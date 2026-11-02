import { NextResponse } from "next/server";
import { firestore } from "@/lib/firebase-admin";

export const dynamic = "force-dynamic";

/**
 * Setup check: shows which settings are present (never their values) and whether Firestore answers.
 * Open https://YOUR-DOMAIN/api/health after changing environment variables on Vercel.
 */
export async function GET() {
  const env = process.env;
  let serviceAccount: string;
  if (env.FIREBASE_SERVICE_ACCOUNT) {
    try {
      const sa = JSON.parse(env.FIREBASE_SERVICE_ACCOUNT);
      serviceAccount = sa.project_id && sa.client_email && sa.private_key ? `ok (project ${sa.project_id})` : "JSON is missing project_id, client_email or private_key";
    } catch {
      serviceAccount = "FIREBASE_SERVICE_ACCOUNT is not valid JSON: paste the whole downloaded file";
    }
  } else if (env.FIREBASE_PROJECT_ID && env.FIREBASE_CLIENT_EMAIL && env.FIREBASE_PRIVATE_KEY) {
    serviceAccount = `ok (project ${env.FIREBASE_PROJECT_ID}, separate variables)`;
  } else {
    serviceAccount = "missing: set FIREBASE_SERVICE_ACCOUNT";
  }

  let database: string;
  try {
    await (await firestore()).collection("meta").doc("seed").get();
    database = "ok";
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    database = /NOT_FOUND/.test(msg)
      ? "Firestore database not found: create it in Firebase console → Firestore Database"
      : /PERMISSION_DENIED/.test(msg)
        ? "permission denied: the service account can't access this project's Firestore"
        : msg.slice(0, 300);
  }

  const publicConfig = ["NEXT_PUBLIC_FIREBASE_API_KEY", "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN", "NEXT_PUBLIC_FIREBASE_PROJECT_ID", "NEXT_PUBLIC_FIREBASE_APP_ID"]
    .filter((k) => !env[k])
    .map((k) => `${k} missing`);

  const report = {
    node: process.version,
    serviceAccount,
    database,
    signInConfig: publicConfig.length ? publicConfig : "ok",
    adminEmails: env.ADMIN_EMAILS ? `${env.ADMIN_EMAILS.split(",").filter(Boolean).length} owner(s)` : "missing: set ADMIN_EMAILS",
    photoStorage: env.FIREBASE_STORAGE_BUCKET ? `Firebase Storage (${env.FIREBASE_STORAGE_BUCKET})` : "Firestore",
  };
  const healthy = database === "ok" && report.signInConfig === "ok" && Boolean(env.ADMIN_EMAILS);
  return NextResponse.json(report, { status: healthy ? 200 : 503, headers: { "Cache-Control": "no-store" } });
}
