"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { ownerEmails, requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { slugify } from "@/lib/format";
import { contentGroups, settingsGroups, type SectionKey } from "@/lib/settings-fields";
import { CATALOG_TAG, SETTINGS_TAG, loadSettings } from "@/lib/store";
import { ORDER_STATUSES, type ColorOption, type OrderStatus, type Settings } from "@/lib/types";
import { saveImage } from "@/lib/uploads";

export type ActionState = { ok: boolean; message: string } | null;

const str = (fd: FormData, key: string, max = 5000) => String(fd.get(key) ?? "").trim().slice(0, max);
const int = (fd: FormData, key: string) => {
  const raw = str(fd, key).replace(/\s/g, "");
  if (raw === "") return null;
  const n = Number(raw);
  return Number.isFinite(n) ? Math.round(n) : NaN;
};

function refreshStore(...tags: string[]) {
  for (const t of tags) revalidateTag(t);
  revalidatePath("/", "layout");
}

// ---------------- Orders ----------------

export async function setOrderStatus(id: string, status: OrderStatus) {
  await requireAdmin();
  if (!ORDER_STATUSES.some((s) => s.value === status)) throw new Error("Unknown status");
  const sql = await db();
  await sql`update orders set status = ${status} where id = ${id}`;
  revalidatePath("/admin", "layout");
}

export async function saveOrderNote(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireAdmin();
  const sql = await db();
  await sql`update orders set admin_note = ${str(fd, "note", 2000)} where id = ${str(fd, "id")}`;
  revalidatePath("/admin", "layout");
  return { ok: true, message: "Note saved" };
}

export async function deleteOrder(id: string) {
  await requireAdmin();
  const sql = await db();
  await sql`delete from orders where id = ${id}`;
  revalidatePath("/admin", "layout");
  redirect("/admin/orders");
}

// ---------------- Products ----------------

export async function saveProduct(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireAdmin();
  const sql = await db();

  const id = int(fd, "id");
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
  const [cat] = await sql`select 1 from categories where slug = ${category}`;
  if (!cat) return { ok: false, message: "Please choose a collection." };

  let colors: ColorOption[] = [];
  try {
    colors = (JSON.parse(str(fd, "colors", 20000) || "[]") as ColorOption[])
      .map((c) => ({
        name: String(c.name ?? "").trim().slice(0, 40),
        hex: /^#[0-9a-f]{6}$/i.test(c.hex) ? c.hex : "#cccccc",
        ...(c.image ? { image: String(c.image).slice(0, 500) } : {}),
      }))
      .filter((c) => c.name);
  } catch {
    return { ok: false, message: "Colors could not be read." };
  }
  if (colors.length === 0) return { ok: false, message: "Add at least one color (e.g. “Default”)." };

  const lines = (key: string) =>
    str(fd, key, 10000)
      .split(/\n|,/)
      .map((l) => l.trim())
      .filter(Boolean);
  const details = str(fd, "details", 10000)
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  const sizes = lines("sizes");

  const values = {
    slug,
    name,
    category,
    price,
    compare_at_price: compareAt,
    short: str(fd, "short", 300),
    description: str(fd, "description", 5000),
    details: sql.json(details),
    colors: sql.json(colors),
    sizes: sizes.length ? sql.json(sizes) : null,
    art: str(fd, "art") || "apron-bib",
    image: str(fd, "image", 500) || null,
    is_new: fd.get("isNew") === "on",
    active: fd.get("active") === "on",
    in_stock: fd.get("inStock") === "on",
    sort,
  };

  const [clash] = await sql`select id from products where slug = ${slug} and id <> ${id ?? -1}`;
  if (clash) return { ok: false, message: `Another product already uses the address “${slug}”.` };

  let savedId = id;
  if (id) {
    await sql`update products set ${sql(values)}, updated_at = now() where id = ${id}`;
  } else {
    const [row] = await sql<{ id: number }[]>`insert into products ${sql(values)} returning id`;
    savedId = row.id;
  }
  refreshStore(CATALOG_TAG);
  revalidatePath("/admin", "layout");
  if (!id) redirect(`/admin/products/${savedId}?created=1`);
  return { ok: true, message: "Product saved" };
}

