import type { Metadata } from "next";
import ProductCard from "@/components/ProductCard";
import { searchProducts } from "@/lib/store";

export const metadata: Metadata = { title: "Search" };

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const q = (await searchParams).q ?? "";
  const results = await searchProducts(q);
  return (
    <section className="container section section--tight">
      <div className="page-head">
        <h1>Search</h1>
      </div>
      <form action="/search" className="search-form" role="search">
        <input name="q" defaultValue={q} placeholder="Search aprons, jackets, knives…" autoFocus aria-label="Search products" />
        <button className="btn btn--dark">Search</button>
      </form>
      {q && (
        <p className="muted">
          {results.length} result{results.length === 1 ? "" : "s"} for &ldquo;{q}&rdquo;
        </p>
      )}
      <div className="grid">
        {results.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>
    </section>
  );
}
