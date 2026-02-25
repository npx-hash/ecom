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
      <h1 className="rb-title text-4xl">Your Cart</h1>

      {errorMessage ? (
        <p className="rb-alert">
          {errorMessage}
        </p>
      ) : null}

      {cartItems.length === 0 ? (
        <div className="rb-panel p-8 text-center">
          <p className="text-[var(--rb-muted)]">Your cart is empty.</p>
          <Link href="/products" className="rb-btn mt-4 inline-block">
            Browse products
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <section className="space-y-4">
            {cartItems.map((item) => (
              <article key={item.id} className="rb-panel p-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-xl font-semibold text-[var(--rb-text)]">{item.product.name}</p>
                    <p className="mt-1 text-sm text-[var(--rb-muted)]">{item.product.sku}</p>
                    <p className="mt-2 text-sm font-medium text-[var(--rb-accent-strong)]">
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
                        className="rb-input w-20"
                      />
                      <button type="submit" className="rb-btn-secondary !py-1.5 !text-[11px]">
                        Update
                      </button>
                    </form>

                    <form action={removeCartItemAction}>
                      <input type="hidden" name="cartItemId" value={item.id} />
                      <button type="submit" className="rb-btn-danger !py-1.5 !text-[11px]">
                        Remove
                      </button>
                    </form>
                  </div>
                </div>
              </article>
            ))}
          </section>

          <aside className="rb-panel h-fit p-5">
            <h2 className="rb-title text-2xl text-[var(--rb-text)]">Summary</h2>
            <div className="mt-4 flex items-center justify-between text-sm text-[var(--rb-muted)]">
              <span>Subtotal</span>
              <span className="font-semibold text-[var(--rb-accent-strong)]">{formatPrice(subtotal)}</span>
            </div>
            <p className="mt-3 text-xs text-[var(--rb-muted)]">
              Taxes and shipping are collected during checkout.
            </p>
            <Link href="/checkout" className="rb-btn mt-5 inline-flex w-full items-center justify-center">
              Continue to checkout
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}

