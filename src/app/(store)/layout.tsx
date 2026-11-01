import type { Metadata } from "next";
import { CartProvider } from "@/components/CartProvider";
import CartDrawer from "@/components/CartDrawer";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { StoreProvider } from "@/components/StoreProvider";
import { getCategories, getProducts, getSettings } from "@/lib/store";

// Pages read from the database (cached), so they're rendered on request rather than at build time.
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { store } = await getSettings();
  return {
    title: { default: `${store.name} — ${store.tagline}`, template: `%s | ${store.name}` },
    description: store.description,
    openGraph: { siteName: store.name, type: "website" },
  };
}

export default async function StoreLayout({ children }: { children: React.ReactNode }) {
  const [products, categories, settings] = await Promise.all([getProducts(), getCategories(), getSettings()]);
  return (
    <StoreProvider products={products} categories={categories} settings={settings}>
      <CartProvider>
        <Header />
        <main>{children}</main>
        <Footer settings={settings} categories={categories} />
        <CartDrawer />
      </CartProvider>
    </StoreProvider>
  );
}
