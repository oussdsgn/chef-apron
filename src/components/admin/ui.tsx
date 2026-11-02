import Link from "next/link";
import { ORDER_STATUSES, type OrderStatus } from "@/lib/types";

export function StatusPill({ status }: { status: OrderStatus }) {
  const label = ORDER_STATUSES.find((s) => s.value === status)?.label ?? status;
  return <span className={`pill pill--${status}`}>{label}</span>;
}

export function PageHead({
  title,
  subtitle,
  actions,
  back,
}: {
  title: string;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
  back?: { href: string; label: string };
}) {
  return (
    <header className="page-header">
      <div>
        {back && (
          <Link href={back.href} className="page-header__back">
            ← {back.label}
          </Link>
        )}
        <h1>{title}</h1>
        {subtitle && <p className="muted">{subtitle}</p>}
      </div>
      {actions && <div className="page-header__actions">{actions}</div>}
    </header>
  );
}

const dateFmt = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Africa/Algiers",
});

export function formatDate(iso: string) {
  return dateFmt.format(new Date(iso));
}
