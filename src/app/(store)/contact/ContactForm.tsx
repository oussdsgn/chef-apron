"use client";

import { useStore } from "@/components/StoreProvider";
import type { MessageKey } from "@/lib/i18n/messages";

// The email subject keeps the English topic so the team always reads the same labels.
const topics: [string, MessageKey][] = [
  ["General", "contact.topic.general"],
  ["Sizing", "contact.topic.sizing"],
  ["Order", "contact.topic.order"],
  ["Bulk / restaurant team", "contact.topic.bulk"],
  ["Custom embroidery", "contact.topic.embroidery"],
];

export default function ContactForm({ email }: { email: string }) {
  const { t } = useStore();

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const subject = encodeURIComponent(`[${data.get("topic")}] Message from ${data.get("name")}`);
    const body = encodeURIComponent(`${data.get("message")}\n\n— ${data.get("name")} (${data.get("email")})`);
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  }

  return (
    <form className="card-form" onSubmit={submit}>
      <label>
        {t("contact.form.name")}
        <input name="name" required />
      </label>
      <label>
        {t("contact.form.email")}
        <input name="email" type="email" required dir="ltr" />
      </label>
      <label>
        {t("contact.form.topic")}
        <select name="topic" defaultValue="General">
          {topics.map(([value, key]) => (
            <option key={value} value={value}>
              {t(key)}
            </option>
          ))}
        </select>
      </label>
      <label>
        {t("contact.form.message")}
        <textarea name="message" rows={5} required />
      </label>
      <button className="btn btn--dark">{t("contact.form.send")}</button>
    </form>
  );
}
