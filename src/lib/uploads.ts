import "server-only";
import { randomUUID } from "crypto";
import { COL, db } from "./db";
import { storageBucket } from "./firebase-admin";

const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"];
export const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;
/** Firestore documents are limited to 1 MiB, so stored images must stay a little under that. */
const MAX_FIRESTORE_BYTES = 950 * 1024;

/**
 * Stores an image and returns its public URL:
 * in Firebase Storage when FIREBASE_STORAGE_BUCKET is set, otherwise in Firestore (served by /api/uploads/[id]).
 */
export async function saveImage(file: File): Promise<string> {
  if (!ALLOWED.includes(file.type)) throw new Error("Please upload a JPG, PNG, WebP or AVIF image.");
  if (file.size > MAX_UPLOAD_BYTES) throw new Error("Image is too large (max 4 MB).");
  const ext = file.type.split("/")[1].replace("jpeg", "jpg");
  const id = `${randomUUID()}.${ext}`;
  const data = Buffer.from(await file.arrayBuffer());

  const bucket = storageBucket();
  if (bucket) {
    const path = `uploads/${id}`;
    const token = randomUUID();
    await bucket.file(path).save(data, {
      contentType: file.type,
      metadata: { cacheControl: "public, max-age=31536000, immutable", metadata: { firebaseStorageDownloadTokens: token } },
    });
    const host = process.env.FIREBASE_STORAGE_EMULATOR_HOST
      ? `http://${process.env.FIREBASE_STORAGE_EMULATOR_HOST}`
      : "https://firebasestorage.googleapis.com";
    return `${host}/v0/b/${bucket.name}/o/${encodeURIComponent(path)}?alt=media&token=${token}`;
  }

  if (data.length > MAX_FIRESTORE_BYTES) {
    throw new Error("Image is too large to store without Firebase Storage. Try a smaller photo.");
  }
  await (await db()).collection(COL.uploads).doc(id).set({ contentType: file.type, data, createdAt: new Date() });
  return `/api/uploads/${id}`;
}
