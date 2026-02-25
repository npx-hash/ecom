import Link from "next/link";

import { logoutAction } from "@/actions/auth-actions";
import { getCurrentUser } from "@/lib/auth";

export async function SiteHeader() {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-40 border-b border-[rgba(47,111,237,0.2)] bg-[rgba(247,251,255,0.86)] backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-4 md:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link href="/" className="group inline-flex items-center gap-3">
            <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-[rgba(47,111,237,0.35)] bg-[rgba(47,111,237,0.1)] text-sm font-black text-[#2a58c8]">
              ET
              <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-[#2f6fed]" />
            </span>
            <span>
              <span className="block text-lg font-semibold tracking-[0.14em] text-[var(--rb-text)]">
                Ecom Template
              </span>
              <span className="block text-[10px] uppercase tracking-[0.28em] text-[var(--rb-muted)]">
                In-House Storefront
              </span>
            </span>
          </Link>
          {user ? (
            <p className="text-xs uppercase tracking-[0.16em] text-[var(--rb-muted)]">
              Logged in: <span className="text-[var(--rb-text)]">{user.name}</span>
            </p>
          ) : (
            <p className="text-xs uppercase tracking-[0.16em] text-[var(--rb-muted)]">
              Minimal ecommerce baseline
            </p>
          )}
        </div>

        <nav className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-[var(--rb-muted)]">
          <Link className="rb-btn-secondary !py-2" href="/">
            Home
          </Link>
          <Link className="rb-btn-secondary !py-2" href="/products">
            Catalog
          </Link>
          <Link className="rb-btn-secondary !py-2" href="/cart">
            Cart
          </Link>
          {user ? (
            <>
              <Link className="rb-btn-secondary !py-2" href="/account">
                Account
              </Link>
              {user.role === "ADMIN" ? (
                <Link className="rb-btn-secondary !py-2" href="/admin">
                  Admin
                </Link>
              ) : null}
              <form action={logoutAction}>
                <button type="submit" className="rb-btn-danger !py-2">
                  Logout
                </button>
              </form>
            </>
          ) : (
            <>
              <Link className="rb-btn-secondary !py-2" href="/login">
                Login
              </Link>
              <Link className="rb-btn !py-2" href="/register">
                Create Account
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
