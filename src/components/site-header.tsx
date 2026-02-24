import Link from "next/link";

import { logoutAction } from "@/actions/auth-actions";
import { getCurrentUser } from "@/lib/auth";

export async function SiteHeader() {
  const user = await getCurrentUser();

  return (
    <header className="border-b border-slate-200 bg-white/85 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-4 md:px-6">
        <Link href="/" className="text-xl font-semibold tracking-tight text-slate-900">
          Northstar Commerce
        </Link>

        <nav className="flex items-center gap-4 text-sm font-medium text-slate-700">
          <Link className="hover:text-slate-900" href="/">
            Home
          </Link>
          <Link className="hover:text-slate-900" href="/products">
            Products
          </Link>
          <Link className="hover:text-slate-900" href="/cart">
            Cart
          </Link>
          {user ? (
            <>
              <Link className="hover:text-slate-900" href="/account">
                Account
              </Link>
              {user.role === "ADMIN" ? (
                <Link className="hover:text-slate-900" href="/admin">
                  Admin
                </Link>
              ) : null}
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="rounded-md border border-slate-300 px-3 py-1.5 text-sm hover:border-slate-400 hover:text-slate-900"
                >
                  Logout
                </button>
              </form>
            </>
          ) : (
            <>
              <Link className="hover:text-slate-900" href="/login">
                Login
              </Link>
              <Link
                className="rounded-md bg-slate-900 px-3 py-1.5 text-white hover:bg-slate-700"
                href="/register"
              >
                Create Account
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
