import Link from "next/link";
import { getT } from "@/lib/i18n/server";

export default async function StoreNotFound() {
  const { t } = await getT();
  return (
    <section className="container section">
      <div className="empty">
        <h1>{t("notFound.title")}</h1>
        <p>{t("notFound.text")}</p>
        <Link href="/" className="btn btn--dark">
          {t("notFound.back")}
        </Link>
      </div>
    </section>
  );
}
