"use client";

import { useRef, useState } from "react";
import { uploadImage } from "@/app/admin/actions";

/** Resizes the photo in the browser (max 1800 px, JPEG) so uploads stay small and fast. */
async function compress(file: File, maxSize = 1800): Promise<File> {
  if (!file.type.startsWith("image/") || file.type === "image/gif") return file;
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/jpeg", 0.85));
  if (!blob) return file;
  return new File([blob], file.name.replace(/\.\w+$/, "") + ".jpg", { type: "image/jpeg" });
}

export default function ImageField({
  name,
  label,
  defaultValue = "",
  help,
  value: controlled,
  onChange,
  compact,
}: {
  name?: string;
  label?: string;
  defaultValue?: string;
  help?: string;
  value?: string;
  onChange?: (url: string) => void;
  compact?: boolean;
}) {
  const [own, setOwn] = useState(defaultValue);
  const value = controlled ?? own;
  const setValue = (v: string) => {
    setOwn(v);
    onChange?.(v);
  };
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const input = useRef<HTMLInputElement>(null);

  async function pick(file?: File) {
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("file", await compress(file));
      const res = await uploadImage(fd);
      if (res.url) setValue(res.url);
      else setError(res.error ?? "Upload failed.");
    } catch {
      setError("Upload failed. Try a smaller image.");
    }
    setBusy(false);
    if (input.current) input.current.value = "";
  }

  return (
    <div className={`image-field ${compact ? "image-field--compact" : ""}`}>
      {label && <span className="field__label">{label}</span>}
      <div className="image-field__row">
        <div
          className="image-field__preview"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            pick(e.dataTransfer.files[0]);
          }}
        >
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" />
          ) : (
            <span>No photo</span>
          )}
        </div>
        <div className="image-field__actions">
          <button type="button" className="abtn abtn--small" onClick={() => input.current?.click()} disabled={busy}>
            {busy ? "Uploading…" : value ? "Replace" : "Upload photo"}
          </button>
          {value && (
            <button type="button" className="abtn abtn--small abtn--ghost" onClick={() => setValue("")} disabled={busy}>
              Remove
            </button>
          )}
        </div>
      </div>
      {name && <input type="hidden" name={name} value={value} />}
      <input ref={input} type="file" accept="image/*" hidden onChange={(e) => pick(e.target.files?.[0])} />
      {help && <span className="field__help">{help}</span>}
      {error && <span className="field__error">{error}</span>}
    </div>
  );
}
