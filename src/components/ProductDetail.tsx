"use client";

import { useState } from "react";
import Link from "next/link";
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
  const { getCategory, settings, t, price } = useStore();
  const category = getCategory(product.category);
  const sizeLabel = (s: string) => product.sizeLabels?.[s] ?? s;

  function addToCart() {
    if (product.sizes && !size) {
      setError(true);
      return;
    }
    // The cart stores the canonical (English) colour and size, so orders are the same in every language.
    add({ slug: product.slug, color: color.name, size, quantity: qty });
  }

  return (
    <div className="pdp">
      <div className="pdp__media">
        <ProductImage product={product} color={color.hex} priority sizes="(max-width: 900px) 100vw, 55vw" />
      </div>

      <div className="pdp__info">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <Link href="/products">{t("pdp.breadcrumbShop")}</Link>
          <span>/</span>
          {category && <Link href={`/collections/${category.slug}`}>{category.name}</Link>}
        </nav>
        <h1>{product.name}</h1>
        <p className="pdp__price">
          {price(product.price)}
          {product.compareAtPrice && <s>{price(product.compareAtPrice)}</s>}
        </p>
        <p className="pdp__short">{product.short}</p>

        <div className="option">
          <span className="option__label">
            {t("pdp.color")}: <strong>{color.label ?? color.name}</strong>
          </span>
          <div className="swatches">
            {product.colors.map((c) => (
              <button
                key={c.name}
                className={`swatch swatch--btn ${c.name === color.name ? "is-selected" : ""}`}
                style={{ background: c.hex }}
                aria-label={c.label ?? c.name}
                aria-pressed={c.name === color.name}
                onClick={() => setColor(c)}
              />
            ))}
          </div>
        </div>

        {product.sizes && (
          <div className="option">
            <span className="option__label">
              {t("pdp.size")}
              {size ? (
                <>
                  : <strong>{sizeLabel(size)}</strong>
                </>
              ) : null}
              {product.category === "uniforms" && (
                <Link href="/size-guide" className="option__link">
                  {t("pdp.sizeGuide")}
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
                  {sizeLabel(s)}
                </button>
              ))}
            </div>
            {error && <p className="notice">{t("pdp.chooseSize")}</p>}
          </div>
        )}

        <div className="pdp__buy">
          <div className="qty qty--large">
            <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label={t("pdp.decrease")}>
              −
            </button>
            <span>{qty}</span>
            <button onClick={() => setQty((q) => Math.min(99, q + 1))} aria-label={t("pdp.increase")}>
              +
            </button>
          </div>
          <button className="btn btn--dark btn--grow" onClick={addToCart} disabled={!product.inStock}>
            {product.inStock ? t("pdp.addToCart", { price: price(product.price * qty) }) : t("pdp.outOfStock")}
          </button>
        </div>

        <p className="muted small">
          {settings.shipping.freeThreshold > 0 && (
            <>{t("pdp.freeOver", { amount: price(settings.shipping.freeThreshold) })} · </>
          )}
          {t("pdp.perks")}
        </p>

        <details className="accordion" open>
          <summary>{t("pdp.description")}</summary>
          <p>{product.description}</p>
        </details>
        {product.details.length > 0 && (
          <details className="accordion">
            <summary>{t("pdp.details")}</summary>
            <ul>
              {product.details.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
          </details>
        )}
        <details className="accordion">
          <summary>{t("pdp.shipping")}</summary>
          <p>
            {t("pdp.shippingText")} <Link href="/legal/shipping-policy">{t("pdp.readMore")}</Link>
          </p>
        </details>
      </div>
    </div>
  );
}
