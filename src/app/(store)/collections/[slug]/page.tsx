import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import { getT } from "@/lib/i18n/server";
import { getCategories, getCategory, productsIn } from "@/lib/store";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale } = await getT();
  const category = await getCategory((await params).slug, locale);
  return category ? { title: category.title, description: category.blurb } : {};
}

export default async function CollectionPage({ params }: Params) {
  const { locale, t } = await getT();
  const category = await getCategory((await params).slug, locale);
  if (!category) notFound();
  const [list, categories] = await Promise.all([productsIn(category.slug, locale), getCategories(locale)]);

  return (
    <section className="container section section--tight">
      <div className="page-head">
        <h1>{category.title}</h1>
        <p>{category.blurb}</p>
      </div>
      <div className="toolbar">
        <div className="chips">
          <Link href="/products" className="chip">
            {t("shop.all")}
          </Link>
          {categories.map((c) => (
            <Link key={c.slug} href={`/collections/${c.slug}`} className={`chip ${c.slug === category.slug ? "is-selected" : ""}`}>
              {c.name}
            </Link>
          ))}
        </div>
        <span className="muted">{t("shop.products", { count: list.length })}</span>
      </div>
      <div className="grid">
        {list.map((p) => (
          <ProductCard key={p.slug} product={p} locale={locale} />
        ))}
      </div>
    </section>
  );
}
