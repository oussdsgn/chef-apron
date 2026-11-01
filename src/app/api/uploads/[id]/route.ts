import { COL, db } from "@/lib/db";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[\w-]+\.\w+$/.test(id)) return new Response("Not found", { status: 404 });
  const doc = await (await db()).collection(COL.uploads).doc(id).get();
  const d = doc.data() as { contentType: string; data: Buffer } | undefined;
  if (!d) return new Response("Not found", { status: 404 });
  return new Response(new Uint8Array(d.data), {
    headers: { "Content-Type": d.contentType, "Cache-Control": "public, max-age=31536000, immutable" },
  });
}
