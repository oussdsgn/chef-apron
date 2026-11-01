"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/components/CartProvider";
import ProductImage from "@/components/ProductImage";
import { getProduct } from "@/lib/products";
import { formatPrice, shippingFor, site } from "@/lib/site";
import { normalizePhone, wilayas } from "@/lib/wilayas";

type Errors = Partial<Record<"name" | "phone" | "wilaya" | "commune" | "address", string>>;

export default function CheckoutPage() {
  const { lines, subtotal, clear } = useCart();
  const router = useRouter();
  const [wilaya, setWilaya] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [message, setMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const shipping = shippingFor(subtotal, Number(wilaya) || undefined);
  const total = subtotal + shipping;

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const customer = {
      name: String(f.get("name") ?? ""),
      phone: String(f.get("phone") ?? ""),
      wilaya: Number(f.get("wilaya")),
      commune: String(f.get("commune") ?? ""),
      address: String(f.get("address") ?? ""),
      note: String(f.get("note") ?? ""),
    };

    const errs: Errors = {};
    if (customer.name.trim().length < 2) errs.name = "Please enter your full name.";
    if (!normalizePhone(customer.phone)) errs.phone = "Enter a valid phone number, e.g. 0555 12 34 56.";
    if (!customer.wilaya) errs.wilaya = "Please choose your wilaya.";
    if (customer.commune.trim().length < 2) errs.commune = "Please enter your commune.";
    if (customer.address.trim().length < 5) errs.address = "Please enter your delivery address.";
    setErrors(errs);
    if (Object.keys(errs).length) {
      setMessage("Please check the highlighted fields.");
      return;
    }

    setSubmitting(true);
    setMessage(null);
    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lines, customer }),
      });
      const data = (await res.json()) as { orderId?: string; error?: string; fieldErrors?: Errors };
      if (res.ok && data.orderId) {
        clear();
        router.push(`/checkout/success?order=${encodeURIComponent(data.orderId)}`);
        return;
      }
      if (data.fieldErrors) setErrors(data.fieldErrors);
      setMessage(data.error ?? "Something went wrong. Please try again.");
    } catch {
      setMessage("Could not send your order. Check your connection and try again.");
    }
    setSubmitting(false);
  }

  if (lines.length === 0) {
    return (
      <section className="container section">
        <div className="empty">
          <h1>Checkout</h1>
          <p>Your cart is empty.</p>
          <Link href="/products" className="btn btn--dark">
            Shop collection
          </Link>
        </div>
      </section>
    );
  }

  const field = (key: keyof Errors) => ({
    "aria-invalid": errors[key] ? true : undefined,
    "aria-describedby": errors[key] ? `${key}-error` : undefined,
  });
  const err = (key: keyof Errors) =>
    errors[key] ? (
      <span id={`${key}-error`} className="field-error">
        {errors[key]}
      </span>
    ) : null;

  return (
    <section className="container section section--tight">
      <div className="page-head">
        <h1>Checkout</h1>
        <p>Pay cash on delivery. We&apos;ll call you to confirm your order before shipping.</p>
      </div>

      <div className="cart-page">
        <form
          className="card-form checkout-form"
          onSubmit={submit}
          onChange={(e) => {
            const name = (e.target as HTMLInputElement).name as keyof Errors;
            if (errors[name]) setErrors(({ [name]: _removed, ...rest }) => rest);
          }}
          noValidate
        >
          <h2>Delivery details</h2>
          <label>
            Full name *
            <input name="name" autoComplete="name" required {...field("name")} />
            {err("name")}
          </label>
          <label>
            Phone number *
            <input
              name="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="05 55 12 34 56"
              required
              {...field("phone")}
            />
            {err("phone")}
          </label>
          <div className="form-row">
            <label>
              Wilaya *
              <select name="wilaya" required value={wilaya} onChange={(e) => setWilaya(e.target.value)} {...field("wilaya")}>
                <option value="" disabled>
                  Choose…
                </option>
                {wilayas.map((w) => (
                  <option key={w.code} value={w.code}>
                    {String(w.code).padStart(2, "0")} - {w.name}
                  </option>
                ))}
              </select>
              {err("wilaya")}
            </label>
            <label>
              Commune *
              <input name="commune" autoComplete="address-level2" required {...field("commune")} />
              {err("commune")}
            </label>
          </div>
          <label>
            Address *
            <textarea
              name="address"
              rows={2}
              autoComplete="street-address"
              placeholder="Street, building, floor…"
              required
              {...field("address")}
            />
            {err("address")}
          </label>
          <label>
            Note for the delivery (optional)
            <textarea name="note" rows={2} placeholder="Best time to call, landmark…" />
          </label>

          <div className="pay-method">
            <span className="pay-method__dot" aria-hidden />
            <div>
              <strong>Cash on delivery</strong>
              <p className="muted small">Pay the delivery agent when your order arrives.</p>
            </div>
          </div>

          {message && (
            <p className="notice" role="alert">
              {message}
            </p>
          )}
          <button className="btn btn--dark btn--block" disabled={submitting}>
            {submitting ? "Placing order…" : `Place order — ${formatPrice(total)}`}
          </button>
        </form>

        <aside className="summary">
          <h2>Order summary</h2>
          <ul className="summary__items">
            {lines.map((l) => {
              const p = getProduct(l.slug);
              if (!p) return null;
              return (
                <li key={`${l.slug}|${l.color}|${l.size}`}>
                  <div className="summary__thumb">
                    <ProductImage product={p} color={p.colors.find((c) => c.name === l.color)?.hex} sizes="56px" />
                    <span className="summary__qty">{l.quantity}</span>
                  </div>
                  <div className="summary__name">
                    {p.name}
                    <span className="muted small">
                      {l.color}
                      {l.size ? ` · ${l.size}` : ""}
                    </span>
                  </div>
                  <span>{formatPrice(p.price * l.quantity)}</span>
                </li>
              );
            })}
          </ul>
          <div className="row-between">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="row-between">
            <span>Delivery</span>
            <span>{!wilaya && shipping > 0 ? "Choose wilaya" : shipping === 0 ? "Free" : formatPrice(shipping)}</span>
          </div>
          <div className="row-between summary__total">
            <span>Total</span>
            <strong>{formatPrice(total)}</strong>
          </div>
          {subtotal < site.freeShippingThreshold && (
            <p className="muted small">Free delivery on orders over {formatPrice(site.freeShippingThreshold)}.</p>
          )}
        </aside>
      </div>
    </section>
  );
}
