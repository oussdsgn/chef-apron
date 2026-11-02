"use client";

import { useEffect, useRef, useState } from "react";
import { LOCALE_COOKIE, LOCALE_NAMES, LOCALE_SHORT, LOCALES, type Locale } from "@/lib/i18n/config";
import { useStore } from "./StoreProvider";

export default function LanguageSwitcher() {
  const { locale, t } = useStore();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent ? e.key === "Escape" : !ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", close);
    };
  }, [open]);

  function choose(l: Locale) {
    setOpen(false);
    if (l === locale) return;
    document.cookie = `${LOCALE_COOKIE}=${l}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
    // Full reload so the whole page (including right-to-left layout for Arabic) switches at once.
    window.location.reload();
  }

  return (
    <div className="lang" ref={ref}>
      <button
        type="button"
        className="lang__btn"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`${t("nav.language")}: ${LOCALE_NAMES[locale]}`}
        onClick={() => setOpen((v) => !v)}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3Z" />
        </svg>
        <span>{LOCALE_SHORT[locale]}</span>
      </button>
      {open && (
        <ul className="lang__menu" role="listbox" aria-label={t("nav.language")}>
          {LOCALES.map((l) => (
            <li key={l}>
              <button
                type="button"
                role="option"
                aria-selected={l === locale}
                lang={l}
                className={l === locale ? "is-active" : undefined}
                onClick={() => choose(l)}
              >
                {LOCALE_NAMES[l]}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
