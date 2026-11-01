import type { Metadata } from "next";
import Sidebar from "@/components/admin/Sidebar";
import { requireAdminPage } from "@/lib/auth";
import { COL, db } from "@/lib/db";
import "../admin.css";

export const metadata: Metadata = { title: { default: "Dashboard", template: "%s · Dashboard" }, robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdminPage();
  const count = (await (await db()).collection(COL.orders).where("status", "==", "new").count().get()).data().count;
  return (
    <div className="admin">
      <Sidebar admin={admin} newOrders={count} />
      <div className="admin__main">{children}</div>
    </div>
  );
}
