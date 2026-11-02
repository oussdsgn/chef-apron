import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import ProductDetail from "@/components/ProductDetail";
import { Features } from "@/components/Sections";
import { getT } from "@/lib/i18n/server";
import { getProduct, getProducts, getSettings } from "@/lib/store";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale } = await getT();
  const product = await getProduct((await params).slug, locale);
  if (!product) return {};
  return { title: product.name, description: product.short };
}

export default async function ProductPage({ params }: Params) {
  const { locale, t } = await getT();
  const product = await getProduct((await params).slug, locale);
  if (!product) notFound();
  const [products, settings] = await Promise.all([getProducts(locale), getSettings(locale)]);

  const related = products.filter((p) => p.category === product.category && p.slug !== product.slug).slice(0, 3);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    brand: { "@type": "Brand", name: settings.store.name },
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "DZD",
      availability: product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
  };

  return (
    <>
      <section className="container section section--tight">
        <ProductDetail product={product} />
      </section>
      {related.length > 0 && (
        <section className="container section">
          <div className="section-head">
            <h2>{t("pdp.related")}</h2>
          </div>
          <div className="grid">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} locale={locale} />
            ))}
          </div>
        </section>
      )}
      <Features settings={settings} locale={locale} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
