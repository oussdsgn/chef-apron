import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import Image from "next/image";
import { Collections, Features, NewsletterBanner, Testimonial } from "@/components/Sections";
import { newArrivals } from "@/lib/products";

export default function HomePage() {
  const arrivals = newArrivals(6);
  return (
    <>
      <section className="container">
        <div className="hero">
          <h1 className="hero__title">Workwear for the line, made to last</h1>
          <Image
            src="/images/site/hero.jpg"
            alt="A chef in a white jacket preparing vegetables in a professional kitchen"
            fill
            priority
            sizes="100vw"
            className="hero__photo"
          />
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
