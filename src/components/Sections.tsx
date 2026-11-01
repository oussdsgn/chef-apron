import Link from "next/link";
import { categories, productsIn } from "@/lib/products";
import { formatPrice, site } from "@/lib/site";
import { ChatIcon, LockIcon, ReturnIcon, StarIcon, TruckIcon } from "./Icons";
import ProductArt from "./ProductArt";
import Newsletter from "./Newsletter";

export function Features() {
  const items = [
    { icon: <TruckIcon />, title: "Free shipping", text: `On orders over ${formatPrice(site.freeShippingThreshold)}` },
    { icon: <ReturnIcon />, title: "30-day returns", text: "Unworn items, no questions" },
    { icon: <ChatIcon />, title: "Chef support", text: "Sizing help by phone & email" },
    { icon: <LockIcon />, title: "Secure payments", text: "Processed by Stripe" },
  ];
  return (
    <section className="container features">
      {items.map((f) => (
        <div key={f.title} className="feature">
          {f.icon}
          <div>
            <h6>{f.title}</h6>
            <p>{f.text}</p>
          </div>
        </div>
      ))}
    </section>
  );
}

export function Testimonial() {
  return (
    <section className="testimonial">
      <div className="container testimonial__inner">
        <div className="stars" aria-label="5 out of 5 stars">
          {Array.from({ length: 5 }).map((_, i) => (
            <StarIcon key={i} />
          ))}
        </div>
        <blockquote>
          &ldquo;The cross-back apron survived a full summer on the grill station. Comfortable from the first shift
          to the last.&rdquo;
        </blockquote>
        <p className="testimonial__by">— Head chef, independent restaurant</p>
      </div>
    </section>
  );
}

export function Collections() {
  const [first, ...rest] = categories;
  const tile = (slug: string, title: string, big?: boolean) => {
    const sample = productsIn(slug as never)[0];
    return (
      <Link key={slug} href={`/collections/${slug}`} className={`collection-tile ${big ? "collection-tile--big" : ""}`}>
        <h3>{title}</h3>
        <span className="collection-tile__cta">Shop now →</span>
        <div className="collection-tile__art">
          <ProductArt kind={sample.art} color={sample.colors[0].hex} />
        </div>
      </Link>
    );
  };
  return (
    <section className="container section">
      <div className="section-head section-head--center">
        <h2>Our collections</h2>
        <p>Everything you wear and hold in the kitchen, made to work as hard as you do.</p>
      </div>
      <div className="collections">
        {tile(first.slug, first.title, true)}
        <div className="collections__stack">{rest.map((c) => tile(c.slug, c.title))}</div>
      </div>
    </section>
  );
}

export function NewsletterBanner() {
  return (
    <section className="container section">
      <div className="newsletter">
        <div className="newsletter__copy">
          <h2>Join the brigade. Get 10% off your first order.</h2>
          <p>New drops, restocks and recipes from chefs who wear our aprons. No spam.</p>
          <Newsletter />
        </div>
        <div className="newsletter__art" aria-hidden>
          <ProductArt kind="apron-cross" color="#c9b99a" />
        </div>
      </div>
    </section>
  );
}
