"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useCart } from "@/components/CartProvider";

export default function SuccessPage() {
  const { clear } = useCart();
  useEffect(() => clear(), [clear]);
  return (
    <section className="container section">
      <div className="empty">
        <h1>Thank you for your order</h1>
        <p>We&apos;ve received your order and sent a confirmation to your email. It ships within 1–2 business days.</p>
        <Link href="/products" className="btn btn--dark">
          Continue shopping
        </Link>
      </div>
    </section>
  );
}
