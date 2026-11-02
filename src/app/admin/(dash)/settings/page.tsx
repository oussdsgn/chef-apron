import type { Metadata } from "next";
import ActionForm from "@/components/admin/ActionForm";
import ConfirmButton from "@/components/admin/ConfirmButton";
import SettingsForm from "@/components/admin/SettingsForm";
import { PageHead } from "@/components/admin/ui";
import { addAdmin, removeAdmin } from "@/app/admin/actions";
import { ownerEmails, requireAdminPage } from "@/lib/auth";
import { COL, db } from "@/lib/db";
import { settingsGroups } from "@/lib/settings-fields";
import { loadSettings } from "@/lib/store";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
  const me = await requireAdminPage();
  const [settings, adminsSnap] = await Promise.all([loadSettings(), (await db()).collection(COL.admins).get()]);
  const admins = adminsSnap.docs.map((d) => ({
    email: String(d.get("email")),
    added_by: (d.get("addedBy") as string | undefined) ?? null,
  }));
  const owners = ownerEmails();
  const integrations = [
    { name: "Firestore database", ok: true, hint: "Connected" },
    {
      name: "Photo storage",
      ok: Boolean(process.env.FIREBASE_STORAGE_BUCKET),
      hint: process.env.FIREBASE_STORAGE_BUCKET
        ? `Firebase Storage (${process.env.FIREBASE_STORAGE_BUCKET})`
        : "Photos are stored in Firestore (max ~1 MB each). Set FIREBASE_STORAGE_BUCKET for Firebase Storage.",
    },
    {
      name: "Telegram alerts",
      ok: Boolean(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID),
      hint:
        process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID
          ? "A message is sent for every new order"
          : "Optional: set TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID to get new orders on your phone",
    },
    {
      name: "Order webhook",
      ok: Boolean(process.env.ORDER_WEBHOOK_URL),
      hint: process.env.ORDER_WEBHOOK_URL ? "Orders are also sent to your webhook" : "Optional: ORDER_WEBHOOK_URL",
    },
  ];

  return (
    <>
      <PageHead title="Settings" subtitle="Store details, delivery fees and who can access this dashboard." />
      {settingsGroups.map((g) => (
        <SettingsForm
          key={g.section}
          group={g}
          values={settings[g.section] as Record<string, unknown>}
          translations={settings.translations}
        />
      ))}

      <section className="panel" id="admins">
        <h2 className="panel__title">Dashboard access</h2>
        <p className="muted small panel__desc">
          People listed here can sign in with their Google account and manage everything.
        </p>
        <ul className="admin-list">
          {owners.map((e) => (
            <li key={e}>
              <span>{e}</span>
              <span className="pill">Owner</span>
            </li>
          ))}
          {admins
            .filter((a) => !owners.includes(a.email))
            .map((a) => (
              <li key={a.email}>
                <span>
                  {a.email}
                  {a.added_by && <span className="muted small"> · added by {a.added_by}</span>}
                </span>
                {a.email === me.email ? (
                  <span className="pill">You</span>
                ) : (
                  <ConfirmButton
                    action={removeAdmin.bind(null, a.email)}
                    confirm={`Remove access for ${a.email}?`}
                    className="abtn abtn--small abtn--ghost-danger"
                  >
                    Remove
                  </ConfirmButton>
                )}
              </li>
            ))}
        </ul>
        <ActionForm action={addAdmin} submitLabel="Give access" className="inline-admin-form">
          <input name="email" type="email" className="input" placeholder="name@gmail.com" required aria-label="Google email" />
        </ActionForm>
      </section>

      <section className="panel">
        <h2 className="panel__title">Connections</h2>
        <ul className="integrations">
          {integrations.map((i) => (
            <li key={i.name}>
              <span className={`dot ${i.ok ? "dot--ok" : ""}`} aria-hidden />
              <strong>{i.name}</strong>
              <span className="muted small">{i.hint}</span>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
