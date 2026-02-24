import Link from "next/link";

import { logoutAction } from "@/actions/auth-actions";
import { getCurrentUser } from "@/lib/auth";

export async function SiteHeader() {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-40 border-b border-[#2a3a2a] bg-[rgba(8,16,10,0.82)] backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-4 md:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link href="/" className="group inline-flex items-center gap-3">
            <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-[rgba(174,224,114,0.45)] bg-[rgba(174,224,114,0.12)] text-sm font-black text-[#d6f4ab]">
              RB
              <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-[#aee072]" />
            </span>
            <span>
              <span className="block text-lg font-semibold tracking-[0.15em] text-[#ecf5dd]">
                Reaper Botany
              </span>
              <span className="block text-[10px] uppercase tracking-[0.28em] text-[#9ab194]">
                Cultivation + Delivery
              </span>
            </span>
          </Link>
          {user ? (
            <p className="text-xs uppercase tracking-[0.16em] text-[#9ab194]">
              Logged in: <span className="text-[#d8f2b1]">{user.name}</span>
            </p>
          ) : (
            <p className="text-xs uppercase tracking-[0.16em] text-[#9ab194]">
              Premium dispensary commerce
            </p>
          )}
        </div>

        <nav className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-[#c3d4ba]">
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
                Join Reaper
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
