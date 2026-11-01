import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import { getCategories, getCategory, productsIn } from "@/lib/store";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const category = await getCategory((await params).slug);
  return category ? { title: category.title, description: category.blurb } : {};
}

export default async function CollectionPage({ params }: Params) {
  const category = await getCategory((await params).slug);
  if (!category) notFound();
  const [list, categories] = await Promise.all([productsIn(category.slug), getCategories()]);

  return (
    <section className="container section section--tight">
      <div className="page-head">
        <h1>{category.title}</h1>
        <p>{category.blurb}</p>
      </div>
      <div className="toolbar">
        <div className="chips">
          <Link href="/products" className="chip">
            All
          </Link>
          {categories.map((c) => (
            <Link key={c.slug} href={`/collections/${c.slug}`} className={`chip ${c.slug === category.slug ? "is-selected" : ""}`}>
              {c.name}
            </Link>
          ))}
        </div>
        <span className="muted">{list.length} products</span>
      </div>
      <div className="grid">
        {list.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>
    </section>
  );
}
