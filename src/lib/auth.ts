import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { COL, db, emailId } from "./db";
import { adminAuth } from "./firebase-admin";

export const SESSION_COOKIE = "apron_session";
export const SESSION_DAYS = 7;

/** Emails in ADMIN_EMAILS (comma-separated) are always admins and can add others from the dashboard. */
export function ownerEmails() {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export async function isAdminEmail(email?: string | null) {
  if (!email) return false;
  const e = email.toLowerCase();
  if (ownerEmails().includes(e)) return true;
  const doc = await (await db()).collection(COL.admins).doc(emailId(e)).get();
  return doc.exists;
}

/** Returns the signed-in admin, or null. Re-checks the admin list every time so removals apply immediately. */
export async function getAdmin() {
  const cookie = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!cookie) return null;
  try {
    // true = also reject sessions revoked by signing out
    const claims = await (await adminAuth()).verifySessionCookie(cookie, true);
    const email = claims.email?.toLowerCase();
    if (!email || !claims.email_verified || !(await isAdminEmail(email))) return null;
    return {
      email,
      name: (claims.name as string | undefined) ?? email,
      image: (claims.picture as string | undefined) ?? undefined,
      uid: claims.uid,
    };
  } catch {
    return null;
  }
}

/** For pages: sends visitors who aren't admins to the login page. */
export async function requireAdminPage() {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}

/** For server actions: throws if the caller isn't an admin. */
export async function requireAdmin() {
  const admin = await getAdmin();
  if (!admin) throw new Error("Not authorised");
  return admin;
}
