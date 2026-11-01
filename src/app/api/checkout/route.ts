import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getProduct } from "@/lib/products";
import { site } from "@/lib/site";

type IncomingLine = { slug?: unknown; color?: unknown; size?: unknown; quantity?: unknown };

function baseUrl(req: Request) {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  return new URL(req.url).origin;
}

export async function POST(req: Request) {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    return NextResponse.json(
      { error: "Online payments aren't set up yet. Please contact us to complete your order." },
      { status: 503 },
    );
  }

  let body: { lines?: IncomingLine[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Never trust prices from the browser: rebuild every line from the catalog.
  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
  for (const raw of body.lines ?? []) {
    const product = typeof raw.slug === "string" ? getProduct(raw.slug) : undefined;
    const quantity = Number(raw.quantity);
    if (!product || !Number.isInteger(quantity) || quantity < 1 || quantity > 99) continue;
    const color = product.colors.find((c) => c.name === raw.color)?.name ?? product.colors[0].name;
    const size = typeof raw.size === "string" && product.sizes?.includes(raw.size) ? raw.size : undefined;
    if (product.sizes && !size) continue;

    lineItems.push({
      quantity,
      price_data: {
        currency: site.currency.toLowerCase(),
        unit_amount: Math.round(product.price * 100),
        product_data: {
          name: product.name,
          description: [color, size].filter(Boolean).join(" · "),
          metadata: { slug: product.slug, color, size: size ?? "" },
        },
      },
    });
  }

  if (lineItems.length === 0) {
    return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });
  }

  const subtotal = lineItems.reduce((s, l) => s + (l.price_data!.unit_amount ?? 0) * (l.quantity ?? 1), 0);
  const freeShipping = subtotal >= site.freeShippingThreshold * 100;
  const url = baseUrl(req);

  try {
    const stripe = new Stripe(key);
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      shipping_address_collection: { allowed_countries: ["US", "CA", "GB", "FR", "DE", "ES", "IT", "NL", "BE", "MA"] },
      shipping_options: [
        {
          shipping_rate_data: {
            display_name: freeShipping ? "Free shipping" : "Standard shipping",
            type: "fixed_amount",
            fixed_amount: { amount: freeShipping ? 0 : 900, currency: site.currency.toLowerCase() },
            delivery_estimate: {
              minimum: { unit: "business_day", value: 2 },
              maximum: { unit: "business_day", value: 7 },
            },
          },
        },
      ],
      allow_promotion_codes: true,
      success_url: `${url}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${url}/cart`,
    });
    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout error", err);
    return NextResponse.json({ error: "We couldn't start the checkout. Please try again." }, { status: 500 });
  }
}
