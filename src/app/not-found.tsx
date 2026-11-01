import Link from "next/link";

export default function NotFound() {
  return (
    <main className="container section">
      <div className="empty">
        <Link href="/" className="wordmark">
          APRON
        </Link>
        <h1>Page not found</h1>
        <p>This page has been taken off the menu.</p>
        <Link href="/" className="btn btn--dark">
          Back to home
        </Link>
      </div>
    </main>
  );
}
