"use client";

import { useState } from "react";

export default function Newsletter({ dark }: { dark?: boolean }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setStatus(res.ok ? "done" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") return <p className="form-success">Thanks — you&apos;re on the list.</p>;

  return (
    <form className={`inline-form ${dark ? "inline-form--dark" : ""}`} onSubmit={submit}>
      <label className="sr-only" htmlFor="newsletter-email">
        Email address
      </label>
      <input
        id="newsletter-email"
        type="email"
        required
        placeholder="you@restaurant.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button className="btn btn--dark btn--small" disabled={status === "loading"}>
        {status === "loading" ? "…" : "Sign up"}
      </button>
      {status === "error" && <p className="notice">Please enter a valid email.</p>}
    </form>
  );
}
