import Link from "next/link";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import ProductImage from "./ProductImage";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/products/${product.slug}`} className="product-card">
      <div className="product-card__media">
        <ProductImage product={product} />
        {product.compareAtPrice ? (
          <span className="badge">Sale</span>
        ) : product.isNew ? (
          <span className="badge">New</span>
        ) : null}
        <span className="product-card__view">View product</span>
      </div>
      <div className="product-card__info">
        <span className="product-card__name">{product.name}</span>
        <span className="product-card__price">
          {formatPrice(product.price)}
          {product.compareAtPrice && <s>{formatPrice(product.compareAtPrice)}</s>}
        </span>
      </div>
      {product.colors.length > 1 && (
        <div className="swatches swatches--small" aria-label={`${product.colors.length} colors`}>
          {product.colors.map((c) => (
            <span key={c.name} className="swatch" style={{ background: c.hex }} title={c.name} />
          ))}
        </div>
      )}
    </Link>
  );
}
