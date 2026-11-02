import type { Metadata, Viewport } from "next";
import { Albert_Sans, IBM_Plex_Sans_Arabic, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { siteUrl } from "@/lib/url";

const sans = Albert_Sans({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const serif = Instrument_Serif({ subsets: ["latin"], weight: "400", variable: "--font-serif", display: "swap" });
// Arabic text: only downloaded when Arabic is shown.
const arabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600"],
  variable: "--font-arabic",
  display: "swap",
  preload: false,
});


export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Apron", template: "%s | Apron" },
};

export const viewport: Viewport = { themeColor: "#ffffff" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable} ${arabic.variable}`}>
      <body>{children}</body>
    </html>
  );
}
