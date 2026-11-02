import Link from "next/link";
import { PageHead, StatusPill, formatDate } from "@/components/admin/ui";
import { COL, db } from "@/lib/db";
import { formatPrice } from "@/lib/format";
import { listAllProducts, toOrder } from "@/lib/store";

const TZ = "Africa/Algiers";
const dayKey = (d: Date) => new Intl.DateTimeFormat("en-CA", { timeZone: TZ }).format(d); // YYYY-MM-DD

export default async function OverviewPage() {
  const firestore = await db();
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const [monthSnap, newCount, recentSnap, products, subscribers] = await Promise.all([
    firestore.collection(COL.orders).where("createdAt", ">=", since).get(),
    firestore.collection(COL.orders).where("status", "==", "new").count().get(),
    firestore.collection(COL.orders).orderBy("createdAt", "desc").limit(8).get(),
    listAllProducts(),
    firestore.collection(COL.subscribers).count().get(),
  ]);
  const month = monthSnap.docs.map(toOrder);
  const counted = month.filter((o) => o.status !== "cancelled" && o.status !== "returned");
  const revenue = counted.reduce((s, o) => s + o.total, 0);
  const delivered = counted.filter((o) => o.status === "delivered").reduce((s, o) => s + o.total, 0);
  const today = dayKey(new Date());
  const todayCount = month.filter((o) => dayKey(new Date(o.createdAt)) === today).length;
  const avg = counted.length ? Math.round(revenue / counted.length) : 0;

  const days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(Date.now() - (13 - i) * 24 * 60 * 60 * 1000);
    const key = dayKey(d);
    const orders = month.filter((o) => dayKey(new Date(o.createdAt)) === key);
    return {
      key,
      label: key.slice(8, 10),
      orders: orders.length,
      revenue: orders.filter((o) => o.status !== "cancelled" && o.status !== "returned").reduce((s, o) => s + o.total, 0),
    };
  });
  const max = Math.max(1, ...days.map((d) => d.orders));

  const sales = new Map<string, { qty: number; revenue: number }>();
  for (const o of counted)
    for (const i of o.items) {
      const t = sales.get(i.name) ?? { qty: 0, revenue: 0 };
      t.qty += i.quantity;
      t.revenue += i.quantity * i.unitPrice;
      sales.set(i.name, t);
    }
  const top = [...sales.entries()].sort((a, b) => b[1].qty - a[1].qty).slice(0, 5);
  const recent = recentSnap.docs.map(toOrder);
  const outOfStock = products.filter((p) => !p.inStock).length;
  const hidden = products.filter((p) => !p.active).length;
  const newOrders = newCount.data().count;
  const subs = subscribers.data().count;

  return (
    <>
      <PageHead title="Overview" subtitle="Last 30 days, excluding cancelled and returned orders." />

      <div className="stats">
        <Link href="/admin/orders?status=new" className={`stat ${newOrders ? "stat--alert" : ""}`}>
          <span className="stat__label">New orders to confirm</span>
          <strong className="stat__value">{newOrders}</strong>
          <span className="stat__hint">{todayCount} received today</span>
        </Link>
        <div className="stat">
          <span className="stat__label">Revenue</span>
          <strong className="stat__value">{formatPrice(revenue)}</strong>
          <span className="stat__hint">{formatPrice(delivered)} delivered and collected</span>
        </div>
        <div className="stat">
          <span className="stat__label">Orders</span>
          <strong className="stat__value">{counted.length}</strong>
          <span className="stat__hint">Average order {formatPrice(avg)}</span>
        </div>
        <Link href="/admin/products" className="stat">
          <span className="stat__label">Products</span>
          <strong className="stat__value">{products.length}</strong>
          <span className="stat__hint">
            {outOfStock} out of stock · {hidden} hidden
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
              <div key={d.key} className="bars__col" title={`${d.key}: ${d.orders} orders, ${formatPrice(d.revenue)}`}>
                <span className="bars__value">{d.orders || ""}</span>
                <span className="bars__bar" style={{ height: `${(d.orders / max) * 100}%` }} />
                <span className="bars__label">{d.label}</span>
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
              {top.map(([name, t]) => (
                <li key={name}>
                  <span>{name}</span>
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
        {subs} newsletter subscriber{subs === 1 ? "" : "s"} ·{" "}
        <Link href="/admin/subscribers" className="link">
          view list
        </Link>
      </p>
    </>
  );
}
