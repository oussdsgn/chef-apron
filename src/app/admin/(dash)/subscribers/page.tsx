import type { Metadata } from "next";
import ConfirmButton from "@/components/admin/ConfirmButton";
import { PageHead, formatDate } from "@/components/admin/ui";
import { deleteSubscriber } from "@/app/admin/actions";
import { COL, db, toIso } from "@/lib/db";

export const metadata: Metadata = { title: "Subscribers" };

export default async function SubscribersPage() {
  const snap = await (await db()).collection(COL.subscribers).orderBy("createdAt", "desc").limit(2000).get();
  const rows = snap.docs.map((d) => ({ email: String(d.get("email")), createdAt: toIso(d.get("createdAt")) }));
  return (
    <>
      <PageHead
        title="Newsletter subscribers"
        subtitle={`${rows.length} people signed up from the website.`}
        actions={
          rows.length > 0 && (
            <a href="/api/admin/subscribers" className="abtn">
              Download CSV
            </a>
          )
        }
      />
      <section className="panel panel--flush">
        {rows.length === 0 ? (
          <p className="muted empty-note">No subscribers yet.</p>
        ) : (
          <div className="table-scroll">
            <table className="table">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Signed up</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.email}>
                    <td>
                      <a href={`mailto:${r.email}`} className="link">
                        {r.email}
                      </a>
                    </td>
                    <td className="muted">{formatDate(r.createdAt)}</td>
                    <td className="num">
                      <ConfirmButton
                        action={deleteSubscriber.bind(null, r.email)}
                        confirm={`Remove ${r.email}?`}
                        className="abtn abtn--small abtn--ghost"
                      >
                        Remove
                      </ConfirmButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}
