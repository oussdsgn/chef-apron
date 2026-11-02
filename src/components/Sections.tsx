import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/format";
import type { Locale } from "@/lib/i18n/config";
import { translator } from "@/lib/i18n/messages";
import type { Category, Settings } from "@/lib/types";
import { ChatIcon, LockIcon, ReturnIcon, StarIcon, TruckIcon } from "./Icons";
import Newsletter from "./Newsletter";

export function Features({ settings, locale = "en" }: { settings: Settings; locale?: Locale }) {
  const t = translator(locale);
  const items = [
    {
      icon: <TruckIcon />,
      title: t("features.delivery"),
      text:
        settings.shipping.freeThreshold > 0
          ? t("features.freeOver", { amount: formatPrice(settings.shipping.freeThreshold, locale) })
          : t("features.homeDelivery"),
    },
    { icon: <ReturnIcon />, title: t("features.returns"), text: t("features.returnsText") },
    { icon: <ChatIcon />, title: t("features.support"), text: t("features.supportText") },
    { icon: <LockIcon />, title: t("features.cod"), text: t("features.codText") },
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

export function Testimonial({ settings, locale = "en" }: { settings: Settings; locale?: Locale }) {
  const { testimonialQuote, testimonialAuthor } = settings.home;
  if (!testimonialQuote) return null;
  return (
    <section className="testimonial">
      <div className="container testimonial__inner">
        <div className="stars" aria-label={translator(locale)("testimonial.stars")}>
          {Array.from({ length: 5 }).map((_, i) => (
            <StarIcon key={i} />
          ))}
        </div>
        <blockquote>&ldquo;{testimonialQuote}&rdquo;</blockquote>
        {testimonialAuthor && <p className="testimonial__by">— {testimonialAuthor}</p>}
      </div>
    </section>
  );
}

export function Collections({
  settings,
  categories,
  locale = "en",
}: {
  settings: Settings;
  categories: Category[];
  locale?: Locale;
}) {
  const t = translator(locale);
  if (categories.length === 0) return null;
  const [first, ...rest] = categories;
  const tile = (c: Category, big?: boolean) => (
    <Link key={c.slug} href={`/collections/${c.slug}`} className={`collection-tile ${big ? "collection-tile--big" : ""}`}>
      {c.image && (
        <Image src={c.image} alt="" fill sizes="(max-width: 900px) 100vw, 50vw" className="collection-tile__photo" />
      )}
      <h3>{c.title}</h3>
      <span className="collection-tile__cta">{t("collections.shopNow")}</span>
    </Link>
  );
  return (
    <section className="container section">
      <div className="section-head section-head--center">
        <h2>{settings.home.collectionsTitle}</h2>
        <p>{settings.home.collectionsText}</p>
      </div>
      <div className="collections">
        {tile(first, true)}
        {rest.length > 0 && <div className="collections__stack">{rest.map((c) => tile(c))}</div>}
      </div>
    </section>
  );
}

export function NewsletterBanner({ settings }: { settings: Settings }) {
  const { newsletterTitle, newsletterText, newsletterImage } = settings.home;
  return (
    <section className="container section">
      <div className="newsletter">
        <div className="newsletter__copy">
          <h2>{newsletterTitle}</h2>
          <p>{newsletterText}</p>
          <Newsletter />
        </div>
        <div className="newsletter__art">
          {newsletterImage && (
            <Image src={newsletterImage} alt="" fill sizes="(max-width: 900px) 100vw, 50vw" className="cover" />
          )}
        </div>
      </div>
    </section>
  );
}

/** Renders admin-written text: blank lines separate paragraphs, "## " starts a heading, {tokens} are replaced. */
export function RichText({ text, tokens = {} }: { text: string; tokens?: Record<string, string> }) {
  const blocks = text
    .replace(/\{(\w+)\}/g, (m, k: string) => tokens[k] ?? m)
    .split(/\n\s*\n/)
    .map((b) => b.trim())
    .filter(Boolean);
  return (
    <>
      {blocks.map((b, i) =>
        b.startsWith("## ") ? (
          <h2 key={i}>{b.slice(3)}</h2>
        ) : (
          <p key={i}>
            {b.split("\n").map((line, j, arr) => (
              <span key={j}>
                {line}
                {j < arr.length - 1 && <br />}
              </span>
            ))}
          </p>
        ),
      )}
    </>
  );
}
