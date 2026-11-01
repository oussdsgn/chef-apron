"use client";

import { useState } from "react";
import { useCart } from "./CartProvider";

export default function CheckoutButton() {
  const { lines } = useCart();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function checkout() {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lines }),
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (res.ok && data.url) {
        window.location.href = data.url;
        return;
      }
      setMessage(data.error ?? "Something went wrong. Please try again.");
    } catch {
      setMessage("Could not reach the checkout. Check your connection and try again.");
    }
    setLoading(false);
  }

  return (
    <>
      <button className="btn btn--dark btn--block" onClick={checkout} disabled={loading || lines.length === 0}>
        {loading ? "Redirecting…" : "Checkout"}
      </button>
      {message && (
        <p className="notice" role="alert">
          {message}
        </p>
      )}
    </>
  );
}
