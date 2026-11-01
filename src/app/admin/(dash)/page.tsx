import Link from "next/link";
import { PageHead, StatusPill, formatDate } from "@/components/admin/ui";
import { db } from "@/lib/db";
import { formatPrice } from "@/lib/format";
import { toOrder, type OrderRowType } from "@/lib/store";

export default async function OverviewPage() {
  const sql = await db();
  const [stats] = await sql<
    {
      new_orders: number;
      today: number;
      month_orders: number;
      month_revenue: number;
      delivered_revenue: number;
      products: number;
      out_of_stock: number;
      hidden: number;
      subscribers: number;
    }[]
  >`
    select
      (select count(*)::int from orders where status = 'new') as new_orders,
      (select count(*)::int from orders where created_at >= date_trunc('day', now() at time zone 'Africa/Algiers') at time zone 'Africa/Algiers') as today,
      (select count(*)::int from orders where created_at > now() - interval '30 days' and status not in ('cancelled','returned')) as month_orders,
      (select coalesce(sum(total),0)::int from orders where created_at > now() - interval '30 days' and status not in ('cancelled','returned')) as month_revenue,
      (select coalesce(sum(total),0)::int from orders where created_at > now() - interval '30 days' and status = 'delivered') as delivered_revenue,
      (select count(*)::int from products) as products,
      (select count(*)::int from products where not in_stock) as out_of_stock,
      (select count(*)::int from products where not active) as hidden,
      (select count(*)::int from subscribers) as subscribers`;

  const days = await sql<{ day: string; orders: number; revenue: number }[]>`
    select to_char(d, 'DD/MM') as day,
           count(o.id)::int as orders,
           coalesce(sum(o.total) filter (where o.status not in ('cancelled','returned')), 0)::int as revenue
    from generate_series((now() at time zone 'Africa/Algiers')::date - 13, (now() at time zone 'Africa/Algiers')::date, interval '1 day') d
    left join orders o on (o.created_at at time zone 'Africa/Algiers')::date = d::date
    group by d order by d`;

  const recent = (await sql<OrderRowType[]>`select * from orders order by created_at desc limit 8`).map(toOrder);

  const top = await sql<{ name: string; qty: number; revenue: number }[]>`
    select i->>'name' as name, sum((i->>'quantity')::int)::int as qty,
           sum((i->>'quantity')::int * (i->>'unitPrice')::int)::int as revenue
    from orders, jsonb_array_elements(items) i
    where created_at > now() - interval '30 days' and status not in ('cancelled','returned')
    group by 1 order by qty desc limit 5`;

  const max = Math.max(1, ...days.map((d) => d.orders));
  const avg = stats.month_orders ? Math.round(stats.month_revenue / stats.month_orders) : 0;

  return (
    <>
      <PageHead title="Overview" subtitle="Last 30 days, excluding cancelled and returned orders." />

      <div className="stats">
        <Link href="/admin/orders?status=new" className={`stat ${stats.new_orders ? "stat--alert" : ""}`}>
          <span className="stat__label">New orders to confirm</span>
          <strong className="stat__value">{stats.new_orders}</strong>
          <span className="stat__hint">{stats.today} received today</span>
        </Link>
        <div className="stat">
          <span className="stat__label">Revenue</span>
          <strong className="stat__value">{formatPrice(stats.month_revenue)}</strong>
          <span className="stat__hint">{formatPrice(stats.delivered_revenue)} delivered and collected</span>
        </div>
        <div className="stat">
          <span className="stat__label">Orders</span>
          <strong className="stat__value">{stats.month_orders}</strong>
          <span className="stat__hint">Average order {formatPrice(avg)}</span>
        </div>
        <Link href="/admin/products" className="stat">
          <span className="stat__label">Products</span>
          <strong className="stat__value">{stats.products}</strong>
          <span className="stat__hint">
            {stats.out_of_stock} out of stock · {stats.hidden} hidden
          </span>
        </Link>
      </div>

      <div className="panels">
        <section className="panel">
          <div className="panel__head">
            <h2>Orders, last 14 days</h2>
          </div>
          <div className="bars" role="img" aria-label="Orders per day over the last 14 days">
            {days.map((d) => (
              <div key={d.day} className="bars__col" title={`${d.day}: ${d.orders} orders, ${formatPrice(d.revenue)}`}>
                <span className="bars__value">{d.orders || ""}</span>
                <span className="bars__bar" style={{ height: `${(d.orders / max) * 100}%` }} />
                <span className="bars__label">{d.day.slice(0, 2)}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="panel">
          <div className="panel__head">
            <h2>Best sellers</h2>
          </div>
          {top.length === 0 ? (
            <p className="muted empty-note">No sales yet in the last 30 days.</p>
          ) : (
            <ol className="ranking">
              {top.map((t) => (
                <li key={t.name}>
                  <span>{t.name}</span>
                  <span className="muted">{t.qty} sold</span>
                  <strong>{formatPrice(t.revenue)}</strong>
                </li>
              ))}
            </ol>
          )}
        </section>
      </div>

      <section className="panel">
        <div className="panel__head">
          <h2>Latest orders</h2>
          <Link href="/admin/orders" className="link">
            View all →
          </Link>
        </div>
        {recent.length === 0 ? (
          <p className="muted empty-note">No orders yet. They&apos;ll appear here as soon as a customer checks out.</p>
        ) : (
          <div className="table-scroll">
            <table className="table">
              <tbody>
                {recent.map((o) => (
                  <tr key={o.id}>
                    <td>
                      <Link href={`/admin/orders/${o.id}`} className="strong-link">
                        {o.id}
                      </Link>
                    </td>
                    <td>{o.customer.name}</td>
                    <td className="muted">{o.customer.wilaya}</td>
                    <td className="muted">{formatDate(o.createdAt)}</td>
                    <td className="num">{formatPrice(o.total)}</td>
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

      <p className="muted small">
        {stats.subscribers} newsletter subscriber{stats.subscribers === 1 ? "" : "s"} ·{" "}
        <Link href="/admin/subscribers" className="link">
          view list
        </Link>
      </p>
    </>
  );
}
