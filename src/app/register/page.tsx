import Link from "next/link";
import { redirect } from "next/navigation";

import { registerAction } from "@/actions/auth-actions";
import { getCurrentUser } from "@/lib/auth";

type RegisterPageProps = {
  searchParams: Promise<{
    next?: string;
    error?: string;
  }>;
};

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const [user, params] = await Promise.all([getCurrentUser(), searchParams]);

  if (user) {
    redirect("/");
  }

  const nextPath = params.next?.toString().trim() || "/account";
  const errorMessage = params.error?.toString().trim();

  return (
    <div className="mx-auto max-w-lg rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <h1 className="text-3xl font-bold text-slate-900">Create an account</h1>
      <p className="mt-2 text-sm text-slate-600">
        Register to save your cart and track orders.
      </p>

      {errorMessage ? (
        <p className="mt-4 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {errorMessage}
        </p>
      ) : null}

      <form action={registerAction} className="mt-6 space-y-4">
        <input type="hidden" name="next" value={nextPath} />
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="name">
            Full name
          </label>
          <input
            id="name"
            name="name"
            required
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-sky-300 focus:ring"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-sky-300 focus:ring"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            minLength={8}
            required
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-sky-300 focus:ring"
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
        >
          Create account
        </button>
      </form>

      <p className="mt-4 text-sm text-slate-600">
        Already have an account?{" "}
        <Link href={`/login?next=${encodeURIComponent(nextPath)}`} className="font-medium text-slate-900 underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
