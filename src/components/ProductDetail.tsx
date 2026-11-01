"use client";

import { useState } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/types";
import { useCart } from "./CartProvider";
import { useStore } from "./StoreProvider";
import ProductImage from "./ProductImage";

export default function ProductDetail({ product }: { product: Product }) {
  const { add } = useCart();
  const [color, setColor] = useState(product.colors[0]);
  const [size, setSize] = useState<string | undefined>(product.sizes?.length === 1 ? product.sizes[0] : undefined);
  const [qty, setQty] = useState(1);
  const [error, setError] = useState(false);
  const { getCategory, settings } = useStore();
  const category = getCategory(product.category);

  function addToCart() {
    if (product.sizes && !size) {
      setError(true);
      return;
    }
    add({ slug: product.slug, color: color.name, size, quantity: qty });
  }

  return (
    <div className="pdp">
      <div className="pdp__media">
        <ProductImage product={product} color={color.hex} priority sizes="(max-width: 900px) 100vw, 55vw" />
      </div>

      <div className="pdp__info">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <Link href="/products">Shop</Link>
          <span>/</span>
          {category && <Link href={`/collections/${category.slug}`}>{category.name}</Link>}
        </nav>
        <h1>{product.name}</h1>
        <p className="pdp__price">
          {formatPrice(product.price)}
          {product.compareAtPrice && <s>{formatPrice(product.compareAtPrice)}</s>}
        </p>
        <p className="pdp__short">{product.short}</p>

        <div className="option">
          <span className="option__label">
            Color: <strong>{color.name}</strong>
          </span>
          <div className="swatches">
            {product.colors.map((c) => (
              <button
                key={c.name}
                className={`swatch swatch--btn ${c.name === color.name ? "is-selected" : ""}`}
                style={{ background: c.hex }}
                aria-label={c.name}
                aria-pressed={c.name === color.name}
                onClick={() => setColor(c)}
              />
            ))}
          </div>
        </div>

        {product.sizes && (
          <div className="option">
            <span className="option__label">
              Size{size ? <>: <strong>{size}</strong></> : null}
              {product.category === "uniforms" && (
                <Link href="/size-guide" className="option__link">
                  Size guide
                </Link>
              )}
            </span>
            <div className="chips">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  className={`chip ${s === size ? "is-selected" : ""}`}
                  aria-pressed={s === size}
                  onClick={() => {
                    setSize(s);
                    setError(false);
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
            {error && <p className="notice">Please choose a size.</p>}
          </div>
        )}

        <div className="pdp__buy">
          <div className="qty qty--large">
            <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity">
              −
            </button>
            <span>{qty}</span>
            <button onClick={() => setQty((q) => Math.min(99, q + 1))} aria-label="Increase quantity">
              +
            </button>
          </div>
          <button className="btn btn--dark btn--grow" onClick={addToCart} disabled={!product.inStock}>
            {product.inStock ? <>Add to cart — {formatPrice(product.price * qty)}</> : "Out of stock"}
          </button>
        </div>

        <p className="muted small">
          {settings.shipping.freeThreshold > 0 && <>Free delivery over {formatPrice(settings.shipping.freeThreshold)} · </>}
          Cash on delivery · 30-day returns
        </p>

        <details className="accordion" open>
          <summary>Description</summary>
          <p>{product.description}</p>
        </details>
        <details className="accordion">
          <summary>Details &amp; care</summary>
          <ul>
            {product.details.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        </details>
        <details className="accordion">
          <summary>Shipping &amp; returns</summary>
          <p>
            We deliver to all 58 wilayas and you pay cash on delivery. Orders ship within 1–2 business days. Unworn, unwashed items can be returned within 30 days.{" "}
            <Link href="/legal/shipping-policy">Read more</Link>
          </p>
        </details>
      </div>
    </div>
  );
}
