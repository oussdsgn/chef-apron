"use client";

import { saveSettings } from "@/app/admin/actions";
import type { FormGroup } from "@/lib/settings-fields";
import { wilayas } from "@/lib/wilayas";
import ActionForm from "./ActionForm";
import ImageField from "./ImageField";
import TranslationFields from "./TranslationFields";
import { TRANSLATABLE_SETTINGS } from "@/lib/i18n/localize";
import type { Settings } from "@/lib/types";

export default function SettingsForm({
  group,
  values,
  translations,
}: {
  group: FormGroup;
  values: Record<string, unknown>;
  translations?: Settings["translations"];
}) {
  const translatable = (TRANSLATABLE_SETTINGS as Record<string, string[]>)[group.section] ?? [];
  const asText = (key: string) => {
    const v = values[key];
    return Array.isArray(v) ? (v as { title: string; text: string }[]).map((x) => `${x.title} | ${x.text}`).join("\n") : String(v ?? "");
  };
  const trFields = group.fields
    .filter((f) => translatable.includes(f.key))
    .map((f) => ({
      key: `${group.section}.${f.key}`,
      label: f.label,
      english: asText(f.key),
      multiline: f.type !== "text",
      perLine: f.type === "values",
      rows: f.type === "longtext" ? 8 : 3,
    }));
  return (
    <section className="panel" id={group.section}>
      <h2 className="panel__title">{group.title}</h2>
      {group.description && <p className="muted small panel__desc">{group.description}</p>}
      <ActionForm action={saveSettings} submitLabel={`Save ${group.title.toLowerCase()}`}>
        <input type="hidden" name="section" value={group.section} />
        {group.fields.map((f) => {
          const name = `${group.section}.${f.key}`;
          const v = values[f.key];
          if (f.type === "image") {
            return <ImageField key={name} name={name} label={f.label} defaultValue={String(v ?? "")} help={f.help} />;
          }
          if (f.type === "wilayas") {
            const selected = new Set((v as number[]) ?? []);
            return (
              <fieldset key={name} className="field">
                <legend className="field__label">{f.label}</legend>
                <div className="wilaya-grid">
                  {wilayas.map((w) => (
                    <label key={w.code} className="check check--inline">
                      <input type="checkbox" name={name} value={w.code} defaultChecked={selected.has(w.code)} />
                      <span>
                        {String(w.code).padStart(2, "0")} {w.name}
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>
            );
          }
          const text =
            f.type === "values"
              ? ((v as { title: string; text: string }[]) ?? []).map((x) => `${x.title} | ${x.text}`).join("\n")
              : String(v ?? "");
          return (
            <label key={name} className="field">
              <span className="field__label">{f.label}</span>
              {f.type === "textarea" || f.type === "longtext" || f.type === "values" ? (
                <textarea name={name} className="input" rows={f.type === "longtext" ? 10 : 3} defaultValue={text} />
              ) : (
                <input
                  name={name}
                  className="input"
                  defaultValue={text}
                  type={f.type === "email" ? "email" : f.type === "url" ? "url" : "text"}
                  inputMode={f.type === "number" ? "numeric" : undefined}
                />
              )}
              {f.help && <span className="field__help">{f.help}</span>}
            </label>
          );
        })}
        {trFields.length > 0 && (
          <details className="tr-block">
            <summary>French &amp; Arabic translations</summary>
            <TranslationFields prefix="tr" fields={trFields} values={translations} />
          </details>
        )}
      </ActionForm>
    </section>
  );
}
