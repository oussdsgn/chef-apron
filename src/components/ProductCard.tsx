import Link from "next/link";
import { formatPrice } from "@/lib/format";
import type { Locale } from "@/lib/i18n/config";
import { translator } from "@/lib/i18n/messages";
import type { Product } from "@/lib/types";
import ProductImage from "./ProductImage";

export default function ProductCard({ product, locale = "en" }: { product: Product; locale?: Locale }) {
  const t = translator(locale);
  return (
    <Link href={`/products/${product.slug}`} className="product-card">
      <div className="product-card__media">
        <ProductImage product={product} />
        {product.compareAtPrice ? (
          <span className="badge">{t("card.sale")}</span>
        ) : product.isNew ? (
          <span className="badge">{t("card.new")}</span>
        ) : null}
        <span className="product-card__view">{t("card.view")}</span>
      </div>
      <div className="product-card__info">
        <span className="product-card__name">{product.name}</span>
        <span className="product-card__price">
          {formatPrice(product.price, locale)}
          {product.compareAtPrice && <s>{formatPrice(product.compareAtPrice, locale)}</s>}
        </span>
      </div>
      {product.colors.length > 1 && (
        <div className="swatches swatches--small" aria-label={t("card.colors", { count: product.colors.length })}>
          {product.colors.map((c) => (
            <span key={c.name} className="swatch" style={{ background: c.hex }} title={c.label ?? c.name} />
          ))}
        </div>
      )}
    </Link>
  );
}
