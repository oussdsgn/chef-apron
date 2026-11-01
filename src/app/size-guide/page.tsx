import type { Metadata } from "next";

export const metadata: Metadata = { title: "Size guide" };

const rows = [
  ["XS", "84–89", "71–76", "33–35"],
  ["S", "90–96", "77–82", "36–38"],
  ["M", "97–103", "83–89", "38–40"],
  ["L", "104–111", "90–97", "42–44"],
  ["XL", "112–119", "98–105", "44–46"],
  ["XXL", "120–127", "106–113", "48–50"],
];

export default function SizeGuidePage() {
  return (
    <section className="container section section--tight prose prose--narrow">
      <h1>Size guide</h1>
      <p>
        Our jackets and pants are cut with room to move. If you&apos;re between sizes, size up for layering or size down
        for a closer fit. Measurements are body measurements in centimetres.
      </p>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Size</th>
              <th>Chest (cm)</th>
              <th>Waist (cm)</th>
              <th>EU</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r[0]}>
                {r.map((c, i) => (
                  <td key={i}>{c}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <h2>Aprons</h2>
      <p>
        <strong>Regular</strong> fits most people up to 180 cm and falls just above the knee.{" "}
        <strong>Long</strong> is recommended above 180 cm or if you prefer below-the-knee coverage. All neck straps and
        ties are adjustable.
      </p>
    </section>
  );
}
