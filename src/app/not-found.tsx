import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
      <h1 className="text-3xl font-bold text-slate-900">Page not found</h1>
      <p className="mt-3 text-sm text-slate-600">
        The page you requested does not exist or is no longer available.
      </p>
      <Link
        href="/"
        className="mt-5 inline-block rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
      >
        Back to home
      </Link>
    </div>
  );
}
