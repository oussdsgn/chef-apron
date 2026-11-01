import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ActionForm from "@/components/admin/ActionForm";
import ConfirmButton from "@/components/admin/ConfirmButton";
import { PageHead, StatusPill, formatDate } from "@/components/admin/ui";
import { deleteOrder, saveOrderNote } from "@/app/admin/actions";
import { COL, db } from "@/lib/db";
import { formatPrice } from "@/lib/format";
import { toOrder } from "@/lib/store";
import StatusButtons from "./StatusButtons";
import PrintButton from "./PrintButton";

type Params = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  return { title: `Order ${(await params).id}` };
}

export default async function OrderPage({ params }: Params) {
  const { id } = await params;
  if (!/^[\w-]{1,128}$/.test(id)) notFound();
  const doc = await (await db()).collection(COL.orders).doc(id).get();
  if (!doc.exists) notFound();
  const o = toOrder(doc);
  const c = o.customer;
  const intl = c.phone.replace(/^0/, "213");

  return (
    <>
      <PageHead
        back={{ href: "/admin/orders", label: "Orders" }}
        title={`Order ${o.id}`}
        subtitle={
          <>
            Placed {formatDate(o.createdAt)} · Cash on delivery · <StatusPill status={o.status} />
          </>
        }
        actions={<PrintButton />}
      />

      <section className="panel no-print">
        <div className="panel__head">
          <h2>Status</h2>
        </div>
        <StatusButtons id={o.id} status={o.status} />
      </section>

      <div className="panels">
        <section className="panel">
          <div className="panel__head">
            <h2>Customer</h2>
          </div>
          <dl className="kv">
            <dt>Name</dt>
            <dd>{c.name}</dd>
            <dt>Phone</dt>
            <dd>
              <a href={`tel:${c.phone}`} className="strong-link">
                {c.phone}
              </a>
            </dd>
            <dt>Wilaya</dt>
            <dd>
              {c.wilayaCode} · {c.wilaya}
            </dd>
            <dt>Commune</dt>
            <dd>{c.commune}</dd>
            <dt>Address</dt>
            <dd>{c.address}</dd>
            {c.note && (
              <>
                <dt>Customer note</dt>
                <dd>{c.note}</dd>
              </>
            )}
          </dl>
          <div className="button-row no-print">
            <a href={`tel:${c.phone}`} className="abtn abtn--primary">
              Call
            </a>
            <a href={`https://wa.me/${intl}`} target="_blank" rel="noreferrer" className="abtn">
              WhatsApp
            </a>
            <a href={`sms:${c.phone}`} className="abtn">
              SMS
            </a>
          </div>
        </section>

        <section className="panel">
          <div className="panel__head">
            <h2>Items</h2>
          </div>
          <table className="table table--compact">
            <tbody>
              {o.items.map((i, n) => (
                <tr key={n}>
                  <td>
                    <strong>{i.quantity} ×</strong> {i.name}
                    <div className="muted small">{i.variant}</div>
                  </td>
                  <td className="num nowrap">{formatPrice(i.unitPrice * i.quantity)}</td>
                </tr>
              ))}
              <tr>
                <td className="muted">Subtotal</td>
                <td className="num">{formatPrice(o.subtotal)}</td>
              </tr>
              <tr>
                <td className="muted">Delivery</td>
                <td className="num">{o.shipping ? formatPrice(o.shipping) : "Free"}</td>
              </tr>
              <tr className="total-row">
                <td>To collect</td>
                <td className="num">{formatPrice(o.total)}</td>
              </tr>
            </tbody>
          </table>
        </section>
      </div>

      <section className="panel no-print">
        <div className="panel__head">
          <h2>Internal note</h2>
          <span className="muted small">Only visible to admins</span>
        </div>
        <ActionForm action={saveOrderNote} submitLabel="Save note">
          <input type="hidden" name="id" value={o.id} />
          <textarea
            name="note"
            rows={3}
            defaultValue={o.adminNote}
            className="input"
            placeholder="e.g. Called at 14:00, confirmed. Tracking number…"
          />
        </ActionForm>
      </section>

      <div className="danger-zone no-print">
        <ConfirmButton action={deleteOrder.bind(null, o.id)} confirm={`Delete order ${o.id} permanently?`}>
          Delete order
        </ConfirmButton>
      </div>
    </>
  );
}
