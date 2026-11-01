import "server-only";
import { Timestamp } from "firebase-admin/firestore";
import { firestore } from "./firebase-admin";
import { defaultSettings, seedCategories, seedProducts } from "./seed";

/** Firestore collections used by the store. */
export const COL = {
  products: "products",
  categories: "categories",
  orders: "orders",
  subscribers: "subscribers",
  settings: "settings",
  admins: "admins",
  uploads: "uploads",
  meta: "meta",
} as const;

declare global {
  // eslint-disable-next-line no-var
  var __apronReady: Promise<void> | undefined;
}

async function seed() {
  const db = firestore();
  const marker = db.collection(COL.meta).doc("seed");
  if ((await marker.get()).exists) return;
  const batch = db.batch();
  // The marker is created in the same atomic batch: if another server instance seeded first,
  // create() fails and nothing is written twice. If anything fails, nothing is written at all.
  batch.create(marker, { seededAt: Timestamp.now() });
  seedCategories.forEach((c, i) => {
    batch.set(db.collection(COL.categories).doc(c.slug), {
      name: c.name,
      title: c.title,
      blurb: c.blurb,
      image: c.image ?? null,
      sort: i,
    });
  });
  seedProducts.forEach((p, i) => {
    batch.set(db.collection(COL.products).doc(), {
      slug: p.slug,
      name: p.name,
      category: p.category,
      price: p.price,
      compareAtPrice: p.compareAtPrice ?? null,
      short: p.short,
      description: p.description,
      details: p.details,
      colors: p.colors,
      sizes: p.sizes ?? null,
      art: p.art,
      image: p.image ?? null,
      isNew: p.isNew ?? false,
      active: true,
      inStock: true,
      sort: i,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
  });
  batch.set(db.collection(COL.settings).doc("site"), defaultSettings);
  try {
    await batch.commit();
  } catch (err) {
    if ((await marker.get()).exists) return; // another instance won the race
    throw err;
  }
}

/** Fills a brand-new Firestore database with the starter catalog and default texts. */
export function ready() {
  globalThis.__apronReady ??= seed().catch((err) => {
    globalThis.__apronReady = undefined;
    throw err;
  });
  return globalThis.__apronReady;
}

export async function db() {
  await ready();
  return firestore();
}

export function toIso(v: unknown): string {
  if (v instanceof Timestamp) return v.toDate().toISOString();
  if (v instanceof Date) return v.toISOString();
  return typeof v === "string" ? v : new Date(0).toISOString();
}

/** Emails are used as document ids; "/" isn't allowed in ids, so encode it. */
export const emailId = (email: string) => encodeURIComponent(email.toLowerCase());
