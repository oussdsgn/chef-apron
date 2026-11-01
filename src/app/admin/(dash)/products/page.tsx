import type { Metadata } from "next";
import Link from "next/link";
import ProductImage from "@/components/ProductImage";
import Toggle from "@/components/admin/Toggle";
import { PageHead } from "@/components/admin/ui";
import { toggleProduct } from "@/app/admin/actions";
import { formatPrice } from "@/lib/format";
import { listAllCategories, listAllProducts } from "@/lib/store";

export const metadata: Metadata = { title: "Products" };

export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ q?: string; c?: string }> }) {
  const { q = "", c = "" } = await searchParams;
  const [all, categories] = await Promise.all([listAllProducts(), listAllCategories()]);
  const term = q.trim().toLowerCase();
  const products = all.filter(
    (p) => (!c || p.category === c) && (!term || `${p.name} ${p.slug}`.toLowerCase().includes(term)),
  );
  const catName = (slug: string) => categories.find((x) => x.slug === slug)?.name ?? slug;

  return (
    <>
      <PageHead
        title="Products"
        subtitle={`${all.length} products · ${all.filter((p) => !p.active).length} hidden · ${all.filter((p) => !p.inStock).length} out of stock`}
        actions={
          <Link href="/admin/products/new" className="abtn abtn--primary">
            + Add product
          </Link>
        }
      />

      <form className="search-row" action="/admin/products">
        <input name="q" defaultValue={q} placeholder="Search products" aria-label="Search products" />
        <select name="c" defaultValue={c} aria-label="Collection">
          <option value="">All collections</option>
          {categories.map((x) => (
            <option key={x.slug} value={x.slug}>
              {x.name}
            </option>
          ))}
        </select>
        <button className="abtn">Filter</button>
      </form>

      <section className="panel panel--flush">
        <div className="table-scroll">
          <table className="table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Collection</th>
                <th className="num">Price</th>
                <th className="center">Visible</th>
                <th className="center">In stock</th>
                <th className="center">New</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className={!p.active ? "is-muted" : undefined}>
                  <td>
                    <Link href={`/admin/products/${p.id}`} className="product-cell">
                      <span className="thumb">
                        <ProductImage product={p} sizes="48px" />
                      </span>
                      <span>
                        <strong>{p.name}</strong>
                        <span className="muted small block">
                          {p.colors.length} color{p.colors.length === 1 ? "" : "s"}
                          {p.sizes ? ` · ${p.sizes.length} sizes` : ""}
                        </span>
                      </span>
                    </Link>
                  </td>
                  <td className="muted">{catName(p.category)}</td>
                  <td className="num nowrap">
                    {formatPrice(p.price)}
                    {p.compareAtPrice && <s className="muted small block">{formatPrice(p.compareAtPrice)}</s>}
                  </td>
                  <td className="center">
                    <Toggle on={p.active} action={toggleProduct.bind(null, p.id, "active")} label="Visible in shop" />
                  </td>
                  <td className="center">
                    <Toggle on={p.inStock} action={toggleProduct.bind(null, p.id, "in_stock")} label="In stock" />
                  </td>
                  <td className="center">
                    <Toggle on={p.isNew} action={toggleProduct.bind(null, p.id, "is_new")} label="Show in New arrivals" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {products.length === 0 && <p className="muted empty-note">No products match.</p>}
      </section>
    </>
  );
}
