import Image from "next/image";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { Collections, Features, NewsletterBanner, Testimonial } from "@/components/Sections";
import { getT } from "@/lib/i18n/server";
import { getCategories, getSettings, newArrivals } from "@/lib/store";

export default async function HomePage() {
  const { locale, t } = await getT();
  const [arrivals, settings, categories] = await Promise.all([
    newArrivals(6, locale),
    getSettings(locale),
    getCategories(locale),
  ]);
  const { home } = settings;
  return (
    <>
      <section className="container">
        <div className="hero">
          <h1 className="hero__title">{home.heroTitle}</h1>
          {home.heroImage && (
            <Image src={home.heroImage} alt="" fill priority sizes="100vw" className="hero__photo" />
          )}
          <div className="hero__actions">
            <Link href="/products" className="btn btn--light">
              {home.heroCta}
            </Link>
            {home.heroEyebrow && <span className="hero__eyebrow">{home.heroEyebrow}</span>}
          </div>
        </div>
      </section>

      {arrivals.length > 0 && (
        <section className="container section">
          <div className="section-head">
            <div>
              <h2>{home.arrivalsTitle}</h2>
              <p>{home.arrivalsText}</p>
            </div>
            <Link href="/products" className="underline-link">
              {t("home.allProducts")}
            </Link>
          </div>
          <div className="grid">
            {arrivals.map((p) => (
              <ProductCard key={p.slug} product={p} locale={locale} />
            ))}
          </div>
        </section>
      )}

      <Testimonial settings={settings} locale={locale} />
      <Collections settings={settings} categories={categories} locale={locale} />
      <NewsletterBanner settings={settings} />
      <Features settings={settings} locale={locale} />
    </>
  );
}
