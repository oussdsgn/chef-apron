# Apron

Online store for **Apron** — chef's uniforms, aprons and kitchen utensils.
Built with Next.js (App Router) and TypeScript, ready to deploy on Vercel, with Stripe Checkout for payments.

## Features

- Home page: hero, new arrivals, testimonial, collections, newsletter, trust strip
- Shop page with category filters and sorting; collection pages for Aprons, Uniforms and Utensils
- Product pages with color and size selection, quantity, accordions and related products
- Slide-out cart and full cart page, saved in the browser, with a free-shipping progress bar
- Stripe Checkout. Prices are always recalculated on the server from the catalog
- Search, About, Contact, Size guide, Shipping, Returns and Privacy pages
- SEO: per-page metadata, product structured data, `sitemap.xml`, `robots.txt`
- Responsive down to phone width

## Run locally

```bash
npm install
cp .env.example .env.local   # optional: add your Stripe test key
npm run dev
```

Open http://localhost:3000.

## Deploy on Vercel

1. In Vercel, click **Add New → Project** and import this GitHub repo. The framework is detected as Next.js automatically.
2. Under **Environment Variables**, add:
   - `STRIPE_SECRET_KEY`: your Stripe secret key. Use `sk_test_…` while testing, then `sk_live_…`.
   - `NEXT_PUBLIC_SITE_URL`: your domain, e.g. `https://apron.store`. This is optional; the request origin is used if it isn't set.
3. Click **Deploy**.

If `STRIPE_SECRET_KEY` isn't set, the whole store still works, but the Checkout button shows a "payments not set up yet" message.

## Editing the store

| What | Where |
| --- | --- |
| Store name, email, phone, currency, free-shipping threshold | `src/lib/site.ts` |
| Products, prices, colors, sizes, categories | `src/lib/products.ts` |
| Colors, fonts, spacing | `src/app/globals.css` (`:root` variables) |
| Home page sections | `src/app/page.tsx`, `src/components/Sections.tsx` |
| Shipping, returns, privacy text | `src/app/legal/[slug]/page.tsx` |
| Shipping rate and allowed countries at checkout | `src/app/api/checkout/route.ts` |

### Product photos

Products use built-in illustrations until you add real photos. To use a photo:

1. Put the image in `public/images/products/`, e.g. `public/images/products/classic-bib-apron.jpg`. Square images look best.
2. Add `image: "/images/products/classic-bib-apron.jpg"` to that product in `src/lib/products.ts`.

### Still to connect

- **Newsletter**: `src/app/api/newsletter/route.ts` validates the email and logs it. Connect it to your email provider (Mailchimp, Klaviyo, Resend…).
- **Contact form**: opens the visitor's email app, addressed to `site.email`.
- **Orders**: paid orders appear in your Stripe dashboard. Turn on Stripe's customer email receipts there.