export async function toggleProduct(id: number, field: "active" | "in_stock" | "is_new") {
  await requireAdmin();
  // Arguments come from the browser: only allow these three columns.
  if (!["active", "in_stock", "is_new"].includes(field) || !Number.isInteger(id)) throw new Error("Invalid request");
  const sql = await db();
  await sql`update products set ${sql(field)} = not ${sql(field)}, updated_at = now() where id = ${id}`;
  refreshStore(CATALOG_TAG);
  revalidatePath("/admin", "layout");
}

export async function deleteProduct(id: number) {
  await requireAdmin();
  const sql = await db();
  await sql`delete from products where id = ${id}`;
  refreshStore(CATALOG_TAG);
  revalidatePath("/admin", "layout");
  redirect("/admin/products");
}

export async function duplicateProduct(id: number) {
  await requireAdmin();
  const sql = await db();
  const [row] = await sql<{ id: number }[]>`
    insert into products (slug, name, category, price, compare_at_price, short, description, details, colors, sizes, art, image, is_new, active, in_stock, sort)
    select slug || '-copy-' || substr(md5(random()::text), 1, 4), name || ' (copy)', category, price, compare_at_price, short,
           description, details, colors, sizes, art, image, is_new, false, in_stock, sort
    from products where id = ${id} returning id`;
  revalidatePath("/admin", "layout");
  redirect(`/admin/products/${row.id}`);
}

// ---------------- Collections ----------------

export async function saveCategory(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireAdmin();
  const sql = await db();
  const original = str(fd, "original");
  const slug = slugify(str(fd, "slug") || str(fd, "name"));
  const name = str(fd, "name", 60);
  if (!name || !slug) return { ok: false, message: "Name is required." };
  const values = {
    slug,
    name,
    title: str(fd, "title", 120) || name,
    blurb: str(fd, "blurb", 500),
    image: str(fd, "image", 500) || null,
    sort: int(fd, "sort") ?? 0,
  };
  if (original) {
    if (original !== slug) {
      const [clash] = await sql`select 1 from categories where slug = ${slug}`;
      if (clash) return { ok: false, message: `The address “${slug}” is already used.` };
    }
    await sql.begin(async (tx) => {
      await tx`update categories set ${tx(values)} where slug = ${original}`;
      if (original !== slug) await tx`update products set category = ${slug} where category = ${original}`;
    });
  } else {
    const [clash] = await sql`select 1 from categories where slug = ${slug}`;
    if (clash) return { ok: false, message: `The address “${slug}” is already used.` };
    await sql`insert into categories ${sql(values)}`;
  }
  refreshStore(CATALOG_TAG);
  revalidatePath("/admin", "layout");
  return { ok: true, message: original ? "Collection saved" : "Collection added" };
}

export async function deleteCategory(slug: string): Promise<{ error?: string }> {
  await requireAdmin();
  const sql = await db();
  const [{ count }] = await sql<{ count: number }[]>`select count(*)::int as count from products where category = ${slug}`;
  if (count > 0) return { error: `Move or delete the ${count} product(s) in this collection first.` };
  await sql`delete from categories where slug = ${slug}`;
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

  const merged: Settings = { ...current, [section]: next };
  const sql = await db();
  await sql`insert into settings (key, value, updated_at) values ('site', ${sql.json(merged as never)}, now())
            on conflict (key) do update set value = excluded.value, updated_at = now()`;
  refreshStore(SETTINGS_TAG);
  revalidatePath("/admin", "layout");
  return { ok: true, message: `${group.title} saved` };
}

// ---------------- Admins ----------------

export async function addAdmin(_prev: ActionState, fd: FormData): Promise<ActionState> {
  const me = await requireAdmin();
  const email = str(fd, "email", 200).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { ok: false, message: "Enter a valid Google email." };
  const sql = await db();
  await sql`insert into admins (email, added_by) values (${email}, ${me.email}) on conflict do nothing`;
  revalidatePath("/admin/settings");
  return { ok: true, message: `${email} can now sign in` };
}

export async function removeAdmin(email: string): Promise<{ error?: string }> {
  const me = await requireAdmin();
  if (email === me.email) return { error: "You can't remove yourself." };
  if (ownerEmails().includes(email)) return { error: "Owners are set in ADMIN_EMAILS on Vercel and can't be removed here." };
  const sql = await db();
  await sql`delete from admins where email = ${email}`;
  revalidatePath("/admin/settings");
  return {};
}

// ---------------- Subscribers ----------------

export async function deleteSubscriber(email: string) {
  await requireAdmin();
  const sql = await db();
  await sql`delete from subscribers where email = ${email}`;
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
