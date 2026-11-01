import { NextResponse } from "next/server";
import { SESSION_COOKIE, SESSION_DAYS, getAdmin, isAdminEmail } from "@/lib/auth";
import { adminAuth } from "@/lib/firebase-admin";

/** Exchanges a Firebase ID token (from Google sign-in in the browser) for an httpOnly session cookie. */
export async function POST(req: Request) {
  let idToken = "";
  try {
    idToken = String((await req.json()).idToken ?? "");
  } catch {
    /* fall through */
  }
  if (!idToken) return NextResponse.json({ error: "Missing token" }, { status: 400 });

  try {
    const decoded = await adminAuth().verifyIdToken(idToken, true);
    // Only accept a fresh sign-in (within the last 5 minutes).
    if (Date.now() / 1000 - decoded.auth_time > 5 * 60) {
      return NextResponse.json({ error: "Please sign in again." }, { status: 401 });
    }
    if (!decoded.email || !decoded.email_verified || !(await isAdminEmail(decoded.email))) {
      return NextResponse.json(
        { error: "This Google account isn't allowed to manage the store. Ask the owner to add you." },
        { status: 403 },
      );
    }
    const expiresIn = SESSION_DAYS * 24 * 60 * 60 * 1000;
    const session = await adminAuth().createSessionCookie(idToken, { expiresIn });
    const res = NextResponse.json({ ok: true });
    res.cookies.set(SESSION_COOKIE, session, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: expiresIn / 1000,
    });
    return res;
  } catch (err) {
    console.error("Sign-in failed", err);
    return NextResponse.json({ error: "Sign-in failed. Please try again." }, { status: 401 });
  }
}

/** Signs out: revokes the session everywhere and clears the cookie. */
export async function DELETE() {
  const admin = await getAdmin();
  if (admin) {
    try {
      await adminAuth().revokeRefreshTokens(admin.uid);
    } catch {
      /* ignore */
    }
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
  return res;
}
