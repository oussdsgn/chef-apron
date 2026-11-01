import { NextResponse } from "next/server";

export async function POST(req: Request) {
  let email = "";
  try {
    email = String((await req.json()).email ?? "").trim();
  } catch {
    /* fall through */
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  // TODO: connect your email provider here (Mailchimp, Klaviyo, Resend, ConvertKit…).
  // Until then, sign-ups are only written to the server logs (visible in Vercel → Logs).
  console.log("Newsletter sign-up:", email);

  return NextResponse.json({ ok: true });
}
