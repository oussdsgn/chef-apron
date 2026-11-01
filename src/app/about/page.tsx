import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Features } from "@/components/Sections";

export const metadata: Metadata = { title: "About us" };

export default function AboutPage() {
  return (
    <>
      <section className="container section section--tight">
        <div className="split">
          <div className="prose">
            <span className="eyebrow">Our story</span>
            <h1>Made in the kitchen, for the kitchen.</h1>
            <p>
              Apron started with a simple frustration: workwear that looked good on the hanger and fell apart by the
              second week of service. Neck straps that dug in, pockets in the wrong place, fabric that held every stain.
            </p>
            <p>
              So we started making our own. Every apron, jacket and tool we sell is tested on real lines — by cooks
              working doubles, pastry chefs at 4am and pitmasters next to live fire — before it goes on the shelf.
            </p>
            <p>
              We keep the range small on purpose: the pieces you actually need, done properly, and built to last for
              years rather than seasons.
            </p>
            <Link href="/products" className="btn btn--dark">
              Shop the collection
            </Link>
          </div>
          <div className="split__art">
            <Image
              src="/images/site/about.jpg"
              alt="A restaurant team in white aprons standing together"
              fill
              sizes="(max-width: 900px) 100vw, 50vw"
              className="cover"
            />
          </div>
        </div>
      </section>
      <section className="container section">
        <div className="values">
          {[
            ["Built for shifts", "Cross-back straps, breathable panels and pockets where your hands expect them."],
            ["Honest materials", "Heavy cotton, waxed canvas, full-grain leather and real stainless steel."],
            ["Made to last", "Reinforced stitching and riveted stress points. Repair, don't replace."],
          ].map(([t, d]) => (
            <div key={t} className="value">
              <h3>{t}</h3>
              <p>{d}</p>
            </div>
          ))}
        </div>
      </section>
      <Features />
    </>
  );
}
