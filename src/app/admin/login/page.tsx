import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAdmin } from "@/lib/auth";
import GoogleButton from "./GoogleButton";
import "../admin.css";

export const metadata: Metadata = { title: "Sign in", robots: { index: false } };
export const dynamic = "force-dynamic";

const errors: Record<string, string> = {
  AccessDenied: "This Google account isn't allowed to manage the store. Ask the owner to add you.",
  Configuration: "Google sign-in isn't configured yet. Check GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET and NEXTAUTH_SECRET.",
  OAuthSignin: "Couldn't reach Google. Please try again.",
  OAuthCallback: "Google sign-in was cancelled or failed. Please try again.",
};

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  let admin = null;
  try {
    admin = await getAdmin();
  } catch {
    /* database not configured yet: show the login screen anyway */
  }
  if (admin) redirect("/admin");

  return (
    <div className="login">
      <div className="login__card">
        <span className="wordmark">APRON</span>
        <h1>Store dashboard</h1>
        <p className="muted">Sign in with your Google account to manage orders, products and content.</p>
        {error && <p className="login__error">{errors[error] ?? "Sign-in failed. Please try again."}</p>}
        <GoogleButton />
      </div>
    </div>
  );
}
