import type { Metadata } from "next";
import ProductForm from "@/components/admin/ProductForm";
import { PageHead } from "@/components/admin/ui";
import { listAllCategories } from "@/lib/store";

export const metadata: Metadata = { title: "Add product" };

export default async function NewProductPage() {
  const categories = (await listAllCategories()).map((c) => ({ slug: c.slug, name: c.name }));
  return (
    <>
      <PageHead back={{ href: "/admin/products", label: "Products" }} title="Add product" />
      <ProductForm categories={[...categories]} />
    </>
  );
}
