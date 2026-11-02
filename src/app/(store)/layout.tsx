import type { Metadata } from "next";
import { CartProvider } from "@/components/CartProvider";
import CartDrawer from "@/components/CartDrawer";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { StoreProvider } from "@/components/StoreProvider";
import { dirOf } from "@/lib/i18n/config";
import { getLocale } from "@/lib/i18n/server";
import { getCategories, getProducts, getSettings } from "@/lib/store";

// Pages read from the database (cached) and the visitor's language, so they're rendered on request.
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { store } = await getSettings(await getLocale());
  return {
    title: { default: `${store.name} — ${store.tagline}`, template: `%s | ${store.name}` },
    description: store.description,
    openGraph: { siteName: store.name, type: "website" },
  };
}

export default async function StoreLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  const [products, categories, settings] = await Promise.all([
    getProducts(locale),
    getCategories(locale),
    getSettings(locale),
  ]);
  return (
    <div lang={locale} dir={dirOf(locale)} className="store-root">
      <StoreProvider products={products} categories={categories} settings={settings} locale={locale}>
        <CartProvider>
          <Header />
          <main>{children}</main>
          <Footer settings={settings} categories={categories} locale={locale} />
          <CartDrawer />
        </CartProvider>
      </StoreProvider>
    </div>
  );
}
