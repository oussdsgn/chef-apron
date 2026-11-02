import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RichText } from "@/components/Sections";
import { formatPrice } from "@/lib/format";
import { getT } from "@/lib/i18n/server";
import type { MessageKey } from "@/lib/i18n/messages";
import { getSettings } from "@/lib/store";
import type { Settings } from "@/lib/types";

const pages: Record<string, { title: MessageKey; key: keyof Settings["pages"] }> = {
  "shipping-policy": { title: "legal.shipping", key: "shipping" },
  "returns-refunds": { title: "legal.returns", key: "returns" },
  "privacy-policy": { title: "legal.privacy", key: "privacy" },
};

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const page = pages[(await params).slug];
  return page ? { title: (await getT()).t(page.title) } : {};
}

export default async function LegalPage({ params }: Params) {
  const page = pages[(await params).slug];
  if (!page) notFound();
  const { locale, t } = await getT();
  const settings = await getSettings(locale);
  const tokens = {
    freeThreshold: formatPrice(settings.shipping.freeThreshold, locale),
    fee: formatPrice(settings.shipping.fee, locale),
    southFee: formatPrice(settings.shipping.southFee, locale),
    email: settings.store.email,
    phone: settings.store.phone,
  };
  return (
    <section className="container section section--tight prose prose--narrow">
      <h1>{t(page.title)}</h1>
      <RichText text={settings.pages[page.key]} tokens={tokens} />
    </section>
  );
}
