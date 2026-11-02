"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/components/CartProvider";
import ProductImage from "@/components/ProductImage";
import { useStore } from "@/components/StoreProvider";
import { shippingFor } from "@/lib/format";
import { normalizePhone, wilayas } from "@/lib/wilayas";

type Errors = Partial<Record<"name" | "phone" | "wilaya" | "commune" | "address", string>>;

export default function CheckoutPage() {
  const { lines, subtotal, clear } = useCart();
  const { getProduct, settings, t, price, locale } = useStore();
  const router = useRouter();
  const [wilaya, setWilaya] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [message, setMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const shipping = shippingFor(settings.shipping, subtotal, Number(wilaya) || undefined);
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
    if (customer.name.trim().length < 2) errs.name = t("checkout.err.name");
    if (!normalizePhone(customer.phone)) errs.phone = t("checkout.err.phone");
    if (!customer.wilaya) errs.wilaya = t("checkout.err.wilaya");
    if (customer.commune.trim().length < 2) errs.commune = t("checkout.err.commune");
    if (customer.address.trim().length < 5) errs.address = t("checkout.err.address");
    setErrors(errs);
    if (Object.keys(errs).length) {
      setMessage(t("checkout.err.check"));
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
      // Show the server's verdict in the visitor's language.
      if (data.fieldErrors) {
        const translated: Errors = {};
        for (const k of Object.keys(data.fieldErrors) as (keyof Errors)[]) translated[k] = t(`checkout.err.${k}`);
        setErrors(translated);
      }
      setMessage(
        res.status === 409
          ? t("checkout.err.stock")
          : data.fieldErrors
            ? t("checkout.err.check")
            : t("checkout.err.generic"),
      );
    } catch {
      setMessage(t("checkout.err.network"));
    }
    setSubmitting(false);
  }

  if (lines.length === 0) {
    return (
      <section className="container section">
        <div className="empty">
          <h1>{t("checkout.title")}</h1>
          <p>{t("cart.empty")}</p>
          <Link href="/products" className="btn btn--dark">
            {t("cart.shopCollection")}
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
        <h1>{t("checkout.title")}</h1>
        <p>{t("checkout.intro")}</p>
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
          <h2>{t("checkout.details")}</h2>
          <label>
            {t("checkout.name")} *
            <input name="name" autoComplete="name" required {...field("name")} />
            {err("name")}
          </label>
          <label>
            {t("checkout.phone")} *
            <input
              name="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="05 55 12 34 56"
              dir="ltr"
              required
              {...field("phone")}
            />
            {err("phone")}
          </label>
          <div className="form-row">
            <label>
              {t("checkout.wilaya")} *
              <select name="wilaya" required value={wilaya} onChange={(e) => setWilaya(e.target.value)} {...field("wilaya")}>
                <option value="" disabled>
                  {t("checkout.choose")}
                </option>
                {wilayas.map((w) => (
                  <option key={w.code} value={w.code}>
                    {String(w.code).padStart(2, "0")} - {locale === "ar" ? w.nameAr : w.name}
                  </option>
                ))}
              </select>
              {err("wilaya")}
            </label>
            <label>
              {t("checkout.commune")} *
              <input name="commune" autoComplete="address-level2" required {...field("commune")} />
              {err("commune")}
            </label>
          </div>
          <label>
            {t("checkout.address")} *
            <textarea
              name="address"
              rows={2}
              autoComplete="street-address"
              placeholder={t("checkout.addressPlaceholder")}
              required
              {...field("address")}
            />
            {err("address")}
          </label>
          <label>
            {t("checkout.note")}
            <textarea name="note" rows={2} placeholder={t("checkout.notePlaceholder")} />
          </label>

          <div className="pay-method">
            <span className="pay-method__dot" aria-hidden />
            <div>
              <strong>{t("checkout.cod")}</strong>
              <p className="muted small">{t("checkout.codText")}</p>
            </div>
          </div>

          {message && (
            <p className="notice" role="alert">
              {message}
            </p>
          )}
          <button className="btn btn--dark btn--block" disabled={submitting}>
            {submitting ? t("checkout.placing") : t("checkout.place", { total: price(total) })}
          </button>
        </form>

        <aside className="summary">
          <h2>{t("cart.summary")}</h2>
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
                      {p.colors.find((c) => c.name === l.color)?.label ?? l.color}
                      {l.size ? ` · ${p.sizeLabels?.[l.size] ?? l.size}` : ""}
                    </span>
                  </div>
                  <span>{price(p.price * l.quantity)}</span>
                </li>
              );
            })}
          </ul>
          <div className="row-between">
            <span>{t("cart.subtotal")}</span>
            <span>{price(subtotal)}</span>
          </div>
          <div className="row-between">
            <span>{t("checkout.delivery")}</span>
            <span>
              {!wilaya && shipping > 0
                ? t("checkout.chooseWilaya")
                : shipping === 0
                  ? t("checkout.free")
                  : price(shipping)}
            </span>
          </div>
          <div className="row-between summary__total">
            <span>{t("checkout.total")}</span>
            <strong>{price(total)}</strong>
          </div>
          {settings.shipping.freeThreshold > 0 && subtotal < settings.shipping.freeThreshold && (
            <p className="muted small">
              {t("checkout.freeOver", { amount: price(settings.shipping.freeThreshold) })}
            </p>
          )}
        </aside>
      </div>
    </section>
  );
}
