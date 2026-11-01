import "server-only";
import { unstable_cache } from "next/cache";
import { db } from "./db";
import { defaultSettings } from "./seed";
import type { Category, Order, Product, Settings } from "./types";

export const CATALOG_TAG = "catalog";
export const SETTINGS_TAG = "settings";

type ProductRow = {
  id: number;
  slug: string;
  name: string;
  category: string;
  price: number;
  compare_at_price: number | null;
  short: string;
  description: string;
  details: string[];
  colors: Product["colors"];
  sizes: string[] | null;
  art: Product["art"];
  image: string | null;
  is_new: boolean;
  active: boolean;
  in_stock: boolean;
  sort: number;
};

export function toProduct(r: ProductRow): Product {
  return {
    id: r.id,
    slug: r.slug,
    name: r.name,
    category: r.category,
    price: r.price,
    compareAtPrice: r.compare_at_price ?? undefined,
    short: r.short,
    description: r.description,
    details: r.details ?? [],
    colors: r.colors?.length ? r.colors : [{ name: "Default", hex: "#cccccc" }],
    sizes: r.sizes?.length ? r.sizes : undefined,
    art: r.art,
    image: r.image ?? undefined,
    isNew: r.is_new,
    active: r.active,
    inStock: r.in_stock,
    sort: r.sort,
  };
}

/** Every product, including hidden ones (for the dashboard). Not cached. */
export async function listAllProducts(): Promise<Product[]> {
  const sql = await db();
  const rows = await sql<ProductRow[]>`select * from products order by category, sort, id`;
  return rows.map(toProduct);
}

export async function getProductById(id: number): Promise<Product | undefined> {
  const sql = await db();
  const [row] = await sql<ProductRow[]>`select * from products where id = ${id}`;
  return row ? toProduct(row) : undefined;
}

/** Products visible in the shop. Cached until the dashboard changes the catalog. */
export const getProducts = unstable_cache(
  async (): Promise<Product[]> => {
    const sql = await db();
    const rows = await sql<ProductRow[]>`
      select p.* from products p left join categories c on c.slug = p.category
      where p.active order by coalesce(c.sort, 999), p.sort, p.id`;
    return rows.map(toProduct);
  },
  ["products-v1"],
  { tags: [CATALOG_TAG] },
);

export const getCategories = unstable_cache(
  async (): Promise<Category[]> => {
    const sql = await db();
    const rows = await sql<(Omit<Category, "image"> & { image: string | null })[]>`
      select slug, name, title, blurb, image, sort from categories order by sort, slug`;
    return rows.map((r) => ({ ...r, image: r.image ?? undefined }));
  },
  ["categories-v1"],
  { tags: [CATALOG_TAG] },
);

function mergeSettings(saved: Partial<Settings> | undefined): Settings {
  const s = saved ?? {};
  return {
    store: { ...defaultSettings.store, ...s.store },
    shipping: { ...defaultSettings.shipping, ...s.shipping },
    home: { ...defaultSettings.home, ...s.home },
    about: { ...defaultSettings.about, ...s.about },
    pages: { ...defaultSettings.pages, ...s.pages },
  };
}

export async function loadSettings(): Promise<Settings> {
  const sql = await db();
  const [row] = await sql<{ value: Partial<Settings> }[]>`select value from settings where key = 'site'`;
  return mergeSettings(row?.value);
}

export const getSettings = unstable_cache(loadSettings, ["settings-v1"], { tags: [SETTINGS_TAG] });

export async function getProduct(slug: string) {
  return (await getProducts()).find((p) => p.slug === slug);
}

export async function getCategory(slug: string) {
  return (await getCategories()).find((c) => c.slug === slug);
}

export async function productsIn(category: string) {
  return (await getProducts()).filter((p) => p.category === category);
}

export async function newArrivals(limit = 6) {
  return (await getProducts()).filter((p) => p.isNew).slice(0, limit);
}

export async function searchProducts(query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return (await getProducts()).filter((p) =>
    [p.name, p.short, p.description, p.category].some((s) => s.toLowerCase().includes(q)),
  );
}

// ---------- Orders ----------

type OrderRow = {
  id: string;
  created_at: Date;
  status: Order["status"];
  customer: Order["customer"];
  items: Order["items"];
  subtotal: number;
  shipping: number;
  total: number;
  admin_note: string;
};

export function toOrder(r: OrderRow): Order {
  return {
    id: r.id,
    createdAt: r.created_at.toISOString(),
    status: r.status,
    customer: r.customer,
    items: r.items,
    subtotal: r.subtotal,
    shipping: r.shipping,
    total: r.total,
    adminNote: r.admin_note,
  };
}

export type OrderRowType = OrderRow;
