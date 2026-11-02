/** The Apron logo (public/logo.svg). `light` turns it white for dark backgrounds. */
export default function Logo({ alt = "Apron", light }: { alt?: string; light?: boolean }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src="/logo.svg" alt={alt} className={`logo${light ? " logo--light" : ""}`} width={2455} height={959} />;
}
