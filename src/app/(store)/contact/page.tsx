import type { Metadata } from "next";
import ContactForm from "./ContactForm";
import { getT } from "@/lib/i18n/server";
import { getSettings } from "@/lib/store";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT();
  return { title: t("contact.eyebrow") };
}

export default async function ContactPage() {
  const { locale, t } = await getT();
  const { store } = await getSettings(locale);
  return (
    <section className="container section section--tight">
      <div className="split">
        <div className="prose">
          <span className="eyebrow">{t("contact.eyebrow")}</span>
          <h1>{t("contact.title")}</h1>
          <p>{t("contact.intro")}</p>
          <dl className="contact-list">
            {store.email && (
              <>
                <dt>{t("contact.email")}</dt>
                <dd>
                  <a href={`mailto:${store.email}`}>{store.email}</a>
                </dd>
              </>
            )}
            {store.phone && (
              <>
                <dt>{t("contact.phone")}</dt>
                <dd>
                  <a href={`tel:${store.phone.replace(/[^+\d]/g, "")}`} dir="ltr">
                    {store.phone}
                  </a>
                </dd>
              </>
            )}
            {store.address && (
              <>
                <dt>{t("contact.address")}</dt>
                <dd>
                  {store.address.split("\n").map((l) => (
                    <span key={l} className="block">
                      {l}
                    </span>
                  ))}
                </dd>
              </>
            )}
          </dl>
        </div>
        <ContactForm email={store.email} />
      </div>
    </section>
  );
}
