import type { ArtKind } from "@/components/ProductArt";

export type CategorySlug = string;

export type Category = {
  slug: CategorySlug;
  name: string;
  title: string;
  blurb: string;
  image?: string;
  sort: number;
};

export type ColorOption = {
  name: string;
  hex: string;
  /** Photo of the product in this color. Falls back to the product image. */
  image?: string;
};

export type Product = {
  id: number;
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
  isNew: boolean;
  /** Visible in the shop. */
  active: boolean;
  inStock: boolean;
  /** Main photo URL. Without one, an illustration is shown. */
  image?: string;
  sort: number;
};

export type OrderStatus = "new" | "confirmed" | "shipped" | "delivered" | "cancelled" | "returned";

export const ORDER_STATUSES: { value: OrderStatus; label: string }[] = [
  { value: "new", label: "New" },
  { value: "confirmed", label: "Confirmed" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
  { value: "returned", label: "Returned" },
];

export type OrderItem = {
  slug: string;
  name: string;
  variant: string;
  quantity: number;
  unitPrice: number;
};

export type Order = {
  id: string;
  createdAt: string;
  status: OrderStatus;
  customer: {
    name: string;
    phone: string;
    wilayaCode: number;
    wilaya: string;
    commune: string;
    address: string;
    note: string;
  };
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  adminNote: string;
};

export type Settings = {
  store: {
    name: string;
    tagline: string;
    description: string;
    email: string;
    phone: string;
    address: string;
    instagram: string;
    facebook: string;
    tiktok: string;
  };
  shipping: {
    freeThreshold: number;
    fee: number;
    southFee: number;
    southWilayas: number[];
  };
  home: {
    heroTitle: string;
    heroEyebrow: string;
    heroCta: string;
    heroImage: string;
    arrivalsTitle: string;
    arrivalsText: string;
    testimonialQuote: string;
    testimonialAuthor: string;
    collectionsTitle: string;
    collectionsText: string;
    newsletterTitle: string;
    newsletterText: string;
    newsletterImage: string;
  };
  about: {
    eyebrow: string;
    title: string;
    body: string;
    image: string;
    values: { title: string; text: string }[];
  };
  pages: {
    shipping: string;
    returns: string;
    privacy: string;
  };
};
