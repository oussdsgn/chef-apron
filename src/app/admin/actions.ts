"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { ownerEmails, requireAdmin } from "@/lib/auth";
import { COL, db, emailId } from "@/lib/db";
import { slugify } from "@/lib/format";
import { contentGroups, settingsGroups, type SectionKey } from "@/lib/settings-fields";
import { CATALOG_TAG, SETTINGS_TAG, loadSettings } from "@/lib/store";
import { ORDER_STATUSES, type ColorOption, type OrderStatus } from "@/lib/types";
import { saveImage } from "@/lib/uploads";
import { TRANSLATED } from "@/lib/i18n/config";
import { TRANSLATABLE_SETTINGS } from "@/lib/i18n/localize";

/** Reads `${prefix}.fr.key` / `${prefix}.ar.key` inputs. Empty values are left out (they fall back automatically). */
function readTranslations(fd: FormData, prefix: string, keys: string[], listKeys: string[] = []) {
  const out: Record<string, Record<string, string | string[]>> = {};
  for (const l of TRANSLATED) {
    const entry: Record<string, string | string[]> = {};
    for (const key of keys) {
      const raw = String(fd.get(`${prefix}.${l}.${key}`) ?? "").trim().slice(0, 20000);
      if (!raw) continue;
      entry[key] = listKeys.includes(key)
        ? raw
            .split("\n")
            .map((x) => x.trim())
            .filter(Boolean)
        : raw;
    }
    if (Object.keys(entry).length) out[l] = entry;
  }
  return out;
}

export type ActionState = { ok: boolean; message: string } | null;

const str = (fd: FormData, key: string, max = 5000) => String(fd.get(key) ?? "").trim().slice(0, max);
const int = (fd: FormData, key: string) => {
  const raw = str(fd, key).replace(/\s/g, "");
  if (raw === "") return null;
  const n = Number(raw);
  return Number.isFinite(n) ? Math.round(n) : NaN;
};
/** Document ids come from the browser: reject anything that could address another path. */
const safeId = (id: unknown) => typeof id === "string" && /^[\w-]{1,128}$/.test(id);

function refreshStore(...tags: string[]) {
  for (const t of tags) revalidateTag(t);
  revalidatePath("/", "layout");
}

// ---------------- Orders ----------------

export async function setOrderStatus(id: string, status: OrderStatus) {
  await requireAdmin();
  if (!safeId(id) || !ORDER_STATUSES.some((s) => s.value === status)) throw new Error("Invalid request");
  await (await db()).collection(COL.orders).doc(id).update({ status, updatedAt: new Date() });
  revalidatePath("/admin", "layout");
}

export async function saveOrderNote(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireAdmin();
  const id = str(fd, "id");
  if (!safeId(id)) return { ok: false, message: "Invalid order." };
  await (await db()).collection(COL.orders).doc(id).update({ adminNote: str(fd, "note", 2000) });
  revalidatePath("/admin", "layout");
  return { ok: true, message: "Note saved" };
}

export async function deleteOrder(id: string) {
  await requireAdmin();
  if (!safeId(id)) throw new Error("Invalid request");
  await (await db()).collection(COL.orders).doc(id).delete();
  revalidatePath("/admin", "layout");
  redirect("/admin/orders");
}

// ---------------- Products ----------------

