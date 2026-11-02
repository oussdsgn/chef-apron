import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Features, RichText } from "@/components/Sections";
import { getT } from "@/lib/i18n/server";
import { getSettings } from "@/lib/store";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT();
  return { title: t("footer.about") };
}

export default async function AboutPage() {
  const { locale, t } = await getT();
  const settings = await getSettings(locale);
  const { about } = settings;
  return (
    <>
      <section className="container section section--tight">
        <div className="split">
          <div className="prose">
            {about.eyebrow && <span className="eyebrow">{about.eyebrow}</span>}
            <h1>{about.title}</h1>
            <RichText text={about.body} />
            <Link href="/products" className="btn btn--dark">
              {t("about.shop")}
            </Link>
          </div>
          {about.image && (
            <div className="split__art">
              <Image src={about.image} alt="" fill sizes="(max-width: 900px) 100vw, 50vw" className="cover" />
            </div>
          )}
        </div>
      </section>
      {about.values.length > 0 && (
        <section className="container section">
          <div className="values">
            {about.values.map((v) => (
              <div key={v.title} className="value">
                <h3>{v.title}</h3>
                <p>{v.text}</p>
              </div>
            ))}
          </div>
        </section>
      )}
      <Features settings={settings} locale={locale} />
    </>
  );
}
