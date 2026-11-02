import type { Metadata } from "next";
import ProductCard from "@/components/ProductCard";
import { getT } from "@/lib/i18n/server";
import { searchProducts } from "@/lib/store";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT();
  return { title: t("search.title") };
}

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const q = (await searchParams).q ?? "";
  const { locale, t } = await getT();
  const results = await searchProducts(q, locale);
  return (
    <section className="container section section--tight">
      <div className="page-head">
        <h1>{t("search.title")}</h1>
      </div>
      <form action="/search" className="search-form" role="search">
        <input name="q" defaultValue={q} placeholder={t("search.placeholder")} autoFocus aria-label={t("search.title")} />
        <button className="btn btn--dark">{t("search.button")}</button>
      </form>
      {q && <p className="muted">{t("search.results", { count: results.length, q })}</p>}
      <div className="grid">
        {results.map((p) => (
          <ProductCard key={p.slug} product={p} locale={locale} />
        ))}
      </div>
    </section>
  );
}
