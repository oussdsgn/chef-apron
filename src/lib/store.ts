import "server-only";
import type { DocumentSnapshot } from "firebase-admin/firestore";
import { unstable_cache } from "next/cache";
import { COL, db, toIso } from "./db";
import { defaultSettings, seedCategories, seedProducts } from "./seed";
import type { Locale } from "./i18n/config";
import { localizeCategory, localizeProduct, localizeSettings } from "./i18n/localize";
import type { Category, Order, Product, Settings } from "./types";

export const CATALOG_TAG = "catalog";
export const SETTINGS_TAG = "settings";

export function toProduct(doc: DocumentSnapshot): Product {
  const d = doc.data() ?? {};
  const colors = Array.isArray(d.colors) && d.colors.length ? d.colors : [{ name: "Default", hex: "#cccccc" }];
  return {
    id: doc.id,
    slug: d.slug,
    name: d.name ?? "",
    category: d.category ?? "",
    price: Number(d.price ?? 0),
    compareAtPrice: d.compareAtPrice ?? undefined,
    short: d.short ?? "",
    description: d.description ?? "",
    details: Array.isArray(d.details) ? d.details : [],
    colors: colors.map((c: Product["colors"][number]) => ({ name: c.name, hex: c.hex, ...(c.image ? { image: c.image } : {}) })),
    sizes: Array.isArray(d.sizes) && d.sizes.length ? d.sizes : undefined,
    art: d.art ?? "apron-bib",
    image: d.image ?? undefined,
    isNew: Boolean(d.isNew),
    active: d.active !== false,
    inStock: d.inStock !== false,
    sort: Number(d.sort ?? 0),
    ...(d.i18n ? { i18n: d.i18n } : {}),
  };
}

function toCategory(doc: DocumentSnapshot): Category {
  const d = doc.data() ?? {};
  return {
    slug: doc.id,
    name: d.name ?? doc.id,
    title: d.title ?? d.name ?? doc.id,
    blurb: d.blurb ?? "",
    image: d.image ?? undefined,
    sort: Number(d.sort ?? 0),
    ...(d.i18n ? { i18n: d.i18n } : {}),
  };
}

async function readCategories(): Promise<Category[]> {
  const snap = await (await db()).collection(COL.categories).get();
  return snap.docs.map(toCategory).sort((a, b) => a.sort - b.sort || a.slug.localeCompare(b.slug));
}

function sortProducts(products: Product[], categories: Category[]) {
  const order = new Map(categories.map((c) => [c.slug, c.sort]));
  return products.sort(
    (a, b) =>
      (order.get(a.category) ?? 999) - (order.get(b.category) ?? 999) ||
      a.sort - b.sort ||
      a.name.localeCompare(b.name),
  );
}

/** Every product, including hidden ones (for the dashboard). Not cached. */
export async function listAllProducts(): Promise<Product[]> {
  const [snap, categories] = await Promise.all([(await db()).collection(COL.products).get(), readCategories()]);
  return sortProducts(snap.docs.map(toProduct), categories);
}

export async function listAllCategories() {
  return readCategories();
}

export async function getProductById(id: string): Promise<Product | undefined> {
  if (!id || id.includes("/")) return undefined;
  const doc = await (await db()).collection(COL.products).doc(id).get();
  return doc.exists ? toProduct(doc) : undefined;
}

/** Products visible in the shop. Cached until the dashboard changes the catalog. */
const cachedProducts = unstable_cache(
  async (): Promise<Product[]> => {
    const [snap, categories] = await Promise.all([
      (await db()).collection(COL.products).where("active", "==", true).get(),
      readCategories(),
    ]);
    return sortProducts(snap.docs.map(toProduct), categories);
  },
  ["products-fs-v1"],
  { tags: [CATALOG_TAG] },
);

const cachedCategories = unstable_cache(readCategories, ["categories-fs-v1"], { tags: [CATALOG_TAG] });

