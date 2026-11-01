import Link from "next/link";
import type { Category, Settings } from "@/lib/types";

export default function Footer({ settings, categories }: { settings: Settings; categories: Category[] }) {
  const { store } = settings;
  const social = [
    ["Instagram", store.instagram],
    ["TikTok", store.tiktok],
    ["Facebook", store.facebook],
  ].filter(([, url]) => url);
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div className="footer__brand">
          <Link href="/" className="wordmark wordmark--light">
            {store.name.toUpperCase()}
          </Link>
          <p>{store.tagline}</p>
          <div className="footer__social">
            {social.map(([label, url]) => (
              <a key={label} href={url} target="_blank" rel="noreferrer">
                {label}
              </a>
            ))}
          </div>
        </div>
        <div>
          <h4>Shop</h4>
          {categories.map((c) => (
            <Link key={c.slug} href={`/collections/${c.slug}`}>
              {c.name}
            </Link>
          ))}
          <Link href="/products">All products</Link>
        </div>
        <div>
          <h4>Information</h4>
          <Link href="/legal/shipping-policy">Shipping policy</Link>
          <Link href="/legal/returns-refunds">Returns &amp; refunds</Link>
          <Link href="/legal/privacy-policy">Privacy policy</Link>
          <Link href="/size-guide">Size guide</Link>
        </div>
        <div>
          <h4>Company</h4>
          <Link href="/about">About us</Link>
          <Link href="/contact">Contact</Link>
          {store.email && <a href={`mailto:${store.email}`}>{store.email}</a>}
          {store.phone && <a href={`tel:${store.phone.replace(/[^+\d]/g, "")}`}>{store.phone}</a>}
        </div>
      </div>
      <div className="container footer__bottom">
        <span>
          © {new Date().getFullYear()} {store.name}. All rights reserved.
        </span>
      </div>
    </footer>
  );
}
