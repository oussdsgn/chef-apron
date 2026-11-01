import { NextResponse } from "next/server";
import { COL, db, emailId } from "@/lib/db";

export async function POST(req: Request) {
  let email = "";
  try {
    email = String((await req.json()).email ?? "")
      .trim()
      .toLowerCase();
  } catch {
    /* fall through */
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }
  try {
    const ref = (await db()).collection(COL.subscribers).doc(emailId(email));
    if (!(await ref.get()).exists) await ref.set({ email, createdAt: new Date() });
  } catch (err) {
    console.error("Newsletter sign-up failed", err);
    return NextResponse.json({ error: "Please try again later." }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
