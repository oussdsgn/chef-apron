import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { formatPrice, site } from "@/lib/site";

const pages: Record<string, { title: string; body: React.ReactNode }> = {
  "shipping-policy": {
    title: "Shipping policy",
    body: (
      <>
        <p>We deliver to all 58 wilayas of Algeria. After you place an order we call you to confirm it, then it ships within 1–2 business days.</p>
        <h2>Rates</h2>
        <p>Delivery is free on orders over {formatPrice(site.freeShippingThreshold)}. Below that, home delivery costs {formatPrice(site.shippingFee)} ({formatPrice(site.shippingFeeSouth)} for southern wilayas).</p>
        <h2>Delivery times</h2>
        <p>Orders usually arrive in 2–5 business days in the north and 4–8 business days in the south.</p><h2>Payment</h2><p>You pay in cash to the delivery agent when your order arrives.</p>
      </>
    ),
  },
  "returns-refunds": {
    title: "Returns & refunds",
    body: (
      <>
        <p>We accept returns of unworn, unwashed items in their original condition within 30 days of delivery.</p>
        <h2>How to return</h2>
        <p>Email <a href={`mailto:${site.email}`}>{site.email}</a> with your order number and we&apos;ll send you return instructions.</p>
        <h2>Refunds</h2>
        <p>Refunds are issued within 5 business days of us receiving the return. Knives and personalised or embroidered items can&apos;t be returned unless faulty.</p>
      </>
    ),
  },
  "privacy-policy": {
    title: "Privacy policy",
    body: (
      <>
        <p>We collect only the information needed to process your order and, if you opt in, to send you our newsletter.</p>
        <h2>Orders</h2>
        <p>Your name, phone number and delivery address are used only to confirm and deliver your order, and are shared only with our delivery partner.</p>
        <h2>Your data</h2>
        <p>We don&apos;t sell your data. To access or delete the information we hold about you, email <a href={`mailto:${site.email}`}>{site.email}</a>.</p>
      </>
    ),
  },
};

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return Object.keys(pages).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const page = pages[(await params).slug];
  return page ? { title: page.title } : {};
}

export default async function LegalPage({ params }: Params) {
  const page = pages[(await params).slug];
  if (!page) notFound();
  return (
    <section className="container section section--tight prose prose--narrow">
      <h1>{page.title}</h1>
      {page.body}
    </section>
  );
}
