import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAdmin } from "@/lib/auth";
import GoogleButton from "./GoogleButton";
import "../admin.css";

export const metadata: Metadata = { title: "Sign in", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function LoginPage() {
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
        <GoogleButton />
      </div>
    </div>
  );
}
