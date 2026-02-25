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
    <div className="rb-panel mx-auto max-w-lg p-8">
      <p className="rb-chip">New Member</p>
      <h1 className="rb-title mt-4 text-4xl text-[var(--rb-text)]">Create an account</h1>
      <p className="mt-2 text-sm text-[var(--rb-muted)]">
        Register to save your cart and track orders.
      </p>

      {errorMessage ? (
        <p className="rb-alert mt-4">
          {errorMessage}
        </p>
      ) : null}

      <form action={registerAction} className="mt-6 space-y-4">
        <input type="hidden" name="next" value={nextPath} />
        <div>
          <label className="rb-label" htmlFor="name">
            Full name
          </label>
          <input
            id="name"
            name="name"
            required
            className="rb-input"
          />
        </div>
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
            minLength={8}
            required
            className="rb-input"
          />
        </div>
        <button type="submit" className="rb-btn w-full">
          Create account
        </button>
      </form>

      <p className="mt-4 text-sm text-[var(--rb-muted)]">
        Already have an account?{" "}
        <Link
          href={`/login?next=${encodeURIComponent(nextPath)}`}
          className="font-semibold text-[var(--rb-accent-strong)] underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}

