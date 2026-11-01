"use client";

import Link from "next/link";
import { useEffect } from "react";
import { getProduct } from "@/lib/products";
import { formatPrice, site } from "@/lib/site";
import { lineKey, useCart } from "./CartProvider";
import { CloseIcon } from "./Icons";
import ProductImage from "./ProductImage";
import CheckoutButton from "./CheckoutButton";

export function CartLines({ compact }: { compact?: boolean }) {
  const { lines, setQuantity, remove } = useCart();
  return (
    <ul className={`cart-lines ${compact ? "cart-lines--compact" : ""}`}>
      {lines.map((line) => {
        const product = getProduct(line.slug);
        if (!product) return null;
        const color = product.colors.find((c) => c.name === line.color);
        const key = lineKey(line);
        return (
          <li key={key} className="cart-line">
            <Link href={`/products/${product.slug}`} className="cart-line__media">
              <ProductImage product={product} color={color?.hex} sizes="96px" />
            </Link>
            <div className="cart-line__info">
              <div className="cart-line__top">
                <Link href={`/products/${product.slug}`} className="cart-line__name">
                  {product.name}
                </Link>
                <span>{formatPrice(product.price * line.quantity)}</span>
              </div>
              <span className="muted">
                {line.color}
                {line.size ? ` · ${line.size}` : ""}
              </span>
              <div className="cart-line__controls">
                <div className="qty">
                  <button onClick={() => setQuantity(key, line.quantity - 1)} aria-label="Decrease quantity">
                    −
                  </button>
                  <span aria-live="polite">{line.quantity}</span>
                  <button onClick={() => setQuantity(key, line.quantity + 1)} aria-label="Increase quantity">
                    +
                  </button>
                </div>
                <button className="link-btn" onClick={() => remove(key)}>
                  Remove
                </button>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export function ShippingProgress() {
  const { subtotal } = useCart();
  const remaining = site.freeShippingThreshold - subtotal;
  const pct = Math.min(100, (subtotal / site.freeShippingThreshold) * 100);
  return (
    <div className="ship-progress">
      <p>
        {remaining > 0 ? (
          <>
            You&apos;re <strong>{formatPrice(remaining)}</strong> away from free shipping
          </>
        ) : (
          <>You&apos;ve unlocked free shipping</>
        )}
      </p>
      <div className="ship-progress__bar">
        <span style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function CartDrawer() {
  const { isOpen, close, lines, subtotal, count } = useCart();

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, close]);

  return (
    <div className={`drawer ${isOpen ? "is-open" : ""}`} aria-hidden={!isOpen}>
      <div className="drawer__backdrop" onClick={close} />
      <aside className="drawer__panel" role="dialog" aria-modal="true" aria-label="Shopping cart">
        <div className="drawer__head">
          <h2>Your cart {count > 0 && <span className="muted">({count})</span>}</h2>
          <button className="icon-btn" onClick={close} aria-label="Close cart">
            <CloseIcon />
          </button>
        </div>
        {lines.length === 0 ? (
          <div className="drawer__empty">
            <p>Your cart is empty.</p>
            <Link href="/products" className="btn btn--dark" onClick={close}>
              Shop collection
            </Link>
          </div>
        ) : (
          <>
            <ShippingProgress />
            <div className="drawer__body">
              <CartLines compact />
            </div>
            <div className="drawer__foot">
              <div className="row-between">
                <span>Subtotal</span>
                <strong>{formatPrice(subtotal)}</strong>
              </div>
              <p className="muted small">Delivery fee calculated at checkout. Pay cash on delivery.</p>
              <CheckoutButton />
              <Link href="/cart" className="btn btn--ghost btn--block" onClick={close}>
                View cart
              </Link>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
