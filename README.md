# Apron

Online store for **Apron** (chef's uniforms, aprons and kitchen utensils) with a built-in admin dashboard.
Built with Next.js (App Router) and TypeScript, hosted on Vercel, with Firebase (Firestore + Google sign-in).
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

## Set up

### 1. Create the Firebase project
1. Go to <https://console.firebase.google.com/> → **Add project** (e.g. “Apron”). Google Analytics is optional.
2. **Build → Firestore Database → Create database**. Pick the location `europe-west` (closest to Algeria)
   and **Start in production mode**. Then open the **Rules** tab, paste the contents of `firestore.rules` and publish.
3. **Build → Authentication → Get started → Sign-in method → Google → Enable**, choose a support email, and save.
4. **Authentication → Settings → Authorised domains → Add domain**: add your Vercel domain
   (e.g. `apron.vercel.app`) and your own domain if you have one.
5. **Project settings (⚙) → General → Your apps → Web (`</>`)**: register an app (e.g. “Apron web”).
   Keep the `firebaseConfig` values that appear; you need `apiKey`, `authDomain`, `projectId` and `appId`.
6. **Project settings → Service accounts → Generate new private key**. A JSON file downloads.
   Keep it secret: it gives full access to your database.

The tables (“collections”) and the starter catalog are created automatically on the first visit.

### 2. Environment variables on Vercel
In **Vercel → your project → Settings → Environment Variables**, add:

| Name | Value |
| --- | --- |
| `FIREBASE_SERVICE_ACCOUNT` | the whole content of the JSON file from step 6 |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | `apiKey` from step 5 |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | `authDomain` from step 5 |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | `projectId` from step 5 |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | `appId` from step 5 |
| `ADMIN_EMAILS` | your Gmail address (several allowed, comma-separated) |

Optional:
- `FIREBASE_STORAGE_BUCKET`: store photos in Firebase Storage instead of Firestore.
  Storage needs the pay-as-you-go **Blaze** plan; its free allowance covers a small shop.
  Enable it under **Build → Storage**, paste `storage.rules` into its Rules tab, and use the bucket name shown there
  (e.g. `apron-12345.firebasestorage.app`).
- `TELEGRAM_BOT_TOKEN` + `TELEGRAM_CHAT_ID`: get every order on Telegram. See `.env.example`.
- `ORDER_WEBHOOK_URL`: also send each order to a webhook.

### 3. Deploy
Redeploy, then open `https://YOUR-DOMAIN/admin` and sign in with Google.

## Run locally

```bash
npm install
cp .env.example .env.local   # fill in the Firebase values
npm run dev
```

Tip: `vercel env pull .env.local` copies the variables from your Vercel project.
For offline development you can also use the Firebase emulators: set `FIRESTORE_EMULATOR_HOST`,
`FIREBASE_AUTH_EMULATOR_HOST`, `FIREBASE_PROJECT_ID=demo-apron` and
`NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR=http://127.0.0.1:9099`.

## Where things live

| What | Where |
| --- | --- |
| Firebase connection | `src/lib/firebase-admin.ts`, `src/lib/firebase-client.ts` |
| Collections and first-run setup | `src/lib/db.ts` |
| Sign-in and admin checks | `src/lib/auth.ts`, `src/app/api/admin/session/route.ts` |
| Starter catalog and default texts (used only for a new, empty database) | `src/lib/seed.ts` |
| Firebase security rules | `firestore.rules`, `storage.rules` |
| Reading products and settings for the store | `src/lib/store.ts` |
| Dashboard pages | `src/app/admin/` |
| Dashboard actions (all check that you're an admin) | `src/app/admin/actions.ts` |
| Which settings appear in the dashboard forms | `src/lib/settings-fields.ts` |
| Store pages | `src/app/(store)/` |
| Orders API (checkout) | `src/app/api/order/route.ts` |
| Colors, fonts, spacing | `src/app/globals.css`, `src/app/admin/admin.css` |

Starter photos are free Unsplash photos (see `PHOTO-CREDITS.md`). Replace them with your own from the dashboard.
