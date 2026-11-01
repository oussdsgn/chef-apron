import type { Metadata } from "next";
import ProductForm from "@/components/admin/ProductForm";
import { PageHead } from "@/components/admin/ui";
import { db } from "@/lib/db";

export const metadata: Metadata = { title: "Add product" };

export default async function NewProductPage() {
  const sql = await db();
  const categories = await sql<{ slug: string; name: string }[]>`select slug, name from categories order by sort, slug`;
  return (
    <>
      <PageHead back={{ href: "/admin/products", label: "Products" }} title="Add product" />
      <ProductForm categories={[...categories]} />
    </>
  );
}
