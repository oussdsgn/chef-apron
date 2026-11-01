import type { Metadata } from "next";
import ContactForm from "./ContactForm";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
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
            <dt>Email</dt>
            <dd>
              <a href={`mailto:${site.email}`}>{site.email}</a>
            </dd>
            <dt>Phone</dt>
            <dd>{site.phone}</dd>
            <dt>Address</dt>
            <dd>
              {site.address.map((l) => (
                <span key={l} className="block">
                  {l}
                </span>
              ))}
            </dd>
          </dl>
        </div>
        <ContactForm />
      </div>
    </section>
  );
}
