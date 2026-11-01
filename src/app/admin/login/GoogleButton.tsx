"use client";

import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { clientAuth, firebaseConfigured } from "@/lib/firebase-client";

export default function GoogleButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(
    firebaseConfigured ? null : "Firebase isn't configured yet. Add the NEXT_PUBLIC_FIREBASE_* variables on Vercel.",
  );

  async function signIn() {
    setLoading(true);
    setError(null);
    const auth = clientAuth();
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
      const cred = await signInWithPopup(auth, provider);
      const idToken = await cred.user.getIdToken();
      const res = await fetch("/api/admin/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });
      // The server keeps its own session cookie; the browser-side Firebase session isn't needed.
      await signOut(auth);
      if (res.ok) {
        router.replace("/admin");
        router.refresh();
        return;
      }
      setError(((await res.json()) as { error?: string }).error ?? "Sign-in failed.");
    } catch (err) {
      const code = (err as { code?: string }).code;
      if (code === "auth/popup-closed-by-user" || code === "auth/cancelled-popup-request") setError(null);
      else if (code === "auth/unauthorized-domain")
        setError("This domain isn't authorised in Firebase. Add it under Authentication → Settings → Authorised domains.");
      else if (code === "auth/popup-blocked") setError("Your browser blocked the sign-in window. Allow pop-ups and try again.");
      else setError("Sign-in failed. Please try again.");
    }
    setLoading(false);
  }

  return (
    <>
      {error && <p className="login__error">{error}</p>}
      <button className="google-btn" disabled={loading || !firebaseConfigured} onClick={signIn}>
        <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
          <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
          <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
          <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z" />
          <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
        </svg>
        {loading ? "Signing in…" : "Continue with Google"}
      </button>
    </>
  );
}
