"use client";

import { useState } from "react";
import { LOCALE_NAMES, TRANSLATED, type TranslatedLocale } from "@/lib/i18n/config";
import { tx } from "@/lib/i18n/localize";

export type TranslationField = {
  /** Form field name suffix: inputs are named `${prefix}.${locale}.${key}`. */
  key: string;
  label: string;
  /** The current English text, used to show the built-in translation as a hint. */
  english: string;
  multiline?: boolean;
  /** Translate the hint line by line (lists such as product details). */
  perLine?: boolean;
  rows?: number;
  help?: string;
};

/**
 * French and Arabic inputs for a set of texts. Empty inputs keep using the built-in translation
 * (shown as the placeholder) or the English text.
 */
export default function TranslationFields({
  prefix,
  fields,
  values,
}: {
  prefix: string;
  fields: TranslationField[];
  values?: Partial<Record<TranslatedLocale, Record<string, string | undefined>>>;
}) {
  const [tab, setTab] = useState<TranslatedLocale>("fr");
  return (
    <div className="translations">
      <div className="translations__tabs" role="tablist">
        {TRANSLATED.map((l) => (
          <button
            key={l}
            type="button"
            role="tab"
            aria-selected={tab === l}
            className={tab === l ? "is-active" : undefined}
            onClick={() => setTab(l)}
          >
            {LOCALE_NAMES[l]}
          </button>
        ))}
      </div>
      {TRANSLATED.map((l) => (
        // Both languages stay in the form (just hidden) so saving keeps the other tab's text.
        <div key={l} className="translations__panel" hidden={tab !== l} dir={l === "ar" ? "rtl" : "ltr"} lang={l}>
          {fields.map((f) => {
            const name = `${prefix}.${l}.${f.key}`;
            const builtIn = f.perLine
              ? f.english
                  .split("\n")
                  .map((line) =>
                    line
                      .split(" | ")
                      .map((part) => tx(part, l))
                      .join(" | "),
                  )
                  .join("\n")
              : tx(f.english, l);
            const placeholder = builtIn !== f.english ? builtIn : f.english;
            return (
              <label key={name} className="field">
                <span className="field__label">{f.label}</span>
                {f.multiline ? (
                  <textarea
                    name={name}
                    className="input"
                    rows={f.rows ?? 3}
                    defaultValue={values?.[l]?.[f.key] ?? ""}
                    placeholder={placeholder}
                  />
                ) : (
                  <input name={name} className="input" defaultValue={values?.[l]?.[f.key] ?? ""} placeholder={placeholder} />
                )}
                {f.help && <span className="field__help">{f.help}</span>}
              </label>
            );
          })}
          <p className="field__help" dir="ltr">
            Leave a field empty to use the text shown in grey (the built-in translation, or the English text).
          </p>
        </div>
      ))}
    </div>
  );
}
