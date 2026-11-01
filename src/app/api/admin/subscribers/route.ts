import { getAdmin } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  if (!(await getAdmin())) return new Response("Unauthorized", { status: 401 });
  const sql = await db();
  const rows = await sql<{ email: string; created_at: Date }[]>`select * from subscribers order by created_at desc`;
  const csv = ["email,signed_up", ...rows.map((r) => `"${r.email.replace(/"/g, '""')}",${r.created_at.toISOString()}`)].join("\n");
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="subscribers-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
