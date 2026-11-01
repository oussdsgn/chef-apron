import Image from "next/image";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { Collections, Features, NewsletterBanner, Testimonial } from "@/components/Sections";
import { getCategories, getSettings, newArrivals } from "@/lib/store";

export default async function HomePage() {
  const [arrivals, settings, categories] = await Promise.all([newArrivals(6), getSettings(), getCategories()]);
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
              All products
            </Link>
          </div>
          <div className="grid">
            {arrivals.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      )}

      <Testimonial settings={settings} />
      <Collections settings={settings} categories={categories} />
      <NewsletterBanner settings={settings} />
      <Features settings={settings} />
    </>
  );
}
