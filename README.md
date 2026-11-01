# Apron

Online store for **Apron** — chef's uniforms, aprons and kitchen utensils.
Built with Next.js (App Router) and TypeScript, ready to deploy on Vercel. Prices are in Algerian dinars (DA) and customers pay cash on delivery.

## Features

- Home page: hero, new arrivals, testimonial, collections, newsletter, trust strip
- Shop page with category filters and sorting; collection pages for Aprons, Uniforms and Utensils
- Product pages with color and size selection, quantity, accordions and related products
- Slide-out cart and full cart page, saved in the browser, with a free-shipping progress bar
- Cash-on-delivery checkout: name, phone, wilaya (all 58), commune and address, with delivery fee by wilaya
- Orders sent to Telegram and/or a webhook (e.g. Google Sheets). Prices are always recalculated on the server
- Search, About, Contact, Size guide, Shipping, Returns and Privacy pages
- SEO: per-page metadata, product structured data, `sitemap.xml`, `robots.txt`
- Responsive down to phone width

## Run locally

```bash
npm install
cp .env.example .env.local   # optional: add your Telegram bot / webhook
npm run dev
```

Open http://localhost:3000.

## Deploy on Vercel

1. In Vercel, click **Add New → Project** and import this GitHub repo. The framework is detected as Next.js automatically.
2. Under **Environment Variables**, add:
   - `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID`: every new order arrives as a Telegram message (setup steps in `.env.example`), and/or
   - `ORDER_WEBHOOK_URL`: the full order is POSTed as JSON, e.g. to a Google Apps Script that adds a row to a Google Sheet.
   - `NEXT_PUBLIC_SITE_URL` (optional): your domain, e.g. `https://apron.dz`.
3. Click **Deploy**.

If none of the order variables is set, the live site refuses orders with a "call us" message so no order is lost. In local development orders are accepted and printed in the terminal.

## Editing the store

| What | Where |
| --- | --- |
| Store name, email, phone, delivery fees, free-delivery threshold | `src/lib/site.ts` |
| Wilaya list and phone-number check | `src/lib/wilayas.ts` |
| Products, prices, colors, sizes, categories | `src/lib/products.ts` |
| Colors, fonts, spacing | `src/app/globals.css` (`:root` variables) |
| Home page sections | `src/app/page.tsx`, `src/components/Sections.tsx` |
| Shipping, returns, privacy text | `src/app/legal/[slug]/page.tsx` |
| Order handling (Telegram / webhook message) | `src/app/api/order/route.ts` |

### Product photos

Products use built-in illustrations until you add real photos. To use a photo:

1. Put the image in `public/images/products/`, e.g. `public/images/products/classic-bib-apron.jpg`. Square images look best.
2. Add `image: "/images/products/classic-bib-apron.jpg"` to that product in `src/lib/products.ts`.

### Still to connect

- **Newsletter**: `src/app/api/newsletter/route.ts` validates the email and logs it. Connect it to your email provider (Mailchimp, Klaviyo, Resend…).
- **Contact form**: opens the visitor's email app, addressed to `site.email`.
- **Orders**: set up Telegram and/or the webhook before going live (see above).
