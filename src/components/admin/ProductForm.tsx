"use client";

import { useState } from "react";
import { saveProduct } from "@/app/admin/actions";
import { formatPrice, slugify } from "@/lib/format";
import type { ColorOption, Product } from "@/lib/types";
import ActionForm from "./ActionForm";
import ImageField from "./ImageField";
import TranslationFields from "./TranslationFields";

const ART_OPTIONS: [Product["art"], string][] = [
  ["apron-bib", "Bib apron"],
  ["apron-cross", "Cross-back apron"],
  ["apron-waist", "Waist apron"],
  ["jacket", "Chef jacket"],
  ["jacket-short", "Short-sleeve jacket"],
  ["pants", "Pants"],
  ["hat", "Chef hat"],
  ["knife", "Knife"],
  ["knife-roll", "Knife roll"],
  ["whisk", "Whisk"],
  ["tongs", "Tongs"],
  ["spatula", "Spatula"],
  ["ladle", "Ladle"],
];

const SIZE_PRESETS: [string, string][] = [
  ["Clothing XS–XXL", "XS, S, M, L, XL, XXL"],
  ["Apron Regular/Long", "Regular, Long"],
  ["One size", "One size"],
];

export default function ProductForm({
  product,
  categories,
}: {
  product?: Product;
  categories: { slug: string; name: string }[];
}) {
  const [name, setName] = useState(product?.name ?? "");
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(product));
  const [price, setPrice] = useState(product?.price?.toString() ?? "");
  const [image, setImage] = useState(product?.image ?? "");
  const [sizes, setSizes] = useState(product?.sizes?.join(", ") ?? "");
  const [colors, setColors] = useState<ColorOption[]>(product?.colors ?? [{ name: "Default", hex: "#1f1f1f" }]);

  const updateColor = (i: number, patch: Partial<ColorOption>) =>
    setColors((cs) => cs.map((c, j) => (j === i ? { ...c, ...patch } : c)));
  const moveColor = (i: number, dir: -1 | 1) =>
    setColors((cs) => {
      const next = [...cs];
      const [c] = next.splice(i, 1);
      next.splice(i + dir, 0, c);
      return next;
    });

  const previewImage = image || colors.find((c) => c.image)?.image;

  return (
    <ActionForm action={saveProduct} className="product-form" submitLabel={product ? "Save product" : "Create product"}>
      {product && <input type="hidden" name="id" value={product.id} />}
      <input type="hidden" name="colors" value={JSON.stringify(colors)} />

      <div className="form-grid">
        <div className="form-main">
          <section className="panel">
            <h2 className="panel__title">Basics</h2>
            <label className="field">
              <span className="field__label">Name</span>
              <input
                name="name"
                className="input"
                required
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (!slugTouched) setSlug(slugify(e.target.value));
                }}
              />
            </label>
            <label className="field">
              <span className="field__label">Web address</span>
              <div className="input-prefix">
                <span>/products/</span>
                <input
                  name="slug"
                  className="input"
                  value={slug}
                  onChange={(e) => {
                    setSlugTouched(true);
                    setSlug(e.target.value);
                  }}
                />
              </div>
            </label>
            <label className="field">
              <span className="field__label">Collection</span>
              <select name="category" className="input" defaultValue={product?.category ?? categories[0]?.slug} required>
                {categories.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span className="field__label">Short description</span>
              <input name="short" className="input" defaultValue={product?.short} maxLength={300} placeholder="One line shown under the title" />
            </label>
            <label className="field">
              <span className="field__label">Full description</span>
              <textarea name="description" className="input" rows={5} defaultValue={product?.description} />
            </label>
            <label className="field">
              <span className="field__label">Details &amp; care</span>
              <textarea
                name="details"
                className="input"
                rows={4}
                defaultValue={product?.details.join("\n")}
                placeholder={"One point per line, e.g.\n100% cotton\nMachine washable at 40°C"}
              />
            </label>
          </section>

          <section className="panel">
            <h2 className="panel__title">Photos &amp; colors</h2>
            <ImageField label="Main photo" value={image} onChange={setImage} help="Square photos look best (about 1200 × 1200 px)." />
            <input type="hidden" name="image" value={image} />

            <div className="colors">
              <span className="field__label">Colors</span>
              <p className="field__help">Each color can have its own photo, shown when the customer picks that color.</p>
              {colors.map((c, i) => (
                <div key={i} className="color-row">
                  <input
                    type="color"
                    value={c.hex}
                    onChange={(e) => updateColor(i, { hex: e.target.value })}
                    aria-label={`Color ${i + 1} swatch`}
                  />
                  <input
                    className="input"
                    value={c.name}
                    placeholder="Color name"
                    onChange={(e) => updateColor(i, { name: e.target.value })}
                    aria-label={`Color ${i + 1} name`}
                  />
                  <ImageField compact value={c.image ?? ""} onChange={(url) => updateColor(i, { image: url || undefined })} />
                  <div className="color-row__tools">
                    <button type="button" className="icon-abtn" disabled={i === 0} onClick={() => moveColor(i, -1)} aria-label="Move up">
                      ↑
                    </button>
                    <button type="button" className="icon-abtn" disabled={i === colors.length - 1} onClick={() => moveColor(i, 1)} aria-label="Move down">
                      ↓
                    </button>
                    <button
                      type="button"
                      className="icon-abtn"
                      disabled={colors.length === 1}
                      onClick={() => setColors((cs) => cs.filter((_, j) => j !== i))}
                      aria-label="Remove color"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
              <button type="button" className="abtn abtn--small" onClick={() => setColors((cs) => [...cs, { name: "", hex: "#888888" }])}>
                + Add color
              </button>
            </div>

            <label className="field">
              <span className="field__label">Illustration (used when there&apos;s no photo)</span>
              <select name="art" className="input" defaultValue={product?.art ?? "apron-bib"}>
                {ART_OPTIONS.map(([v, l]) => (
                  <option key={v} value={v}>
                    {l}
                  </option>
                ))}
              </select>
            </label>
          </section>

          <section className="panel">
            <h2 className="panel__title">Sizes</h2>
            <label className="field">
              <span className="field__label">Sizes, separated by commas</span>
              <input name="sizes" className="input" value={sizes} onChange={(e) => setSizes(e.target.value)} placeholder="Leave empty if the product has no sizes" />
            </label>
            <div className="chip-row">
              {SIZE_PRESETS.map(([label, value]) => (
                <button key={label} type="button" className="abtn abtn--small abtn--ghost" onClick={() => setSizes(value)}>
                  {label}
                </button>
              ))}
              {sizes && (
                <button type="button" className="abtn abtn--small abtn--ghost" onClick={() => setSizes("")}>
                  No sizes
                </button>
              )}
            </div>
          </section>

          <section className="panel">
            <h2 className="panel__title">Translations</h2>
            <p className="muted small panel__desc">
              What French and Arabic visitors see. Colour and size names are translated automatically when they&apos;re
              common ones (Black, Sand, Long…).
            </p>
            <TranslationFields
              prefix="i18n"
              values={Object.fromEntries(
                Object.entries(product?.i18n ?? {}).map(([l, v]) => [l, { ...v, details: v?.details?.join("\n") }]),
              )}
              fields={[
                { key: "name", label: "Name", english: product?.name ?? name },
                { key: "short", label: "Short description", english: product?.short ?? "" },
                { key: "description", label: "Full description", english: product?.description ?? "", multiline: true, rows: 4 },
                {
                  key: "details",
                  label: "Details & care (one per line)",
                  english: product?.details.join("\n") ?? "",
                  multiline: true,
                  perLine: true,
                  rows: 4,
                },
              ]}
            />
          </section>
        </div>

        <aside className="form-side">
          <section className="panel">
            <h2 className="panel__title">Price</h2>
            <label className="field">
              <span className="field__label">Price (DA)</span>
              <input name="price" className="input" inputMode="numeric" required value={price} onChange={(e) => setPrice(e.target.value)} />
            </label>
            <label className="field">
              <span className="field__label">“Was” price (DA)</span>
              <input name="compareAtPrice" className="input" inputMode="numeric" defaultValue={product?.compareAtPrice ?? ""} placeholder="Optional, shows a Sale badge" />
            </label>
          </section>

          <section className="panel">
            <h2 className="panel__title">Visibility</h2>
            <label className="check">
              <input type="checkbox" name="active" defaultChecked={product?.active ?? true} />
              <span>
                Visible in the shop
                <small>Hidden products can&apos;t be seen or ordered.</small>
              </span>
            </label>
            <label className="check">
              <input type="checkbox" name="inStock" defaultChecked={product?.inStock ?? true} />
              <span>
                In stock
                <small>Out-of-stock products stay visible but can&apos;t be added to the cart.</small>
              </span>
            </label>
            <label className="check">
              <input type="checkbox" name="isNew" defaultChecked={product?.isNew ?? false} />
              <span>
                Show in “New arrivals”
                <small>Also adds a New badge.</small>
              </span>
            </label>
            <label className="field">
              <span className="field__label">Position</span>
              <input name="sort" className="input" inputMode="numeric" defaultValue={product?.sort ?? 0} />
              <span className="field__help">Lower numbers appear first in their collection.</span>
            </label>
          </section>

          <section className="panel preview-card">
            <h2 className="panel__title">Preview</h2>
            <div className="preview-card__media">
              {previewImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={previewImage} alt="" />
              ) : (
                <span className="muted small">No photo yet</span>
              )}
            </div>
            <strong>{name || "Product name"}</strong>
            <span>{price && !Number.isNaN(Number(price)) ? formatPrice(Number(price)) : "—"}</span>
          </section>
        </aside>
      </div>
    </ActionForm>
  );
}
