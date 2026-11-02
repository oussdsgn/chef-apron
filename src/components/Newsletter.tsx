"use client";

import { useState } from "react";
import { useStore } from "./StoreProvider";

export default function Newsletter({ dark }: { dark?: boolean }) {
  const { t } = useStore();
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

  if (status === "done") return <p className="form-success">{t("newsletter.thanks")}</p>;

  return (
    <form className={`inline-form ${dark ? "inline-form--dark" : ""}`} onSubmit={submit}>
      <label className="sr-only" htmlFor="newsletter-email">
        {t("newsletter.label")}
      </label>
      <input
        id="newsletter-email"
        type="email"
        required
        placeholder={t("newsletter.placeholder")}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button className="btn btn--dark btn--small" disabled={status === "loading"}>
        {status === "loading" ? "…" : t("newsletter.signup")}
      </button>
      {status === "error" && <p className="notice">{t("newsletter.invalid")}</p>}
    </form>
  );
}
