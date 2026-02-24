import Link from "next/link";
import { redirect } from "next/navigation";

import { loginAction } from "@/actions/auth-actions";
import { getCurrentUser } from "@/lib/auth";

type LoginPageProps = {
  searchParams: Promise<{
    next?: string;
    error?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const [user, params] = await Promise.all([getCurrentUser(), searchParams]);

  if (user) {
    redirect("/");
  }

  const nextPath = params.next?.toString().trim() || "/account";
  const errorMessage = params.error?.toString().trim();

  return (
    <div className="mx-auto max-w-lg rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <h1 className="text-3xl font-bold text-slate-900">Welcome back</h1>
      <p className="mt-2 text-sm text-slate-600">Login to manage your account and orders.</p>

      {errorMessage ? (
        <p className="mt-4 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {errorMessage}
        </p>
      ) : null}

      <form action={loginAction} className="mt-6 space-y-4">
        <input type="hidden" name="next" value={nextPath} />
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
            required
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-sky-300 focus:ring"
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
        >
          Sign in
        </button>
      </form>

      <p className="mt-4 text-sm text-slate-600">
        Don&apos;t have an account?{" "}
        <Link href={`/register?next=${encodeURIComponent(nextPath)}`} className="font-medium text-slate-900 underline">
          Register
        </Link>
      </p>
    </div>
  );
}
