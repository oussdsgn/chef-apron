"use client";

import Link from "next/link";
import { CartLines, ShippingProgress } from "@/components/CartDrawer";
import { useCart } from "@/components/CartProvider";
import CheckoutButton from "@/components/CheckoutButton";
import { useStore } from "@/components/StoreProvider";

export default function CartPage() {
  const { lines, subtotal } = useCart();
  const { t, price } = useStore();
  return (
    <section className="container section section--tight">
      <div className="page-head">
        <h1>{t("cart.title")}</h1>
      </div>
      {lines.length === 0 ? (
        <div className="empty">
          <p>{t("cart.empty")}</p>
          <Link href="/products" className="btn btn--dark">
            {t("cart.shopCollection")}
          </Link>
        </div>
      ) : (
        <div className="cart-page">
          <CartLines />
          <aside className="summary">
            <h2>{t("cart.summary")}</h2>
            <ShippingProgress />
            <div className="row-between">
              <span>{t("cart.subtotal")}</span>
              <strong>{price(subtotal)}</strong>
            </div>
            <p className="muted small">{t("cart.note")}</p>
            <CheckoutButton />
          </aside>
        </div>
      )}
    </section>
  );
}
