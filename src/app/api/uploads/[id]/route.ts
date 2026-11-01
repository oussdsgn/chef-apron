import { db } from "@/lib/db";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[\w-]+\.\w+$/.test(id)) return new Response("Not found", { status: 404 });
  const sql = await db();
  const [row] = await sql<{ content_type: string; data: Buffer }[]>`
    select content_type, data from uploads where id = ${id}`;
  if (!row) return new Response("Not found", { status: 404 });
  return new Response(new Uint8Array(row.data), {
    headers: {
      "Content-Type": row.content_type,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
