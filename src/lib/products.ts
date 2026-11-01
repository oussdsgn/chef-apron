import type { ArtKind } from "@/components/ProductArt";

export type CategorySlug = "aprons" | "uniforms" | "utensils";

export type Category = {
  slug: CategorySlug;
  name: string;
  title: string;
  blurb: string;
};

export type ColorOption = { name: string; hex: string };

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
  /** Optional photo in /public, e.g. "/images/products/classic-bib-apron.jpg". Replaces the illustration. */
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
    short: "Heavyweight cotton denim with an adjustable neck strap.",
    description:
      "Our everyday workhorse. Cut from 12 oz cotton denim that softens with every wash, with a brass-buckled neck strap, extra-long waist ties and a split chest pocket for pens and thermometers.",
    details: [
      "12 oz 100% cotton denim",
      "Adjustable neck strap with brass hardware",
      "Split chest pocket + two hip pockets",
      "Machine washable, gets better with age",
    ],
    colors: [
      { name: "Indigo", hex: "#3d4b63" },
      { name: "Charcoal", hex: "#3a3a3a" },
      { name: "Natural", hex: "#d9cdb8" },
    ],
    sizes: apronSizes,
    art: "apron-bib",
    isNew: true,
  },
  {
    slug: "cross-back-canvas-apron",
    name: "Cross-Back Canvas Apron",
    category: "aprons",
    price: 6500,
    short: "Waxed canvas, leather straps, zero neck strain.",
    description:
      "Straps cross over the back to spread the weight across your shoulders instead of your neck — made for twelve-hour shifts. Water-resistant waxed canvas and vegetable-tanned leather straps.",
    details: [
      "10 oz waxed cotton canvas",
      "Vegetable-tanned leather cross-back straps",
      "Towel loop and tool pocket",
      "Wipe clean; re-wax yearly",
    ],
    colors: [
      { name: "Olive", hex: "#5d6248" },
      { name: "Tobacco", hex: "#7a5236" },
      { name: "Black", hex: "#262626" },
    ],
    sizes: apronSizes,
    art: "apron-cross",
    isNew: true,
  },
  {
    slug: "bistro-waist-apron",
    name: "Bistro Waist Apron",
    category: "aprons",
    price: 2500,
    short: "The front-of-house classic with three pockets.",
    description:
      "A crisp, knee-length bistro apron for service and prep. Three-section front pocket for order pads, pens and a wine key.",
    details: ["Poly-cotton twill, stain-release finish", "Three-section front pocket", "Long wrap-around ties"],
    colors: [
      { name: "Black", hex: "#1f1f1f" },
      { name: "Bordeaux", hex: "#5a1f2a" },
      { name: "White", hex: "#f2f0ea" },
    ],
    art: "apron-waist",
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
    details: ["Full-grain cowhide leather", "Copper rivets at stress points", "Adjustable neck strap", "Wipe clean with a damp cloth"],
    colors: [
      { name: "Saddle", hex: "#9a6438" },
      { name: "Espresso", hex: "#4a3022" },
    ],
    art: "apron-bib",
  },

  // ---------- Uniforms ----------
  {
    slug: "signature-chef-jacket",
    name: "Signature Chef Jacket",
    category: "uniforms",
    price: 6900,
    short: "Double-breasted, breathable, reversible front.",
    description:
      "The classic double-breasted jacket, reworked with a lightweight cotton blend and mesh back panel to keep you cool on the line. Reversible front hides spills mid-service.",
    details: [
      "65% cotton / 35% polyester, 190 gsm",
      "Breathable mesh back yoke",
      "Knot buttons, reversible front",
      "Thermometer pocket on sleeve",
    ],
    colors: [
      { name: "White", hex: "#f4f2ee" },
      { name: "Black", hex: "#222222" },
      { name: "Slate", hex: "#56606b" },
    ],
    sizes: jacketSizes,
    art: "jacket",
    isNew: true,
  },
  {
    slug: "short-sleeve-line-jacket",
    name: "Short-Sleeve Line Jacket",
    category: "uniforms",
    price: 5500,
    short: "Snap front for hot kitchens and fast changes.",
    description:
      "A modern, single-breasted short-sleeve jacket with concealed snaps. Stretch fabric moves with you between stations.",
    details: ["Stretch cotton blend", "Concealed snap front", "Side vents for airflow"],
    colors: [
      { name: "Sage", hex: "#8c9a83" },
      { name: "White", hex: "#f4f2ee" },
      { name: "Navy", hex: "#2b3447" },
    ],
    sizes: jacketSizes,
    art: "jacket-short",
    isNew: true,
  },
  {
    slug: "classic-check-chef-pants",
    name: "Classic Check Chef Pants",
    category: "uniforms",
    price: 4200,
    short: "Houndstooth baggies with an elastic waist.",
    description:
      "Relaxed-fit chef pants in the traditional small check, with an elastic drawstring waist, deep pockets and a tapered ankle that stays clear of the floor.",
    details: ["100% cotton twill", "Elastic waist + drawstring", "Two side pockets, one back pocket"],
    colors: [
      { name: "Black/White", hex: "#2a2a2a" },
      { name: "Navy/White", hex: "#28324a" },
    ],
    sizes: jacketSizes,
    art: "pants",
  },
  {
    slug: "pleated-toque",
    name: "Pleated Toque",
    category: "uniforms",
    price: 1800,
    short: "The traditional tall chef's hat, adjustable.",
    description:
      "A tall, pleated toque in breathable cotton with a velcro-adjustable band. Holds its shape service after service.",
    details: ["Breathable cotton", "Adjustable band", "Holds shape after washing"],
    colors: [{ name: "White", hex: "#f6f4ef" }],
    sizes: ["One size"],
    art: "hat",
  },

  // ---------- Utensils ----------
  {
    slug: "gyuto-chef-knife",
    name: '8" Gyuto Chef Knife',
    category: "utensils",
    price: 14500,
    short: "Hand-sharpened stainless steel, walnut handle.",
    description:
      "A Japanese-style chef knife with a thin, hard stainless blade sharpened to 15° per side, balanced at the bolster and finished with an oiled walnut handle.",
    details: ["VG-10 stainless core, 60 HRC", '8" (210 mm) blade', "Oiled walnut handle", "Hand wash only"],
    colors: [
      { name: "Walnut", hex: "#5b3b28" },
      { name: "Ebony", hex: "#1e1a18" },
    ],
    art: "knife",
    isNew: true,
  },
  {
    slug: "waxed-canvas-knife-roll",
    name: "Waxed Canvas Knife Roll",
    category: "utensils",
    price: 8500,
    short: "Carries eight knives and your tweezers.",
    description:
      "Roll up your kit and go. Eight knife slots, a zip pocket for small tools and a leather carry strap. Made from the same waxed canvas as our aprons.",
    details: ["Waxed cotton canvas + leather", "8 knife slots + zip pocket", "Shoulder strap included"],
    colors: [
      { name: "Olive", hex: "#5d6248" },
      { name: "Tobacco", hex: "#7a5236" },
    ],
    art: "knife-roll",
    isNew: true,
  },
  {
    slug: "balloon-whisk",
    name: "Balloon Whisk",
    category: "utensils",
    price: 1600,
    short: "Twelve flexible wires for airy batters.",
    description: "A 12-inch balloon whisk with twelve flexible stainless wires and a sealed handle that never traps water.",
    details: ["18/8 stainless steel", "Sealed handle", '12" length'],
    colors: [{ name: "Steel", hex: "#a9adb2" }],
    art: "whisk",
  },
  {
    slug: "precision-tongs",
    name: "Precision Tongs",
    category: "utensils",
    price: 1500,
    short: "Scalloped tips, locking hinge, two lengths.",
    description: "Spring-loaded tongs with fine scalloped tips for plating and a firm grip for searing.",
    details: ["Stainless steel", "Locking hinge", "Available 9\" and 12\""],
    colors: [{ name: "Steel", hex: "#a9adb2" }],
    sizes: ['9"', '12"'],
    art: "tongs",
  },
  {
    slug: "fish-spatula",
    name: "Fish Spatula",
    category: "utensils",
    price: 1900,
    short: "Thin, flexible, slotted — for everything delicate.",
    description: "The spatula chefs reach for first. A thin, angled, flexible head slides under fish fillets, eggs and pancakes without tearing.",
    details: ["Flexible stainless head", "Walnut handle", "Left- and right-hand friendly"],
    colors: [{ name: "Walnut", hex: "#5b3b28" }],
    art: "spatula",
  },
  {
    slug: "serving-ladle",
    name: "Serving Ladle",
    category: "utensils",
    price: 1200,
    short: "Sauce-ready 2 oz bowl with a pour lip.",
    description: "A one-piece stainless ladle with a measured 2 oz bowl and pour lip for clean saucing.",
    details: ["One-piece stainless steel", "2 oz / 60 ml bowl", "Hanging hook"],
    colors: [{ name: "Steel", hex: "#a9adb2" }],
    art: "ladle",
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
