import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="rb-panel mx-auto max-w-xl p-8 text-center">
      <h1 className="rb-title text-4xl text-[var(--rb-text)]">Page not found</h1>
      <p className="mt-3 text-sm text-[var(--rb-muted)]">
        The page you requested does not exist or is no longer available.
      </p>
      <Link href="/" className="rb-btn mt-5 inline-block">
        Back to home
      </Link>
    </div>
  );
}

