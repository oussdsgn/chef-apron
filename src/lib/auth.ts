import "server-only";
import type { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { redirect } from "next/navigation";
import { db } from "./db";

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
  const sql = await db();
  const [row] = await sql`select 1 from admins where email = ${e}`;
  return Boolean(row);
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  session: { strategy: "jwt", maxAge: 7 * 24 * 60 * 60 },
  pages: { signIn: "/admin/login", error: "/admin/login" },
  callbacks: {
    async signIn({ user, profile }) {
      // Google marks whether the address is verified; refuse unverified ones.
      const verified = (profile as { email_verified?: boolean } | undefined)?.email_verified;
      if (verified === false) return false;
      return isAdminEmail(user.email);
    },
  },
};

/** Returns the signed-in admin, or null. Re-checks the admin list every time so removals apply immediately. */
export async function getAdmin() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;
  if (!email || !(await isAdminEmail(email))) return null;
  return { email: email.toLowerCase(), name: session.user?.name ?? email, image: session.user?.image ?? undefined };
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
