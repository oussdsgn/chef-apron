import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ConfirmButton from "@/components/admin/ConfirmButton";
import ProductForm from "@/components/admin/ProductForm";
import { PageHead } from "@/components/admin/ui";
import { deleteProduct, duplicateProduct } from "@/app/admin/actions";
import { db } from "@/lib/db";
import { getProductById } from "@/lib/store";

export const metadata: Metadata = { title: "Edit product" };

export default async function EditProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ created?: string }>;
}) {
  const id = Number((await params).id);
  const { created } = await searchParams;
  const product = Number.isInteger(id) ? await getProductById(id) : undefined;
  if (!product) notFound();
  const sql = await db();
  const categories = await sql<{ slug: string; name: string }[]>`select slug, name from categories order by sort, slug`;
  return (
    <>
      <PageHead
        back={{ href: "/admin/products", label: "Products" }}
        title={product.name}
        subtitle={created ? "Product created. You can keep editing it below." : undefined}
        actions={
          <>
            <a href={`/products/${product.slug}`} target="_blank" rel="noreferrer" className="abtn">
              View in shop ↗
            </a>
            <ConfirmButton action={duplicateProduct.bind(null, product.id)} confirm="Make a hidden copy of this product?" className="abtn">
              Duplicate
            </ConfirmButton>
          </>
        }
      />
      <ProductForm product={product} categories={[...categories]} />
      <div className="danger-zone">
        <ConfirmButton action={deleteProduct.bind(null, product.id)} confirm={`Delete “${product.name}” permanently?`}>
          Delete product
        </ConfirmButton>
      </div>
    </>
  );
}
