import Link from "next/link";

export default function NotFound() {
  return (
    <section className="container section">
      <div className="empty">
        <h1>Page not found</h1>
        <p>This page has been taken off the menu.</p>
        <Link href="/" className="btn btn--dark">
          Back to home
        </Link>
      </div>
    </section>
  );
}
