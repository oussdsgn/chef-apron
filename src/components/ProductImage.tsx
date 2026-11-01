import Image from "next/image";
import type { Product } from "@/lib/types";
import ProductArt from "./ProductArt";

export default function ProductImage({
  product,
  color,
  priority,
  sizes = "(max-width: 900px) 50vw, 33vw",
}: {
  product: Product;
  /** Hex of the selected color; picks that color's photo when there is one. */
  color?: string;
  priority?: boolean;
  sizes?: string;
}) {
  const option = color ? product.colors.find((c) => c.hex === color) : undefined;
  const src = option?.image ?? product.image;

  if (src) {
    return (
      <Image
        key={src}
        src={src}
        alt={option ? `${product.name} in ${option.name}` : product.name}
        fill
        sizes={sizes}
        priority={priority}
        className="product-photo"
      />
    );
  }
  return <ProductArt kind={product.art} color={color ?? product.colors[0].hex} className="product-art" />;
}
