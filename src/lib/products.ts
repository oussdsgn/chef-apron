import type { ArtKind } from "@/components/ProductArt";

export type CategorySlug = "aprons" | "uniforms" | "utensils";

export type Category = {
  slug: CategorySlug;
  name: string;
  title: string;
  blurb: string;
};

export type ColorOption = {
  name: string;
  hex: string;
  /** Photo of the product in this color. Falls back to the product image. */
  image?: string;
};

export type Product = {
  slug: string;
  name: string;
  category: CategorySlug;
  price: number;
  compareAtPrice?: number;
  short: string;
  description: string;
  details: string[];
  colors: ColorOption[];
  sizes?: string[];
  art: ArtKind;
  isNew?: boolean;
  /** Main photo in /public, e.g. "/images/products/classic-bib-black.jpg". Without one, an illustration is shown. */
  image?: string;
};

export const categories: Category[] = [
  {
    slug: "aprons",
    name: "Aprons",
    title: "Apron collection",
    blurb: "Bib, cross-back, waist and leather aprons that take the heat and the stains.",
  },
  {
    slug: "uniforms",
    name: "Chef uniforms",
    title: "Chef uniforms",
    blurb: "Breathable jackets, check pants and toques cut for movement on the line.",
  },
  {
    slug: "utensils",
    name: "Utensils",
    title: "Kitchen utensils",
    blurb: "Knives, whisks, tongs and tool rolls chosen by working chefs.",
  },
];

const apronSizes = ["Regular", "Long"];
const jacketSizes = ["XS", "S", "M", "L", "XL", "XXL"];

