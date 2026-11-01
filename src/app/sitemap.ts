import type { MetadataRoute } from "next";
import { categories, products } from "@/lib/products";

export default function sitemap(): MetadataRoute.Sitemap {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000");
  const paths = [
    "",
    "/products",
    "/about",
    "/contact",
    "/size-guide",
    ...categories.map((c) => `/collections/${c.slug}`),
    ...products.map((p) => `/products/${p.slug}`),
  ];
  return paths.map((p) => ({ url: `${base}${p}` }));
}
