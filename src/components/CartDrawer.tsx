"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useStore } from "./StoreProvider";
import { lineKey, useCart } from "./CartProvider";
import { CloseIcon } from "./Icons";
import ProductImage from "./ProductImage";
import CheckoutButton from "./CheckoutButton";

export function CartLines({ compact }: { compact?: boolean }) {
  const { lines, setQuantity, remove } = useCart();
  const { getProduct, t, price } = useStore();
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
                <span>{price(product.price * line.quantity)}</span>
              </div>
              <span className="muted">
                {color?.label ?? line.color}
                {line.size ? ` · ${product.sizeLabels?.[line.size] ?? line.size}` : ""}
              </span>
              <div className="cart-line__controls">
                <div className="qty">
                  <button onClick={() => setQuantity(key, line.quantity - 1)} aria-label={t("pdp.decrease")}>
                    −
                  </button>
                  <span aria-live="polite">{line.quantity}</span>
                  <button onClick={() => setQuantity(key, line.quantity + 1)} aria-label={t("pdp.increase")}>
                    +
                  </button>
                </div>
                <button className="link-btn" onClick={() => remove(key)}>
                  {t("cart.remove")}
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
  const { settings, t, price } = useStore();
  const threshold = settings.shipping.freeThreshold;
  const remaining = threshold - subtotal;
  if (threshold <= 0) return null;
  const pct = Math.min(100, (subtotal / threshold) * 100);
  return (
    <div className="ship-progress">
      <p>
        {remaining > 0
          ? (() => {
              // Bold the amount wherever it falls in the translated sentence.
              const [before, after] = t("cart.away", { amount: "\u0000" }).split("\u0000");
              return (
                <>
                  {before}
                  <strong>{price(remaining)}</strong>
                  {after}
                </>
              );
            })()
          : t("cart.unlocked")}
      </p>
      <div className="ship-progress__bar">
        <span style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function CartDrawer() {
  const { isOpen, close, lines, subtotal, count } = useCart();
  const { t, price } = useStore();

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
      <aside className="drawer__panel" role="dialog" aria-modal="true" aria-label={t("cart.title")}>
        <div className="drawer__head">
          <h2>
            {t("cart.title")} {count > 0 && <span className="muted">({count})</span>}
          </h2>
          <button className="icon-btn" onClick={close} aria-label={t("cart.close")}>
            <CloseIcon />
          </button>
        </div>
        {lines.length === 0 ? (
          <div className="drawer__empty">
            <p>{t("cart.empty")}</p>
            <Link href="/products" className="btn btn--dark" onClick={close}>
              {t("cart.shopCollection")}
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
                <span>{t("cart.subtotal")}</span>
                <strong>{price(subtotal)}</strong>
              </div>
              <p className="muted small">{t("cart.note")}</p>
              <CheckoutButton />
              <Link href="/cart" className="btn btn--ghost btn--block" onClick={close}>
                {t("cart.view")}
              </Link>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
