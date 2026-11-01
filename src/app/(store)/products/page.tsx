import type { Metadata } from "next";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { getCategories, getProducts } from "@/lib/store";

export const metadata: Metadata = { title: "Shop all" };

const sorts = {
  featured: "Featured",
  "price-asc": "Price: low to high",
  "price-desc": "Price: high to low",
  name: "Name",
} as const;
type Sort = keyof typeof sorts;

export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ sort?: string }> }) {
  const { sort: rawSort } = await searchParams;
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);
  const sort: Sort = rawSort && rawSort in sorts ? (rawSort as Sort) : "featured";
  const list = [...products];
  if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
  if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
  if (sort === "name") list.sort((a, b) => a.name.localeCompare(b.name));

  return (
    <section className="container section section--tight">
      <div className="page-head">
        <h1>Shop all</h1>
        <p>{products.length} products for the kitchen and the pass.</p>
      </div>
      <div className="toolbar">
        <div className="chips">
          <Link href="/products" className="chip is-selected">
            All
          </Link>
          {categories.map((c) => (
            <Link key={c.slug} href={`/collections/${c.slug}`} className="chip">
              {c.name}
            </Link>
          ))}
        </div>
        <div className="sort">
          <span className="muted">Sort:</span>
          {(Object.keys(sorts) as Sort[]).map((s) => (
            <Link key={s} href={s === "featured" ? "/products" : `/products?sort=${s}`} className={s === sort ? "is-active" : ""}>
              {sorts[s]}
            </Link>
          ))}
        </div>
      </div>
      <div className="grid">
        {list.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>
    </section>
  );
}
