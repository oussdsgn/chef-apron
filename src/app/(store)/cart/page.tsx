"use client";

import Link from "next/link";
import { CartLines, ShippingProgress } from "@/components/CartDrawer";
import { useCart } from "@/components/CartProvider";
import CheckoutButton from "@/components/CheckoutButton";
import { formatPrice } from "@/lib/format";

export default function CartPage() {
  const { lines, subtotal } = useCart();
  return (
    <section className="container section section--tight">
      <div className="page-head">
        <h1>Your cart</h1>
      </div>
      {lines.length === 0 ? (
        <div className="empty">
          <p>Your cart is empty.</p>
          <Link href="/products" className="btn btn--dark">
            Shop collection
          </Link>
        </div>
      ) : (
        <div className="cart-page">
          <CartLines />
          <aside className="summary">
            <h2>Order summary</h2>
            <ShippingProgress />
            <div className="row-between">
              <span>Subtotal</span>
              <strong>{formatPrice(subtotal)}</strong>
            </div>
            <p className="muted small">Delivery fee calculated at checkout. Pay cash on delivery.</p>
            <CheckoutButton />
          </aside>
        </div>
      )}
    </section>
  );
}
