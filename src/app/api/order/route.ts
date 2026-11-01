import { NextResponse } from "next/server";
import { getProduct } from "@/lib/products";
import { formatPrice, shippingFor } from "@/lib/site";
import { getWilaya, normalizePhone } from "@/lib/wilayas";

type IncomingLine = { slug?: unknown; color?: unknown; size?: unknown; quantity?: unknown };
type IncomingOrder = {
  lines?: IncomingLine[];
  customer?: { name?: unknown; phone?: unknown; wilaya?: unknown; commune?: unknown; address?: unknown; note?: unknown };
};

const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function POST(req: Request) {
  let body: IncomingOrder;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // ---- Customer details ----
  const c = body.customer ?? {};
  const name = str(c.name, 80);
  const phone = normalizePhone(str(c.phone, 20));
  const wilaya = getWilaya(Number(c.wilaya));
  const commune = str(c.commune, 80);
  const address = str(c.address, 200);
  const note = str(c.note, 500);

  const fieldErrors: Record<string, string> = {};
  if (name.length < 2) fieldErrors.name = "Please enter your full name.";
  if (!phone) fieldErrors.phone = "Please enter a valid Algerian phone number (e.g. 0555 12 34 56).";
  if (!wilaya) fieldErrors.wilaya = "Please choose your wilaya.";
  if (commune.length < 2) fieldErrors.commune = "Please enter your commune.";
  if (address.length < 5) fieldErrors.address = "Please enter your delivery address.";
  if (Object.keys(fieldErrors).length) {
    return NextResponse.json({ error: "Please check the highlighted fields.", fieldErrors }, { status: 400 });
  }

  // ---- Items: never trust prices from the browser ----
  const items: { name: string; variant: string; quantity: number; unitPrice: number }[] = [];
  for (const raw of body.lines ?? []) {
    const product = typeof raw.slug === "string" ? getProduct(raw.slug) : undefined;
    const quantity = Number(raw.quantity);
    if (!product || !Number.isInteger(quantity) || quantity < 1 || quantity > 99) continue;
    const color = product.colors.find((col) => col.name === raw.color)?.name ?? product.colors[0].name;
    const size = typeof raw.size === "string" && product.sizes?.includes(raw.size) ? raw.size : undefined;
    if (product.sizes && !size) continue;
    items.push({ name: product.name, variant: [color, size].filter(Boolean).join(" · "), quantity, unitPrice: product.price });
  }
  if (items.length === 0) {
    return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });
  }

  const subtotal = items.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
  const shipping = shippingFor(subtotal, wilaya!.code);
  const total = subtotal + shipping;
  const orderId = `AP-${Date.now().toString(36).toUpperCase()}${Math.floor(Math.random() * 36 ** 2).toString(36).toUpperCase().padStart(2, "0")}`;

  const order = {
    orderId,
    createdAt: new Date().toISOString(),
    payment: "Cash on delivery",
    customer: { name, phone, wilaya: `${wilaya!.code} - ${wilaya!.name}`, commune, address, note },
    items,
    subtotal,
    shipping,
    total,
  };

  const text = [
    `🧾 New order ${orderId}`,
    ``,
    `👤 ${name}`,
    `📞 ${phone}`,
    `📍 ${wilaya!.code} - ${wilaya!.name}, ${commune}`,
    `🏠 ${address}`,
    note ? `📝 ${note}` : null,
    ``,
    ...items.map((i) => `• ${i.quantity} × ${i.name} (${i.variant}) — ${formatPrice(i.unitPrice * i.quantity)}`),
    ``,
    `Subtotal: ${formatPrice(subtotal)}`,
    `Delivery: ${shipping === 0 ? "Free" : formatPrice(shipping)}`,
    `Total (cash on delivery): ${formatPrice(total)}`,
  ]
    .filter((l) => l !== null)
    .join("\n");

  // ---- Deliver the order ----
  const deliveries: Promise<boolean>[] = [];

  const { TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID, ORDER_WEBHOOK_URL } = process.env;
  if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
    deliveries.push(
      fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text }),
      })
        .then((r) => r.ok)
        .catch(() => false),
    );
  }
  if (ORDER_WEBHOOK_URL) {
    deliveries.push(
      fetch(ORDER_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order),
        redirect: "follow",
      })
        .then((r) => r.ok)
        .catch(() => false),
    );
  }

  console.log("New order", JSON.stringify(order));

  if (deliveries.length === 0) {
    if (process.env.NODE_ENV === "production") {
      console.error("Order received but no TELEGRAM_* or ORDER_WEBHOOK_URL is configured — order only in logs.");
      return NextResponse.json(
        { error: `Online ordering isn't set up yet. Please call us to place your order.` },
        { status: 503 },
      );
    }
    // In development, accept the order so the flow can be tested.
    return NextResponse.json({ orderId, total });
  }

  const results = await Promise.all(deliveries);
  if (!results.some(Boolean)) {
    console.error("Order delivery failed on every channel", orderId);
    return NextResponse.json({ error: "We couldn't place your order. Please try again." }, { status: 502 });
  }

  return NextResponse.json({ orderId, total });
}
