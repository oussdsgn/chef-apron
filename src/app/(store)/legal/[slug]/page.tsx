import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RichText } from "@/components/Sections";
import { formatPrice } from "@/lib/format";
import { getSettings } from "@/lib/store";
import type { Settings } from "@/lib/types";

const pages: Record<string, { title: string; key: keyof Settings["pages"] }> = {
  "shipping-policy": { title: "Shipping policy", key: "shipping" },
  "returns-refunds": { title: "Returns & refunds", key: "returns" },
  "privacy-policy": { title: "Privacy policy", key: "privacy" },
};

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const page = pages[(await params).slug];
  return page ? { title: page.title } : {};
}

export default async function LegalPage({ params }: Params) {
  const page = pages[(await params).slug];
  if (!page) notFound();
  const settings = await getSettings();
  const tokens = {
    freeThreshold: formatPrice(settings.shipping.freeThreshold),
    fee: formatPrice(settings.shipping.fee),
    southFee: formatPrice(settings.shipping.southFee),
    email: settings.store.email,
    phone: settings.store.phone,
  };
  return (
    <section className="container section section--tight prose prose--narrow">
      <h1>{page.title}</h1>
      <RichText text={settings.pages[page.key]} tokens={tokens} />
    </section>
  );
}
