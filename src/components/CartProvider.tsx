"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useStore } from "./StoreProvider";

export type CartLine = {
  slug: string;
  color: string;
  size?: string;
  quantity: number;
};

type CartContextValue = {
  lines: CartLine[];
  count: number;
  subtotal: number;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  add: (line: CartLine) => void;
  setQuantity: (key: string, quantity: number) => void;
  remove: (key: string) => void;
  clear: () => void;
};

const STORAGE_KEY = "apron-cart-v1";
const CartContext = createContext<CartContextValue | null>(null);

export const lineKey = (l: Pick<CartLine, "slug" | "color" | "size">) => `${l.slug}|${l.color}|${l.size ?? ""}`;

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { getProduct } = useStore();
  const [allLines, setLines] = useState<CartLine[]>([]);
  // Drop items whose product was removed or hidden in the dashboard.
  const lines = useMemo(() => allLines.filter((l) => getProduct(l.slug)), [allLines, getProduct]);
  const [hydrated, setHydrated] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CartLine[];
        setLines(parsed.filter((l) => typeof l.slug === "string" && l.quantity > 0));
      }
    } catch {
      /* storage unavailable */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      /* storage unavailable */
    }
  }, [lines, hydrated]);


  const add = useCallback((line: CartLine) => {
    setLines((prev) => {
      const key = lineKey(line);
      const existing = prev.find((l) => lineKey(l) === key);
      if (existing) {
        return prev.map((l) => (lineKey(l) === key ? { ...l, quantity: Math.min(99, l.quantity + line.quantity) } : l));
      }
      return [...prev, line];
    });
    setIsOpen(true);
  }, []);

  const setQuantity = useCallback((key: string, quantity: number) => {
    setLines((prev) =>
      quantity <= 0
        ? prev.filter((l) => lineKey(l) !== key)
        : prev.map((l) => (lineKey(l) === key ? { ...l, quantity: Math.min(99, quantity) } : l)),
    );
  }, []);

  const remove = useCallback((key: string) => setLines((prev) => prev.filter((l) => lineKey(l) !== key)), []);
  const clear = useCallback(() => setLines([]), []);

  const value = useMemo<CartContextValue>(() => {
    const count = lines.reduce((n, l) => n + l.quantity, 0);
    const subtotal = lines.reduce((sum, l) => sum + (getProduct(l.slug)?.price ?? 0) * l.quantity, 0);
    return {
      lines,
      count,
      subtotal,
      isOpen,
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
      add,
      setQuantity,
      remove,
      clear,
    };
  }, [lines, isOpen, add, setQuantity, remove, clear, getProduct]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
