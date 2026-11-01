import type { Metadata } from "next";
import ContactForm from "./ContactForm";
import { getSettings } from "@/lib/store";

export const metadata: Metadata = { title: "Contact" };

export default async function ContactPage() {
  const { store } = await getSettings();
  return (
    <section className="container section section--tight">
      <div className="split">
        <div className="prose">
          <span className="eyebrow">Contact</span>
          <h1>We&apos;re here to help.</h1>
          <p>
            Questions about sizing, bulk orders for your restaurant team, or custom embroidery? Send us a message and
            we&apos;ll get back to you within one business day.
          </p>
          <dl className="contact-list">
            {store.email && (
              <>
                <dt>Email</dt>
                <dd>
                  <a href={`mailto:${store.email}`}>{store.email}</a>
                </dd>
              </>
            )}
            {store.phone && (
              <>
                <dt>Phone</dt>
                <dd>
                  <a href={`tel:${store.phone.replace(/[^+\d]/g, "")}`}>{store.phone}</a>
                </dd>
              </>
            )}
            {store.address && (
              <>
                <dt>Address</dt>
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
