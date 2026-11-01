import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import ProductArt from "@/components/ProductArt";
import { Collections, Features, NewsletterBanner, Testimonial } from "@/components/Sections";
import { newArrivals } from "@/lib/products";

export default function HomePage() {
  const arrivals = newArrivals(6);
  return (
    <>
      <section className="container">
        <div className="hero">
          <h1 className="hero__title">Workwear for the line, made to last</h1>
          <div className="hero__art" aria-hidden>
            <div className="hero__art-item hero__art-item--a">
              <ProductArt kind="apron-cross" color="#c9b99a" />
            </div>
            <div className="hero__art-item hero__art-item--b">
              <ProductArt kind="jacket" color="#f4f2ee" />
            </div>
            <div className="hero__art-item hero__art-item--c">
              <ProductArt kind="knife" color="#5b3b28" />
            </div>
          </div>
          <div className="hero__actions">
            <Link href="/products" className="btn btn--light">
              Shop collection
            </Link>
            <span className="hero__eyebrow">Cook like a pro</span>
          </div>
        </div>
      </section>

      <section className="container section">
        <div className="section-head">
          <div>
            <h2>New arrivals</h2>
            <p>Fresh off the cutting table: our newest aprons, jackets and tools.</p>
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

      <Testimonial />
      <Collections />
      <NewsletterBanner />
      <Features />
    </>
  );
}
