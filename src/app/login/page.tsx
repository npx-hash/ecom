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
    <div className="rb-panel mx-auto max-w-lg p-8">
      <p className="rb-chip">Member Access</p>
      <h1 className="rb-title mt-4 text-4xl text-[var(--rb-text)]">Welcome back</h1>
      <p className="mt-2 text-sm text-[var(--rb-muted)]">Login to manage your account and orders.</p>

      {errorMessage ? (
        <p className="rb-alert mt-4">
          {errorMessage}
        </p>
      ) : null}

      <form action={loginAction} className="mt-6 space-y-4">
        <input type="hidden" name="next" value={nextPath} />
        <div>
          <label className="rb-label" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="rb-input"
          />
        </div>
        <div>
          <label className="rb-label" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="rb-input"
          />
        </div>
        <button type="submit" className="rb-btn w-full">
          Sign in
        </button>
      </form>

      <p className="mt-4 text-sm text-[var(--rb-muted)]">
        Don&apos;t have an account?{" "}
        <Link
          href={`/register?next=${encodeURIComponent(nextPath)}`}
          className="font-semibold text-[var(--rb-accent-strong)] underline"
        >
          Register
        </Link>
      </p>
    </div>
  );
}

