import "server-only";
import postgres from "postgres";
import { defaultSettings, seedCategories, seedProducts } from "./seed";

declare global {
  // eslint-disable-next-line no-var
  var __apronSql: postgres.Sql | undefined;
  // eslint-disable-next-line no-var
  var __apronReady: Promise<void> | undefined;
}

function connect() {
  const url = process.env.DATABASE_URL ?? process.env.POSTGRES_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL is not set. Add a Postgres database (Vercel → Storage → Neon) and redeploy, or set it in .env.local.",
    );
  }
  const local = /localhost|127\.0\.0\.1/.test(url);
  return postgres(url, {
    ssl: local ? false : "require",
    max: 3,
    idle_timeout: 20,
    prepare: false, // required for poolers such as Neon's pgbouncer
    onnotice: () => {},
  });
}

export function sql() {
  globalThis.__apronSql ??= connect();
  return globalThis.__apronSql;
}

const SCHEMA = `
create table if not exists categories (
  slug text primary key,
  name text not null,
  title text not null,
  blurb text not null default '',
  image text,
  sort int not null default 0
);
create table if not exists products (
  id serial primary key,
  slug text not null unique,
  name text not null,
  category text not null,
  price int not null,
  compare_at_price int,
  short text not null default '',
  description text not null default '',
  details jsonb not null default '[]',
  colors jsonb not null default '[]',
  sizes jsonb,
  art text not null default 'apron-bib',
  image text,
  is_new boolean not null default false,
  active boolean not null default true,
  in_stock boolean not null default true,
  sort int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists orders (
  id text primary key,
  created_at timestamptz not null default now(),
  status text not null default 'new',
  customer jsonb not null,
  items jsonb not null,
  subtotal int not null,
  shipping int not null,
  total int not null,
  admin_note text not null default ''
);
create index if not exists orders_created_at_idx on orders (created_at desc);
create table if not exists subscribers (
  email text primary key,
  created_at timestamptz not null default now()
);
create table if not exists settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);
create table if not exists admins (
  email text primary key,
  added_by text,
  added_at timestamptz not null default now()
);
create table if not exists uploads (
  id text primary key,
  content_type text not null,
  data bytea not null,
  created_at timestamptz not null default now()
);
`;

async function setup() {
  const db = sql();
  await db.unsafe(SCHEMA);

  // First run: fill the store with the starter catalog and default settings.
  const [{ count }] = await db<{ count: number }[]>`select count(*)::int as count from categories`;
  if (count === 0) {
    await db.begin(async (tx) => {
      for (const [i, c] of seedCategories.entries()) {
        await tx`insert into categories (slug, name, title, blurb, image, sort)
                 values (${c.slug}, ${c.name}, ${c.title}, ${c.blurb}, ${c.image ?? null}, ${i})
                 on conflict do nothing`;
      }
      for (const [i, p] of seedProducts.entries()) {
        await tx`insert into products
            (slug, name, category, price, compare_at_price, short, description, details, colors, sizes, art, image, is_new, sort)
          values (${p.slug}, ${p.name}, ${p.category}, ${p.price}, ${p.compareAtPrice ?? null}, ${p.short},
                  ${p.description}, ${tx.json(p.details)}, ${tx.json(p.colors)},
                  ${p.sizes ? tx.json(p.sizes) : null}, ${p.art}, ${p.image ?? null}, ${p.isNew ?? false}, ${i})
          on conflict (slug) do nothing`;
      }
      await tx`insert into settings (key, value) values ('site', ${tx.json(defaultSettings)}) on conflict do nothing`;
    });
  }
}

/** Creates the tables (and starter data) the first time the app talks to a new database. */
export function ready() {
  globalThis.__apronReady ??= setup().catch((err) => {
    globalThis.__apronReady = undefined;
    throw err;
  });
  return globalThis.__apronReady;
}

export async function db() {
  await ready();
  return sql();
}
