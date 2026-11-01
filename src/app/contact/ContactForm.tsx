"use client";

import { site } from "@/lib/site";

export default function ContactForm() {
  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const subject = encodeURIComponent(`[${data.get("topic")}] Message from ${data.get("name")}`);
    const body = encodeURIComponent(`${data.get("message")}\n\n— ${data.get("name")} (${data.get("email")})`);
    window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`;
  }

  return (
    <form className="card-form" onSubmit={submit}>
      <label>
        Name
        <input name="name" required />
      </label>
      <label>
        Email
        <input name="email" type="email" required />
      </label>
      <label>
        Topic
        <select name="topic" defaultValue="General">
          <option>General</option>
          <option>Sizing</option>
          <option>Order</option>
          <option>Bulk / restaurant team</option>
          <option>Custom embroidery</option>
        </select>
      </label>
      <label>
        Message
        <textarea name="message" rows={5} required />
      </label>
      <button className="btn btn--dark">Send message</button>
    </form>
  );
}
