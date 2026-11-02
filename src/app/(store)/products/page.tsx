import type { Metadata } from "next";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { getT } from "@/lib/i18n/server";
import { getCategories, getProducts } from "@/lib/store";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT();
  return { title: t("shop.title") };
}

const sorts = ["featured", "price-asc", "price-desc", "name"] as const;
type Sort = (typeof sorts)[number];

export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ sort?: string }> }) {
  const { sort: rawSort } = await searchParams;
  const { locale, t } = await getT();
  const [products, categories] = await Promise.all([getProducts(locale), getCategories(locale)]);
  const sort: Sort = (sorts as readonly string[]).includes(rawSort ?? "") ? (rawSort as Sort) : "featured";
  const list = [...products];
  if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
  if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
  if (sort === "name") list.sort((a, b) => a.name.localeCompare(b.name, locale));

  return (
    <section className="container section section--tight">
      <div className="page-head">
        <h1>{t("shop.title")}</h1>
        <p>{t("shop.count", { count: products.length })}</p>
      </div>
      <div className="toolbar">
        <div className="chips">
          <Link href="/products" className="chip is-selected">
            {t("shop.all")}
          </Link>
          {categories.map((c) => (
            <Link key={c.slug} href={`/collections/${c.slug}`} className="chip">
              {c.name}
            </Link>
          ))}
        </div>
        <div className="sort">
          <span className="muted">{t("shop.sort")}</span>
          {sorts.map((s) => (
            <Link key={s} href={s === "featured" ? "/products" : `/products?sort=${s}`} className={s === sort ? "is-active" : ""}>
              {t(`shop.sort.${s}`)}
            </Link>
          ))}
        </div>
      </div>
      <div className="grid">
        {list.map((p) => (
          <ProductCard key={p.slug} product={p} locale={locale} />
        ))}
      </div>
    </section>
  );
}