// If Firebase is unreachable or not configured yet, keep the shop online with the built-in starter catalog
// instead of showing an error page. Errors aren't cached, so live data returns as soon as Firebase works.
function logFallback(what: string, err: unknown) {
  console.error(`[apron] Could not load ${what} from Firebase, showing built-in defaults. Check /api/health.`, err);
}

const fallbackProducts = (): Product[] =>
  seedProducts.map((p, i) => ({ ...p, id: p.slug, isNew: p.isNew ?? false, active: true, inStock: true, sort: i }));
const fallbackCategories = (): Category[] => seedCategories.map((c, i) => ({ ...c, sort: i }));

/**
 * Products visible in the shop. Pass the visitor's locale to get translated names and texts;
 * without one you get the canonical English data (used for orders, so colour/size values stay stable).
 */
export async function getProducts(locale?: Locale): Promise<Product[]> {
  let list: Product[];
  try {
    list = await cachedProducts();
  } catch (err) {
    logFallback("products", err);
    list = fallbackProducts();
  }
  return locale ? list.map((p) => localizeProduct(p, locale)) : list;
}

export async function getCategories(locale?: Locale): Promise<Category[]> {
  let list: Category[];
  try {
    list = await cachedCategories();
  } catch (err) {
    logFallback("collections", err);
    list = fallbackCategories();
  }
  return locale ? list.map((c) => localizeCategory(c, locale)) : list;
}

function mergeSettings(saved: Partial<Settings> | undefined): Settings {
  const s = saved ?? {};
  return {
    store: { ...defaultSettings.store, ...s.store },
    shipping: { ...defaultSettings.shipping, ...s.shipping },
    home: { ...defaultSettings.home, ...s.home },
    about: { ...defaultSettings.about, ...s.about },
    pages: { ...defaultSettings.pages, ...s.pages },
    ...(s.translations ? { translations: s.translations } : {}),
  };
}

export async function loadSettings(): Promise<Settings> {
  const doc = await (await db()).collection(COL.settings).doc("site").get();
  return mergeSettings(doc.data() as Partial<Settings> | undefined);
}

const cachedSettings = unstable_cache(loadSettings, ["settings-fs-v1"], { tags: [SETTINGS_TAG] });

export async function getSettings(locale?: Locale): Promise<Settings> {
  let settings: Settings;
  try {
    settings = await cachedSettings();
  } catch (err) {
    logFallback("settings", err);
    settings = mergeSettings(undefined);
  }
  return locale ? localizeSettings(settings, locale) : settings;
}

export async function getProduct(slug: string, locale?: Locale) {
  return (await getProducts(locale)).find((p) => p.slug === slug);
}

export async function getCategory(slug: string, locale?: Locale) {
  return (await getCategories(locale)).find((c) => c.slug === slug);
}

export async function productsIn(category: string, locale?: Locale) {
  return (await getProducts(locale)).filter((p) => p.category === category);
}

export async function newArrivals(limit = 6, locale?: Locale) {
  return (await getProducts(locale)).filter((p) => p.isNew).slice(0, limit);
}

/** Searches in the visitor's language and in English, so "tablier" and "apron" both work. */
export async function searchProducts(query: string, locale: Locale = "en") {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const [english, localized] = await Promise.all([getProducts(), getProducts(locale)]);
  return localized.filter((p, i) =>
    [p.name, p.short, p.description, english[i].name, english[i].short, english[i].description].some((s) =>
      s.toLowerCase().includes(q),
    ),
  );
}

// ---------- Orders ----------

export function toOrder(doc: DocumentSnapshot): Order {
  const d = doc.data() ?? {};
  return {
    id: doc.id,
    createdAt: toIso(d.createdAt),
    status: d.status ?? "new",
    customer: d.customer,
    items: d.items ?? [],
    subtotal: d.subtotal ?? 0,
    shipping: d.shipping ?? 0,
    total: d.total ?? 0,
    adminNote: d.adminNote ?? "",
    history: Array.isArray(d.history)
      ? d.history.map((e: Record<string, unknown>) => ({ ...e, at: toIso(e.at), by: String(e.by ?? "") }) as Order["history"][number])
      : [],
  };
}
