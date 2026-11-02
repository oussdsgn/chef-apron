import type { Metadata } from "next";
import { getT } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT();
  return { title: t("size.title") };
}

const rows = [
  ["XS", "84–89", "71–76", "33–35"],
  ["S", "90–96", "77–82", "36–38"],
  ["M", "97–103", "83–89", "38–40"],
  ["L", "104–111", "90–97", "42–44"],
  ["XL", "112–119", "98–105", "44–46"],
  ["XXL", "120–127", "106–113", "48–50"],
];

export default async function SizeGuidePage() {
  const { t } = await getT();
  return (
    <section className="container section section--tight prose prose--narrow">
      <h1>{t("size.title")}</h1>
      <p>{t("size.intro")}</p>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>{t("size.size")}</th>
              <th>{t("size.chest")}</th>
              <th>{t("size.waist")}</th>
              <th>{t("size.eu")}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r[0]}>
                {r.map((c, i) => (
                  <td key={i} dir="ltr">
                    {c}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <h2>{t("size.aprons")}</h2>
      <p>
        <strong>{t("size.regular")}</strong> {t("size.regularText")} <strong>{t("size.long")}</strong>{" "}
        {t("size.longText")}
      </p>
    </section>
  );
}
