import Link from "next/link";
import { site } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div className="footer__brand">
          <Link href="/" className="wordmark wordmark--light">
            APRON
          </Link>
          <p>{site.tagline}</p>
          <div className="footer__social">
            <a href={site.social.instagram} target="_blank" rel="noreferrer">
              Instagram
            </a>
            <a href={site.social.tiktok} target="_blank" rel="noreferrer">
              TikTok
            </a>
            <a href={site.social.facebook} target="_blank" rel="noreferrer">
              Facebook
            </a>
          </div>
        </div>
        <div>
          <h4>Shop</h4>
          <Link href="/collections/aprons">Aprons</Link>
          <Link href="/collections/uniforms">Chef uniforms</Link>
          <Link href="/collections/utensils">Utensils</Link>
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
          <a href={`mailto:${site.email}`}>{site.email}</a>
          <a href={`tel:${site.phone.replace(/[^+\d]/g, "")}`}>{site.phone}</a>
        </div>
      </div>
      <div className="container footer__bottom">
        <span>
          © {new Date().getFullYear()} {site.name}. All rights reserved.
        </span>
      </div>
    </footer>
  );
}
