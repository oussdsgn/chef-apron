import Image from "next/image";
import type { Product } from "@/lib/products";
import ProductArt from "./ProductArt";

export default function ProductImage({
  product,
  color,
  priority,
  sizes = "(max-width: 768px) 100vw, 33vw",
}: {
  product: Product;
  color?: string;
  priority?: boolean;
  sizes?: string;
}) {
  if (product.image) {
    return (
      <Image
        src={product.image}
        alt={product.name}
        fill
        sizes={sizes}
        priority={priority}
        style={{ objectFit: "cover" }}
      />
    );
  }
  return <ProductArt kind={product.art} color={color ?? product.colors[0].hex} className="product-art" />;
}