export async function saveProduct(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireAdmin();
  const firestore = await db();
  const products = firestore.collection(COL.products);

  const id = str(fd, "id");
  if (id && !safeId(id)) return { ok: false, message: "Invalid product." };
  const name = str(fd, "name", 120);
  const slug = slugify(str(fd, "slug") || name);
  const category = str(fd, "category");
  const price = int(fd, "price");
  const compareAt = int(fd, "compareAtPrice");
  const sort = int(fd, "sort") ?? 0;

  if (!name) return { ok: false, message: "Please enter a product name." };
  if (!slug) return { ok: false, message: "Please enter a valid web address (slug)." };
  if (price === null || Number.isNaN(price) || price < 0) return { ok: false, message: "Please enter a valid price." };
  if (compareAt !== null && (Number.isNaN(compareAt) || compareAt <= price))
    return { ok: false, message: "The “was” price must be higher than the price, or empty." };
  if (!safeId(category) || !(await firestore.collection(COL.categories).doc(category).get()).exists)
    return { ok: false, message: "Please choose a collection." };

  let colors: ColorOption[] = [];
  try {
    colors = (JSON.parse(str(fd, "colors", 20000) || "[]") as ColorOption[])
      .map((c) => ({
        name: String(c.name ?? "").trim().slice(0, 40),
        hex: /^#[0-9a-f]{6}$/i.test(c.hex) ? c.hex : "#cccccc",
        ...(c.image ? { image: String(c.image).slice(0, 1000) } : {}),
      }))
      .filter((c) => c.name);
  } catch {
    return { ok: false, message: "Colors could not be read." };
  }
  if (colors.length === 0) return { ok: false, message: "Add at least one color (e.g. “Default”)." };

  const details = str(fd, "details", 10000)
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  const sizes = str(fd, "sizes", 2000)
    .split(/\n|,/)
    .map((l) => l.trim())
    .filter(Boolean);

  const clash = await products.where("slug", "==", slug).get();
  if (clash.docs.some((d) => d.id !== id)) return { ok: false, message: `Another product already uses the address “${slug}”.` };

  const values = {
    slug,
    name,
    category,
    price,
    compareAtPrice: compareAt,
    short: str(fd, "short", 300),
    description: str(fd, "description", 5000),
    details,
    colors,
    sizes: sizes.length ? sizes : null,
    art: str(fd, "art") || "apron-bib",
    image: str(fd, "image", 1000) || null,
    isNew: fd.get("isNew") === "on",
    active: fd.get("active") === "on",
    inStock: fd.get("inStock") === "on",
    sort,
    i18n: readTranslations(fd, "i18n", ["name", "short", "description", "details"], ["details"]),
    updatedAt: new Date(),
  };

  let savedId = id;
  if (id) {
    const ref = products.doc(id);
    if (!(await ref.get()).exists) return { ok: false, message: "This product no longer exists." };
    // update() replaces each listed field as a whole, so cleared translations are really removed.
    await ref.update(values);
  } else {
    savedId = (await products.add({ ...values, createdAt: new Date() })).id;
  }
  refreshStore(CATALOG_TAG);
  revalidatePath("/admin", "layout");
  if (!id) redirect(`/admin/products/${savedId}?created=1`);
  return { ok: true, message: "Product saved" };
}

const TOGGLES = { active: "active", in_stock: "inStock", is_new: "isNew" } as const;

export async function toggleProduct(id: string, field: keyof typeof TOGGLES) {
  await requireAdmin();
  // Arguments come from the browser: only allow these three fields.
  if (!safeId(id) || !(field in TOGGLES)) throw new Error("Invalid request");
  const key = TOGGLES[field];
  const firestore = await db();
  await firestore.runTransaction(async (tx) => {
    const ref = firestore.collection(COL.products).doc(id);
    const snap = await tx.get(ref);
    if (!snap.exists) return;
    const current = key === "isNew" ? Boolean(snap.get(key)) : snap.get(key) !== false;
    tx.update(ref, { [key]: !current, updatedAt: new Date() });
  });
  refreshStore(CATALOG_TAG);
  revalidatePath("/admin", "layout");
}

export async function deleteProduct(id: string) {
  await requireAdmin();
  if (!safeId(id)) throw new Error("Invalid request");
  await (await db()).collection(COL.products).doc(id).delete();
  refreshStore(CATALOG_TAG);
  revalidatePath("/admin", "layout");
  redirect("/admin/products");
}

