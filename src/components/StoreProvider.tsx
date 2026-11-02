"use client";

import { createContext, useContext, useMemo } from "react";
import { formatPrice } from "@/lib/format";
import type { Locale } from "@/lib/i18n/config";
import { translator, type T } from "@/lib/i18n/messages";
import type { Category, Product, Settings } from "@/lib/types";

type StoreValue = {
  products: Product[];
  categories: Category[];
  settings: Settings;
  locale: Locale;
  t: T;
  /** Formats a price in the visitor's language. */
  price: (amount: number) => string;
  getProduct: (slug: string) => Product | undefined;
  getCategory: (slug: string) => Category | undefined;
};

const StoreContext = createContext<StoreValue | null>(null);

export function StoreProvider({
  products,
  categories,
  settings,
  locale,
  children,
}: {
  products: Product[];
  categories: Category[];
  settings: Settings;
  locale: Locale;
  children: React.ReactNode;
}) {
  const value = useMemo<StoreValue>(() => {
    const bySlug = new Map(products.map((p) => [p.slug, p]));
    return {
      products,
      categories,
      settings,
      locale,
      t: translator(locale),
      price: (amount) => formatPrice(amount, locale),
      getProduct: (slug) => bySlug.get(slug),
      getCategory: (slug) => categories.find((c) => c.slug === slug),
    };
  }, [products, categories, settings, locale]);
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside <StoreProvider>");
  return ctx;
}