export const products: Product[] = [
  // ---------- Aprons ----------
  {
    slug: "classic-bib-apron",
    name: "Classic Bib Apron",
    category: "aprons",
    price: 4500,
    short: "Heavy cotton twill with a deep chest pocket and hand pockets.",
    description:
      "Our everyday workhorse. Cut from a heavy cotton twill that softens with every wash, with wide shoulder straps, a deep chest pocket for pens and thermometers, and two hand pockets at the hips.",
    details: [
      "280 gsm cotton twill",
      "Wide adjustable shoulder straps",
      "Chest pocket + two hand pockets",
      "Machine washable at 40°C",
    ],
    colors: [
      { name: "Black", hex: "#1f1f1f", image: "/images/products/classic-bib-black.jpg" },
      { name: "Sand", hex: "#cdbfa8", image: "/images/products/classic-bib-beige.jpg" },
      { name: "Lavender Grey", hex: "#b9b8c6", image: "/images/products/classic-bib-grey.jpg" },
    ],
    sizes: apronSizes,
    art: "apron-bib",
    image: "/images/products/classic-bib-black.jpg",
    isNew: true,
  },
  {
    slug: "cross-back-canvas-apron",
    name: "Cross-Back Canvas Apron",
    category: "aprons",
    price: 6500,
    short: "Straps cross at the back, so there's no strain on your neck.",
    description:
      "The straps cross over the back to spread the weight across your shoulders instead of your neck, which matters on twelve-hour shifts. Sturdy cotton canvas in rich, stain-forgiving colors.",
    details: [
      "Heavy cotton canvas",
      "Cross-back straps, no neck strap",
      "Chest pocket + kangaroo hand pocket",
      "Machine washable",
    ],
    colors: [
      { name: "Forest", hex: "#1f3a33", image: "/images/products/cross-back-forest.jpg" },
      { name: "Chocolate", hex: "#5a3a26", image: "/images/products/cross-back-chocolate.jpg" },
      { name: "Mustard", hex: "#d39a2c", image: "/images/products/cross-back-mustard.jpg" },
    ],
    sizes: apronSizes,
    art: "apron-cross",
    image: "/images/products/cross-back-forest.jpg",
    isNew: true,
  },
  {
    slug: "barista-apron",
    name: "Barista Apron",
    category: "aprons",
    price: 2500,
    short: "Light, wrap-around ties, made for cafés and front of house.",
    description:
      "A lightweight apron for baristas and service staff, with long ties that wrap around and knot at the front, and a split pocket for pens and order pads.",
    details: ["Poly-cotton blend, stain-release finish", "Long wrap-around ties", "Split front pocket"],
    colors: [{ name: "Slate", hex: "#3d4246" }],
    art: "apron-waist",
    image: "/images/products/barista-apron.jpg",
  },
  {
    slug: "leather-pitmaster-apron",
    name: "Leather Pitmaster Apron",
    category: "aprons",
    price: 12000,
    compareAtPrice: 14000,
    short: "Full-grain leather for grills, smokers and open fire.",
    description:
      "Built for live fire. Full-grain leather that shrugs off sparks and grease, with a reinforced bib and riveted stress points. It will outlast your grill.",
    details: ["Full-grain cowhide leather", "Riveted stress points", "Adjustable neck strap", "Wipe clean with a damp cloth"],
    colors: [{ name: "Espresso", hex: "#3a2a20" }],
    art: "apron-bib",
    image: "/images/products/leather-apron.jpg",
  },

  // ---------- Uniforms ----------
  {
    slug: "signature-chef-jacket",
    name: "Signature Chef Jacket",
    category: "uniforms",
    price: 6900,
    short: "Double-breasted, breathable, with a reversible front.",
    description:
      "The classic double-breasted jacket in a lightweight cotton blend that breathes on a hot line. The reversible front lets you hide a spill mid-service.",
    details: [
      "65% cotton / 35% polyester, 190 gsm",
      "Double-breasted, reversible front",
      "Thermometer pocket on sleeve",
      "Washable at 60°C",
    ],
    colors: [
      { name: "White", hex: "#f4f2ee", image: "/images/products/chef-jacket-white.jpg" },
      { name: "Black", hex: "#1c1f24", image: "/images/products/chef-jacket-black.jpg" },
    ],
    sizes: jacketSizes,
    art: "jacket",
    image: "/images/products/chef-jacket-white.jpg",
    isNew: true,
  },
  {
    slug: "piped-chef-jacket",
    name: "Contrast Piping Chef Jacket",
    category: "uniforms",
    price: 7500,
    short: "White jacket with black piping for the open kitchen.",
    description:
      "Made for kitchens in view of the guests. A tailored double-breasted jacket with black contrast piping on the collar, placket and cuffs.",
    details: ["Cotton-rich blend", "Black contrast piping", "Tailored fit", "Washable at 60°C"],
    colors: [{ name: "White / Black", hex: "#f4f2ee" }],
    sizes: jacketSizes,
    art: "jacket",
    image: "/images/products/piped-chef-jacket.jpg",
    isNew: true,
  },
  {
    slug: "cargo-chef-pants",
    name: "Cargo Chef Pants",
    category: "uniforms",
    price: 4200,
    short: "Relaxed fit, elastic waist and deep cargo pockets.",
    description:
      "Comfortable chef pants with an elastic drawstring waist, deep cargo pockets for towels and tools, and a tapered leg that stays clear of the floor.",
    details: ["Cotton-poly twill", "Elastic waist + drawstring", "Two cargo pockets, two side pockets"],
    colors: [{ name: "Black", hex: "#1f1f1f" }],
    sizes: jacketSizes,
    art: "pants",
    image: "/images/products/cargo-chef-pants.jpg",
  },
  {
    slug: "pleated-toque",
    name: "Pleated Toque",
    category: "uniforms",
    price: 1800,
    short: "The traditional tall chef's hat, adjustable.",
    description:
      "A tall, pleated toque in breathable cotton with an adjustable band. Holds its shape service after service.",
    details: ["Breathable cotton", "Adjustable band", "Holds shape after washing"],
    colors: [{ name: "White", hex: "#f6f4ef" }],
    sizes: ["One size"],
    art: "hat",
    image: "/images/products/toque.jpg",
  },

  // ---------- Utensils ----------
  {
    slug: "gyuto-chef-knife",
    name: '8" Chef Knife',
    category: "utensils",
    price: 14500,
    short: "Stainless steel blade with a full-tang black handle.",
    description:
      "An all-purpose chef knife with a thin, hard stainless blade sharpened to 15° per side, balanced at the bolster, with a riveted full-tang handle.",
    details: ["High-carbon stainless steel", '8" (210 mm) blade', "Full-tang riveted handle", "Hand wash only"],
    colors: [{ name: "Black", hex: "#1e1a18" }],
    art: "knife",
    image: "/images/products/gyuto-knife.jpg",
    isNew: true,
  },
  {
    slug: "chef-knife-set",
    name: "Chef Knife Set (4 pcs)",
    category: "utensils",
    price: 22000,
    compareAtPrice: 26000,
    short: "Chef knife, santoku, cleaver and boning knife.",
    description:
      "The four knives a kitchen needs: a chef knife, a santoku, a cleaver and a flexible boning knife, all with matching wooden handles.",
    details: ["Stainless steel blades", "Wooden handles with three rivets", "Chef, santoku, cleaver, boning", "Hand wash only"],
    colors: [{ name: "Wood", hex: "#4a2c22" }],
    art: "knife",
    image: "/images/products/knife-set.jpg",
  },
  {
    slug: "knife-roll-set",
    name: "Knife Roll Set",
    category: "utensils",
    price: 18500,
    short: "Three knives, carving fork and honing steel in a leather roll.",
    description:
      "A complete kit to carry to work: three knives, a carving fork and a honing steel, all with olive-wood handles, rolled up in a leather case.",
    details: ["3 knives + carving fork + honing steel", "Olive-wood handles", "Leather roll with straps"],
    colors: [{ name: "Olive wood", hex: "#b07a4f" }],
    art: "knife-roll",
    image: "/images/products/knife-roll.jpg",
    isNew: true,
  },
  {
    slug: "balloon-whisk",
    name: "Balloon Whisk",
    category: "utensils",
    price: 1600,
    short: "Flexible stainless wires for airy batters.",
    description: "A 30 cm balloon whisk with flexible stainless wires and a sealed handle that never traps water.",
    details: ["18/8 stainless steel", "Sealed handle", "30 cm length"],
    colors: [{ name: "Steel", hex: "#a9adb2" }],
    art: "whisk",
    image: "/images/products/whisk.jpg",
  },
  {
    slug: "precision-tongs",
    name: "Grill Tongs",
    category: "utensils",
    price: 1500,
    short: "Locking stainless tongs for the grill and the pass.",
    description: "Spring-loaded tongs with scalloped tips for a firm grip when searing and turning, and a lock that keeps them closed in the drawer.",
    details: ["Stainless steel", "Locking hinge", "Available 23 cm and 30 cm"],
    colors: [{ name: "Steel", hex: "#a9adb2" }],
    sizes: ["23 cm", "30 cm"],
    art: "tongs",
    image: "/images/products/tongs.jpg",
  },
  {
    slug: "olive-wood-spatula",
    name: "Olive Wood Spatula",
    category: "utensils",
    price: 1200,
    short: "Hand-carved, won't scratch your pans.",
    description: "A sturdy hand-carved olive-wood spatula with a slanted edge for stirring, scraping and turning. Gentle on non-stick and enamel pans.",
    details: ["Solid olive wood", "Slanted edge", "Hand wash, oil occasionally"],
    colors: [{ name: "Olive wood", hex: "#b07a4f" }],
    art: "spatula",
    image: "/images/products/wooden-spatula.jpg",
  },
  {
    slug: "serving-ladle",
    name: "Professional Ladle",
    category: "utensils",
    price: 1300,
    short: "One-piece stainless ladle with a hanging hook.",
    description: "The ladle you see on every professional line: a one-piece stainless ladle with a measured bowl and a hook to hang it above the station.",
    details: ["One-piece stainless steel", "60 ml bowl", "Hanging hook"],
    colors: [{ name: "Steel", hex: "#a9adb2" }],
    art: "ladle",
    image: "/images/products/ladle.jpg",
  },
];

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function getCategory(slug: string) {
  return categories.find((c) => c.slug === slug);
}

export function productsIn(category: CategorySlug) {
  return products.filter((p) => p.category === category);
}

export function newArrivals(limit = 6) {
  return products.filter((p) => p.isNew).slice(0, limit);
}

export function searchProducts(query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return products.filter((p) =>
    [p.name, p.short, p.description, p.category].some((s) => s.toLowerCase().includes(q)),
  );
}
