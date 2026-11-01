import { getAdmin } from "@/lib/auth";
import { COL, db, toIso } from "@/lib/db";

export async function GET() {
  if (!(await getAdmin())) return new Response("Unauthorized", { status: 401 });
  const snap = await (await db()).collection(COL.subscribers).orderBy("createdAt", "desc").get();
  const csv = [
    "email,signed_up",
    ...snap.docs.map((d) => `"${String(d.get("email")).replace(/"/g, '""')}",${toIso(d.get("createdAt"))}`),
  ].join("\n");
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="subscribers-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
