import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import { translator } from "@/lib/i18n/messages";
import type { Category, Settings } from "@/lib/types";
import Logo from "@/components/Logo";

export default function Footer({
  settings,
  categories,
  locale,
}: {
  settings: Settings;
  categories: Category[];
  locale: Locale;
}) {
  const { store } = settings;
  const t = translator(locale);
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
            <Logo alt={store.name} light />
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
          <h4>{t("footer.shop")}</h4>
          {categories.map((c) => (
            <Link key={c.slug} href={`/collections/${c.slug}`}>
              {c.name}
            </Link>
          ))}
          <Link href="/products">{t("footer.allProducts")}</Link>
        </div>
        <div>
          <h4>{t("footer.information")}</h4>
          <Link href="/legal/shipping-policy">{t("legal.shipping")}</Link>
          <Link href="/legal/returns-refunds">{t("legal.returns")}</Link>
          <Link href="/legal/privacy-policy">{t("legal.privacy")}</Link>
          <Link href="/size-guide">{t("size.title")}</Link>
        </div>
        <div>
          <h4>{t("footer.company")}</h4>
          <Link href="/about">{t("footer.about")}</Link>
          <Link href="/contact">{t("nav.contact")}</Link>
          {store.email && <a href={`mailto:${store.email}`}>{store.email}</a>}
          {store.phone && (
            <a href={`tel:${store.phone.replace(/[^+\d]/g, "")}`} dir="ltr">
              {store.phone}
            </a>
          )}
        </div>
      </div>
      <div className="container footer__bottom">
        <span>
          © {new Date().getFullYear()} {store.name}. {t("footer.rights")}
        </span>
      </div>
    </footer>
  );
}
