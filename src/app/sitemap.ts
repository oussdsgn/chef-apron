import type { MetadataRoute } from "next";
import { getCategories, getProducts } from "@/lib/store";
import { siteUrl } from "@/lib/url";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);
  const paths = [
    "",
    "/products",
    "/about",
    "/contact",
    "/size-guide",
    ...categories.map((c) => `/collections/${c.slug}`),
    ...products.map((p) => `/products/${p.slug}`),
  ];
  return paths.map((p) => ({ url: `${siteUrl.replace(/\/$/, "")}${p}` }));
}
