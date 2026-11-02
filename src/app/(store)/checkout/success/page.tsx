import Link from "next/link";
import { getT } from "@/lib/i18n/server";

export default async function SuccessPage({ searchParams }: { searchParams: Promise<{ order?: string }> }) {
  const order = (await searchParams).order?.slice(0, 40);
  const { t } = await getT();
  return (
    <section className="container section">
      <div className="empty">
        <h1>{t("success.title")}</h1>
        {order && (
          <p>
            {t("success.number")} <strong dir="ltr">{order}</strong>
          </p>
        )}
        <p>{t("success.text")}</p>
        <Link href="/products" className="btn btn--dark">
          {t("success.continue")}
        </Link>
      </div>
    </section>
  );
}
