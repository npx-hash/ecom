import Link from "next/link";

import {
  removeCartItemAction,
  updateCartQuantityAction,
} from "@/actions/shop-actions";
import { requireUser } from "@/lib/auth";
import { formatPrice } from "@/lib/format";
import { prisma } from "@/lib/prisma";

type CartPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function CartPage({ searchParams }: CartPageProps) {
  const [user, params] = await Promise.all([requireUser("/cart"), searchParams]);
  const errorMessage = params.error?.toString().trim();

  const cartItems = await prisma.cartItem.findMany({
    where: { userId: user.id },
    include: {
      product: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.quantity * item.product.priceCents,
    0,
  );

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-900">Your Cart</h1>

      {errorMessage ? (
        <p className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {errorMessage}
        </p>
      ) : null}

      {cartItems.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
          <p className="text-slate-600">Your cart is empty.</p>
          <Link
            href="/products"
            className="mt-4 inline-block rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
          >
            Browse products
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <section className="space-y-4">
            {cartItems.map((item) => (
              <article
                key={item.id}
                className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-lg font-semibold text-slate-900">{item.product.name}</p>
                    <p className="mt-1 text-sm text-slate-600">{item.product.sku}</p>
                    <p className="mt-2 text-sm font-medium text-slate-900">
                      {formatPrice(item.product.priceCents)}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <form action={updateCartQuantityAction} className="flex items-center gap-2">
                      <input type="hidden" name="cartItemId" value={item.id} />
                      <input
                        type="number"
                        name="quantity"
                        min={1}
                        max={Math.max(item.product.inventory, 1)}
                        defaultValue={item.quantity}
                        className="w-20 rounded-md border border-slate-300 px-2 py-1.5 text-sm"
                      />
                      <button
                        type="submit"
                        className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium hover:border-slate-400"
                      >
                        Update
                      </button>
                    </form>

                    <form action={removeCartItemAction}>
                      <input type="hidden" name="cartItemId" value={item.id} />
                      <button
                        type="submit"
                        className="rounded-md border border-rose-200 px-3 py-1.5 text-sm font-medium text-rose-700 hover:bg-rose-50"
                      >
                        Remove
                      </button>
                    </form>
                  </div>
                </div>
              </article>
            ))}
          </section>

          <aside className="h-fit rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Summary</h2>
            <div className="mt-4 flex items-center justify-between text-sm text-slate-700">
              <span>Subtotal</span>
              <span className="font-semibold text-slate-900">{formatPrice(subtotal)}</span>
            </div>
            <p className="mt-3 text-xs text-slate-500">
              Taxes and shipping are collected during checkout.
            </p>
            <Link
              href="/checkout"
              className="mt-5 inline-flex w-full items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
            >
              Continue to checkout
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}
