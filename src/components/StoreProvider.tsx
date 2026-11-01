"use client";

import { createContext, useContext, useMemo } from "react";
import type { Category, Product, Settings } from "@/lib/types";

type StoreValue = {
  products: Product[];
  categories: Category[];
  settings: Settings;
  getProduct: (slug: string) => Product | undefined;
  getCategory: (slug: string) => Category | undefined;
};

const StoreContext = createContext<StoreValue | null>(null);

export function StoreProvider({
  products,
  categories,
  settings,
  children,
}: {
  products: Product[];
  categories: Category[];
  settings: Settings;
  children: React.ReactNode;
}) {
  const value = useMemo<StoreValue>(() => {
    const bySlug = new Map(products.map((p) => [p.slug, p]));
    return {
      products,
      categories,
      settings,
      getProduct: (slug) => bySlug.get(slug),
      getCategory: (slug) => categories.find((c) => c.slug === slug),
    };
  }, [products, categories, settings]);
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside <StoreProvider>");
  return ctx;
}
