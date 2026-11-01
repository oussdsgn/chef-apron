# Apron

Online store for **Apron** (chef's uniforms, aprons and kitchen utensils) with a built-in admin dashboard.
Built with Next.js (App Router) and TypeScript, hosted on Vercel, with a Postgres database.
Prices are in Algerian dinars (DA) and customers pay cash on delivery.

## What's included

**Store**
- Home, shop, collection, product, search, cart, checkout, About, Contact, size guide and policy pages
- Product colors with their own photos, sizes, “was” prices, out-of-stock handling
- Cash-on-delivery checkout: name, phone, wilaya (all 58), commune, address; delivery fee by wilaya
- Prices are always recalculated on the server

**Dashboard** at `/admin`, with Google sign-in
- **Overview**: new orders to confirm, revenue, 14-day chart, best sellers, latest orders
- **Orders**: filter by status, search, customer details with Call / WhatsApp / SMS buttons, status updates
  (New → Confirmed → Shipped → Delivered, or Cancelled / Returned), internal notes, printable delivery slip
- **Products**: add, edit, duplicate, delete; photo upload; colors with their own photos; sizes; price and “was” price;
  quick switches for visible / in stock / new
- **Collections**: rename, reorder, change photos, add or delete collections
- **Pages & content**: every text and photo on the home page, the About page and the policy pages
- **Settings**: store name, contact details, social links, delivery fees, southern wilayas, who can access the dashboard
- **Subscribers**: newsletter sign-ups with CSV download

Changes made in the dashboard go live on the store immediately.

## Set up on Vercel

### 1. Database
In your Vercel project, open **Storage → Create Database → Neon (Postgres)** and connect it to the project.
This adds `DATABASE_URL`. The tables and the starter catalog are created automatically on the first visit.

Optionally, also create a **Blob** store and connect it (adds `BLOB_READ_WRITE_TOKEN`) so product photos load from a CDN.

### 2. Google sign-in
1. Go to <https://console.cloud.google.com/> and create a project, e.g. “Apron”.
2. **APIs & Services → OAuth consent screen**: choose *External*, fill in the app name and your email, and save.
   Then either **Publish app**, or add each admin's Gmail under *Test users*.
3. **APIs & Services → Credentials → Create credentials → OAuth client ID**, type *Web application*.
   Under **Authorized redirect URIs** add:
   - `https://YOUR-DOMAIN/api/auth/callback/google`
   - `http://localhost:3000/api/auth/callback/google` (for local development)
4. Copy the **Client ID** and **Client secret**.

### 3. Environment variables
In **Vercel → Settings → Environment Variables**, add:

| Name | Value |
| --- | --- |
| `GOOGLE_CLIENT_ID` | from step 2 |
| `GOOGLE_CLIENT_SECRET` | from step 2 |
| `NEXTAUTH_SECRET` | a random string: run `openssl rand -base64 32` |
| `NEXTAUTH_URL` | your site address, e.g. `https://apron.dz` |
| `ADMIN_EMAILS` | your Gmail address (several allowed, comma-separated) |

Optional: `TELEGRAM_BOT_TOKEN` + `TELEGRAM_CHAT_ID` (get every order on Telegram), `ORDER_WEBHOOK_URL`.
See `.env.example` for details.

### 4. Deploy
Redeploy, then open `https://YOUR-DOMAIN/admin` and sign in with Google.

## Run locally

```bash
npm install
cp .env.example .env.local   # fill in DATABASE_URL and the Google values
npm run dev
```

Tip: `vercel env pull .env.local` copies the variables from your Vercel project.

## Where things live

| What | Where |
| --- | --- |
| Database tables and first-run setup | `src/lib/db.ts` |
| Starter catalog and default texts (used only for a new, empty database) | `src/lib/seed.ts` |
| Reading products and settings for the store | `src/lib/store.ts` |
| Dashboard pages | `src/app/admin/` |
| Dashboard actions (all check that you're an admin) | `src/app/admin/actions.ts` |
| Which settings appear in the dashboard forms | `src/lib/settings-fields.ts` |
| Store pages | `src/app/(store)/` |
| Orders API (checkout) | `src/app/api/order/route.ts` |
| Colors, fonts, spacing | `src/app/globals.css`, `src/app/admin/admin.css` |

Starter photos are free Unsplash photos (see `PHOTO-CREDITS.md`). Replace them with your own from the dashboard.
