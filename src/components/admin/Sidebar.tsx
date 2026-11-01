"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const links = [
  { href: "/admin", label: "Overview", icon: "M4 13h6V4H4v9Zm0 7h6v-5H4v5Zm10 0h6v-9h-6v9Zm0-16v5h6V4h-6Z" },
  { href: "/admin/orders", label: "Orders", icon: "M6 7h12l-1 13H7L6 7Zm3 0V5a3 3 0 0 1 6 0v2" },
  { href: "/admin/products", label: "Products", icon: "M4 7l8-4 8 4-8 4-8-4Zm0 0v10l8 4m-8-14 8 4m0 10V11m0 10 8-4V7" },
  { href: "/admin/collections", label: "Collections", icon: "M4 5h7v6H4V5Zm9 0h7v6h-7V5ZM4 13h7v6H4v-6Zm9 0h7v6h-7v-6Z" },
  { href: "/admin/content", label: "Pages & content", icon: "M6 3h9l4 4v14H6V3Zm9 0v4h4M9 12h7M9 16h7" },
  { href: "/admin/subscribers", label: "Subscribers", icon: "M4 6h16v12H4V6Zm0 0 8 7 8-7" },
  { href: "/admin/settings", label: "Settings", icon: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm7.4-3a7.4 7.4 0 0 0-.1-1.3l2-1.6-2-3.4-2.4 1a7 7 0 0 0-2.2-1.3L14.3 3h-4l-.4 2.4a7 7 0 0 0-2.2 1.3l-2.4-1-2 3.4 2 1.6a7.4 7.4 0 0 0 0 2.6l-2 1.6 2 3.4 2.4-1c.7.5 1.4 1 2.2 1.3l.4 2.4h4l.4-2.4c.8-.3 1.5-.8 2.2-1.3l2.4 1 2-3.4-2-1.6c.1-.4.1-.9.1-1.3Z" },
];

export default function Sidebar({
  admin,
  newOrders,
}: {
  admin: { email: string; name: string; image?: string };
  newOrders: number;
}) {
  const pathname = usePathname();
  const isActive = (href: string) => (href === "/admin" ? pathname === href : pathname.startsWith(href));
  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <Link href="/admin" className="wordmark">
          APRON
        </Link>
        <span className="sidebar__tag">Dashboard</span>
      </div>
      <nav className="sidebar__nav">
        {links.map((l) => (
          <Link key={l.href} href={l.href} className={isActive(l.href) ? "is-active" : undefined}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" aria-hidden>
              <path d={l.icon} />
            </svg>
            <span>{l.label}</span>
            {l.href === "/admin/orders" && newOrders > 0 && <span className="sidebar__badge">{newOrders}</span>}
          </Link>
        ))}
      </nav>
      <div className="sidebar__foot">
        <a href="/" target="_blank" rel="noreferrer" className="sidebar__view">
          View store ↗
        </a>
        <div className="sidebar__user">
          {admin.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={admin.image} alt="" width={32} height={32} referrerPolicy="no-referrer" />
          ) : (
            <span className="avatar">{admin.name.slice(0, 1).toUpperCase()}</span>
          )}
          <div>
            <strong>{admin.name}</strong>
            <span>{admin.email}</span>
          </div>
        </div>
        <button className="sidebar__signout" onClick={() => signOut({ callbackUrl: "/admin/login" })}>
          Sign out
        </button>
      </div>
    </aside>
  );
}