export async function duplicateProduct(id: string) {
  await requireAdmin();
  if (!safeId(id)) throw new Error("Invalid request");
  const products = (await db()).collection(COL.products);
  const snap = await products.doc(id).get();
  if (!snap.exists) throw new Error("Product not found");
  const d = snap.data()!;
  const copy = await products.add({
    ...d,
    slug: `${d.slug}-copy-${Math.random().toString(36).slice(2, 6)}`,
    name: `${d.name} (copy)`,
    active: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  revalidatePath("/admin", "layout");
  redirect(`/admin/products/${copy.id}`);
}

// ---------------- Collections ----------------

export async function saveCategory(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireAdmin();
  const firestore = await db();
  const categories = firestore.collection(COL.categories);
  const original = str(fd, "original");
  const slug = slugify(str(fd, "slug") || str(fd, "name"));
  const name = str(fd, "name", 60);
  if (!name || !slug) return { ok: false, message: "Name is required." };
  if (original && !safeId(original)) return { ok: false, message: "Invalid collection." };
  const values = {
    name,
    title: str(fd, "title", 120) || name,
    blurb: str(fd, "blurb", 500),
    image: str(fd, "image", 1000) || null,
    sort: int(fd, "sort") ?? 0,
    i18n: readTranslations(fd, "i18n", ["name", "title", "blurb"]),
  };

  if (original && original === slug) {
    await categories.doc(slug).set(values, { mergeFields: Object.keys(values) });
  } else {
    if ((await categories.doc(slug).get()).exists) return { ok: false, message: `The address “${slug}” is already used.` };
    if (original) {
      // Renaming the address: move the collection and its products in one batch.
      const batch = firestore.batch();
      batch.set(categories.doc(slug), values);
      batch.delete(categories.doc(original));
      const items = await firestore.collection(COL.products).where("category", "==", original).get();
      items.docs.forEach((d) => batch.update(d.ref, { category: slug }));
      await batch.commit();
    } else {
      await categories.doc(slug).set(values);
    }
  }
  refreshStore(CATALOG_TAG);
  revalidatePath("/admin", "layout");
  return { ok: true, message: original ? "Collection saved" : "Collection added" };
}

export async function deleteCategory(slug: string): Promise<{ error?: string }> {
  await requireAdmin();
  if (!safeId(slug)) return { error: "Invalid collection." };
  const firestore = await db();
  const count = (await firestore.collection(COL.products).where("category", "==", slug).count().get()).data().count;
  if (count > 0) return { error: `Move or delete the ${count} product(s) in this collection first.` };
  await firestore.collection(COL.categories).doc(slug).delete();
  refreshStore(CATALOG_TAG);
  revalidatePath("/admin", "layout");
  return {};
}

// ---------------- Settings & content ----------------

export async function saveSettings(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireAdmin();
  const section = str(fd, "section") as SectionKey;
  const group = [...contentGroups, ...settingsGroups].find((g) => g.section === section);
  if (!group) return { ok: false, message: "Unknown section." };

  const current = await loadSettings();
  const next: Record<string, unknown> = { ...current[section] };
  for (const f of group.fields) {
    const name = `${section}.${f.key}`;
    switch (f.type) {
      case "number": {
        const n = int(fd, name);
        if (n === null || Number.isNaN(n) || n < 0) return { ok: false, message: `${f.label}: enter a number.` };
        next[f.key] = n;
        break;
      }
      case "wilayas":
        next[f.key] = fd
          .getAll(name)
          .map(Number)
          .filter((n) => Number.isInteger(n) && n >= 1 && n <= 58);
        break;
      case "values":
        next[f.key] = str(fd, name, 5000)
          .split("\n")
          .map((l) => l.split("|").map((x) => x.trim()))
          .filter(([t]) => t)
          .map(([title, ...rest]) => ({ title, text: rest.join(" | ") }));
        break;
      case "email": {
        const v = str(fd, name, 200);
        if (v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return { ok: false, message: `${f.label}: invalid email.` };
        next[f.key] = v;
        break;
      }
      case "url": {
        const v = str(fd, name, 500);
        if (v && !/^https?:\/\//.test(v)) return { ok: false, message: `${f.label}: must start with https://` };
        next[f.key] = v;
        break;
      }
      default:
        next[f.key] = str(fd, name, f.type === "longtext" ? 20000 : 2000);
    }
  }

  // Translations of this section's texts, stored as translations.<lang>["section.key"].
  const update: Record<string, unknown> = { [section]: next };
  if (section in TRANSLATABLE_SETTINGS) {
    const keys = TRANSLATABLE_SETTINGS[section as keyof typeof TRANSLATABLE_SETTINGS];
    const read = readTranslations(fd, "tr", keys.map((k) => `${section}.${k}`));
    for (const l of TRANSLATED) {
      const existing = { ...(current.translations?.[l] ?? {}) };
      for (const k of keys) delete existing[`${section}.${k}`];
      update.translations = {
        ...(update.translations as object),
        [l]: { ...existing, ...((read[l] as Record<string, string>) ?? {}) },
      };
    }
  }
  await (await db()).collection(COL.settings).doc("site").set(update, { mergeFields: Object.keys(update) });
  refreshStore(SETTINGS_TAG);
  revalidatePath("/admin", "layout");
  return { ok: true, message: `${group.title} saved` };
}

// ---------------- Admins ----------------

export async function addAdmin(_prev: ActionState, fd: FormData): Promise<ActionState> {
  const me = await requireAdmin();
  const email = str(fd, "email", 200).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { ok: false, message: "Enter a valid Google email." };
  await (await db())
    .collection(COL.admins)
    .doc(emailId(email))
    .set({ email, addedBy: me.email, addedAt: new Date() });
  revalidatePath("/admin/settings");
  return { ok: true, message: `${email} can now sign in` };
}

export async function removeAdmin(email: string): Promise<{ error?: string }> {
  const me = await requireAdmin();
  if (typeof email !== "string") return { error: "Invalid email." };
  if (email === me.email) return { error: "You can't remove yourself." };
  if (ownerEmails().includes(email)) return { error: "Owners are set in ADMIN_EMAILS on Vercel and can't be removed here." };
  await (await db()).collection(COL.admins).doc(emailId(email)).delete();
  revalidatePath("/admin/settings");
  return {};
}

// ---------------- Subscribers ----------------

export async function deleteSubscriber(email: string) {
  await requireAdmin();
  if (typeof email !== "string") throw new Error("Invalid request");
  await (await db()).collection(COL.subscribers).doc(emailId(email)).delete();
  revalidatePath("/admin/subscribers");
}

// ---------------- Uploads ----------------

export async function uploadImage(fd: FormData): Promise<{ url?: string; error?: string }> {
  await requireAdmin();
  const file = fd.get("file");
  if (!(file instanceof File) || file.size === 0) return { error: "No file received." };
  try {
    return { url: await saveImage(file) };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Upload failed." };
  }
}
