import "server-only";
import { put } from "@vercel/blob";
import { randomUUID } from "crypto";
import { db } from "./db";

const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"];
export const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;

/** Stores an image in Vercel Blob when configured, otherwise in the database. Returns its public URL. */
export async function saveImage(file: File): Promise<string> {
  if (!ALLOWED.includes(file.type)) throw new Error("Please upload a JPG, PNG, WebP or AVIF image.");
  if (file.size > MAX_UPLOAD_BYTES) throw new Error("Image is too large (max 4 MB).");
  const ext = file.type.split("/")[1].replace("jpeg", "jpg");
  const id = `${randomUUID()}.${ext}`;

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(`uploads/${id}`, file, { access: "public", contentType: file.type });
    return blob.url;
  }
  const sql = await db();
  const data = Buffer.from(await file.arrayBuffer());
  await sql`insert into uploads (id, content_type, data) values (${id}, ${file.type}, ${data})`;
  return `/api/uploads/${id}`;
}
