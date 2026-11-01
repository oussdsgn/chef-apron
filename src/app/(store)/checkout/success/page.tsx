import Link from "next/link";

export default async function SuccessPage({ searchParams }: { searchParams: Promise<{ order?: string }> }) {
  const order = (await searchParams).order?.slice(0, 40);
  return (
    <section className="container section">
      <div className="empty">
        <h1>Thank you for your order</h1>
        {order && (
          <p>
            Order number: <strong>{order}</strong>
          </p>
        )}
        <p>We&apos;ll call you shortly to confirm your order. You pay in cash when it&apos;s delivered.</p>
        <Link href="/products" className="btn btn--dark">
          Continue shopping
        </Link>
      </div>
    </section>
  );
}
