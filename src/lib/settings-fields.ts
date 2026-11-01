import type { Settings } from "./types";

export type FieldType = "text" | "textarea" | "longtext" | "number" | "image" | "email" | "url" | "wilayas" | "values";

export type Field = { key: string; label: string; type: FieldType; help?: string };

export type SectionKey = keyof Settings;

export type FormGroup = { section: SectionKey; title: string; description?: string; fields: Field[] };

/** Content page: everything the visitor reads. */
export const contentGroups: FormGroup[] = [
  {
    section: "home",
    title: "Home page",
    description: "The hero banner, section titles, testimonial and newsletter box.",
    fields: [
      { key: "heroTitle", label: "Hero headline", type: "text" },
      { key: "heroCta", label: "Hero button text", type: "text" },
      { key: "heroEyebrow", label: "Text next to the button", type: "text" },
      { key: "heroImage", label: "Hero photo", type: "image", help: "Wide landscape photo, at least 2000 px wide." },
      { key: "arrivalsTitle", label: "New arrivals title", type: "text" },
      { key: "arrivalsText", label: "New arrivals subtitle", type: "text" },
      { key: "testimonialQuote", label: "Testimonial quote", type: "textarea", help: "Leave empty to hide the testimonial." },
      { key: "testimonialAuthor", label: "Testimonial author", type: "text" },
      { key: "collectionsTitle", label: "Collections title", type: "text" },
      { key: "collectionsText", label: "Collections subtitle", type: "text" },
      { key: "newsletterTitle", label: "Newsletter title", type: "text" },
      { key: "newsletterText", label: "Newsletter text", type: "textarea" },
      { key: "newsletterImage", label: "Newsletter photo", type: "image" },
    ],
  },
  {
    section: "about",
    title: "About page",
    fields: [
      { key: "eyebrow", label: "Small label above the title", type: "text" },
      { key: "title", label: "Title", type: "text" },
      { key: "body", label: "Story", type: "longtext", help: "Leave a blank line between paragraphs." },
      { key: "image", label: "Photo", type: "image" },
      {
        key: "values",
        label: "Value cards",
        type: "values",
        help: "One card per line, written as: Title | text",
      },
    ],
  },
  {
    section: "pages",
    title: "Policy pages",
    description:
      "Blank line = new paragraph. Start a line with “## ” for a heading. {freeThreshold}, {fee}, {southFee}, {email} and {phone} are replaced with your current settings.",
    fields: [
      { key: "shipping", label: "Shipping policy", type: "longtext" },
      { key: "returns", label: "Returns & refunds", type: "longtext" },
      { key: "privacy", label: "Privacy policy", type: "longtext" },
    ],
  },
];

/** Settings page: how the store runs. */
export const settingsGroups: FormGroup[] = [
  {
    section: "store",
    title: "Store details",
    description: "Shown in the header, footer, contact page and search results.",
    fields: [
      { key: "name", label: "Store name", type: "text" },
      { key: "tagline", label: "Tagline", type: "text" },
      { key: "description", label: "Description (for Google)", type: "textarea" },
      { key: "email", label: "Contact email", type: "email" },
      { key: "phone", label: "Phone", type: "text" },
      { key: "address", label: "Address", type: "textarea" },
      { key: "instagram", label: "Instagram link", type: "url" },
      { key: "facebook", label: "Facebook link", type: "url" },
      { key: "tiktok", label: "TikTok link", type: "url" },
    ],
  },
  {
    section: "shipping",
    title: "Delivery",
    description: "Delivery fees charged at checkout, in DA.",
    fields: [
      { key: "fee", label: "Home delivery fee (DA)", type: "number" },
      { key: "southFee", label: "Fee for southern wilayas (DA)", type: "number" },
      { key: "freeThreshold", label: "Free delivery from (DA)", type: "number", help: "Set to 0 to always charge delivery." },
      { key: "southWilayas", label: "Southern wilayas", type: "wilayas" },
    ],
  },
];
