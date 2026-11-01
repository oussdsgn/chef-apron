import type { Metadata } from "next";
import Link from "next/link";
import { PageHead, StatusPill, formatDate } from "@/components/admin/ui";
import { db } from "@/lib/db";
import { formatPrice } from "@/lib/format";
import { toOrder, type OrderRowType } from "@/lib/store";
import { ORDER_STATUSES, type OrderStatus } from "@/lib/types";

export const metadata: Metadata = { title: "Orders" };

const PAGE_SIZE = 50;

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string; page?: string }>;
}) {
  const sp = await searchParams;
  const status = ORDER_STATUSES.some((s) => s.value === sp.status) ? (sp.status as OrderStatus) : undefined;
  const q = (sp.q ?? "").trim().slice(0, 100);
  const page = Math.max(1, Number(sp.page) || 1);
  const sql = await db();

  const like = `%${q}%`;
  const where = sql`
    where (${status ?? null}::text is null or status = ${status ?? null})
      and (${q} = '' or id ilike ${like} or customer->>'name' ilike ${like} or customer->>'phone' ilike ${like}
           or customer->>'wilaya' ilike ${like} or customer->>'commune' ilike ${like})`;

  const [rows, [{ total }], counts] = await Promise.all([
    sql<OrderRowType[]>`select * from orders ${where} order by created_at desc limit ${PAGE_SIZE} offset ${(page - 1) * PAGE_SIZE}`,
    sql<{ total: number }[]>`select count(*)::int as total from orders ${where}`,
    sql<{ status: string; count: number }[]>`select status, count(*)::int as count from orders group by status`,
  ]);
  const orders = rows.map(toOrder);
  const countOf = (s?: string) =>
    s ? (counts.find((c) => c.status === s)?.count ?? 0) : counts.reduce((n, c) => n + c.count, 0);
  const href = (params: Record<string, string | undefined>) => {
    const u = new URLSearchParams();
    const merged = { status, q: q || undefined, ...params };
    Object.entries(merged).forEach(([k, v]) => v && u.set(k, v));
    const s = u.toString();
    return `/admin/orders${s ? `?${s}` : ""}`;
  };
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <>
      <PageHead title="Orders" subtitle="Call each new customer to confirm, then move the order along as it ships." />

      <div className="tabs">
        <Link href={href({ status: undefined, page: undefined })} className={!status ? "is-active" : undefined}>
          All <span>{countOf()}</span>
        </Link>
        {ORDER_STATUSES.map((s) => (
          <Link key={s.value} href={href({ status: s.value, page: undefined })} className={status === s.value ? "is-active" : undefined}>
            {s.label} <span>{countOf(s.value)}</span>
          </Link>
        ))}
      </div>

      <form className="search-row" action="/admin/orders">
        {status && <input type="hidden" name="status" value={status} />}
        <input name="q" defaultValue={q} placeholder="Search by order number, name, phone or wilaya" aria-label="Search orders" />
        <button className="abtn">Search</button>
        {q && (
          <Link href={href({ q: undefined, page: undefined })} className="abtn abtn--ghost">
            Clear
          </Link>
        )}
      </form>

      <section className="panel panel--flush">
        {orders.length === 0 ? (
          <p className="muted empty-note">No orders found.</p>
        ) : (
          <div className="table-scroll">
            <table className="table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Date</th>
                  <th>Customer</th>
                  <th>Phone</th>
                  <th>Wilaya</th>
                  <th className="num">Items</th>
                  <th className="num">Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} className={o.status === "new" ? "is-new" : undefined}>
                    <td>
                      <Link href={`/admin/orders/${o.id}`} className="strong-link">
                        {o.id}
                      </Link>
                    </td>
                    <td className="muted nowrap">{formatDate(o.createdAt)}</td>
                    <td>{o.customer.name}</td>
                    <td className="nowrap">
                      <a href={`tel:${o.customer.phone}`} className="link">
                        {o.customer.phone}
                      </a>
                    </td>
                    <td className="muted">
                      {o.customer.wilayaCode} · {o.customer.wilaya}
                    </td>
                    <td className="num">{o.items.reduce((n, i) => n + i.quantity, 0)}</td>
                    <td className="num nowrap">{formatPrice(o.total)}</td>
                    <td>
                      <StatusPill status={o.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {pages > 1 && (
        <div className="pager">
          {page > 1 && (
            <Link href={href({ page: String(page - 1) })} className="abtn">
              ← Newer
            </Link>
          )}
          <span className="muted">
            Page {page} of {pages}
          </span>
          {page < pages && (
            <Link href={href({ page: String(page + 1) })} className="abtn">
              Older →
            </Link>
          )}
        </div>
      )}
    </>
  );
}
