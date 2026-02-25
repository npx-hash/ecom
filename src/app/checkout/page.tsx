import Link from "next/link";
import { redirect } from "next/navigation";

import { checkoutAction } from "@/actions/shop-actions";
import { requireUser } from "@/lib/auth";
import { formatPrice } from "@/lib/format";
import { prisma } from "@/lib/prisma";

type CheckoutPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function CheckoutPage({ searchParams }: CheckoutPageProps) {
  const [user, params] = await Promise.all([requireUser("/checkout"), searchParams]);
  const errorMessage = params.error?.toString().trim();

  const cartItems = await prisma.cartItem.findMany({
    where: { userId: user.id },
    include: { product: true },
    orderBy: { createdAt: "desc" },
  });

  if (cartItems.length === 0) {
    redirect("/cart");
  }

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.quantity * item.product.priceCents,
    0,
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[1.8fr_1fr]">
      <section className="rb-panel p-6">
        <h1 className="rb-title text-4xl text-[var(--rb-text)]">Checkout</h1>
        <p className="mt-2 text-sm text-[var(--rb-muted)]">
          Place your order and we will track fulfillment from the admin dashboard.
        </p>

        {errorMessage ? (
          <p className="rb-alert mt-4">
            {errorMessage}
          </p>
        ) : null}

        <form action={checkoutAction} className="mt-6 grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="rb-label" htmlFor="shippingName">
                Full name
              </label>
              <input
                id="shippingName"
                name="shippingName"
                required
                defaultValue={user.name}
                className="rb-input"
              />
            </div>
            <div>
              <label className="rb-label" htmlFor="shippingEmail">
                Email
              </label>
              <input
                id="shippingEmail"
                name="shippingEmail"
                type="email"
                required
                defaultValue={user.email}
                className="rb-input"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="rb-label" htmlFor="shippingPhone">
                Phone (optional)
              </label>
              <input
                id="shippingPhone"
                name="shippingPhone"
                className="rb-input"
              />
            </div>
            <div>
              <label className="rb-label" htmlFor="shippingCountry">
                Country
              </label>
              <input
                id="shippingCountry"
                name="shippingCountry"
                required
                defaultValue="United States"
                className="rb-input"
              />
            </div>
          </div>

          <div>
            <label className="rb-label" htmlFor="shippingAddress1">
              Address line 1
            </label>
            <input
              id="shippingAddress1"
              name="shippingAddress1"
              required
              className="rb-input"
            />
          </div>

          <div>
            <label className="rb-label" htmlFor="shippingAddress2">
              Address line 2 (optional)
            </label>
            <input
              id="shippingAddress2"
              name="shippingAddress2"
              className="rb-input"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="rb-label" htmlFor="shippingCity">
                City
              </label>
              <input
                id="shippingCity"
                name="shippingCity"
                required
                className="rb-input"
              />
            </div>
            <div>
              <label className="rb-label" htmlFor="shippingState">
                State / Province
              </label>
              <input
                id="shippingState"
                name="shippingState"
                required
                className="rb-input"
              />
            </div>
            <div>
              <label className="rb-label" htmlFor="shippingPostalCode">
                Postal code
              </label>
              <input
                id="shippingPostalCode"
                name="shippingPostalCode"
                required
                className="rb-input"
              />
            </div>
          </div>

          <div>
            <label className="rb-label" htmlFor="notes">
              Order notes (optional)
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              className="rb-textarea"
            />
          </div>

          <button type="submit" className="rb-btn mt-2">
            Place order
          </button>
        </form>
      </section>

      <aside className="rb-panel h-fit p-5">
        <h2 className="rb-title text-2xl text-[var(--rb-text)]">Order summary</h2>
        <ul className="mt-4 space-y-2">
          {cartItems.map((item) => (
            <li key={item.id} className="flex items-start justify-between gap-3 text-sm">
              <div>
                <p className="font-medium text-[var(--rb-text)]">{item.product.name}</p>
                <p className="text-[var(--rb-muted)]">Qty {item.quantity}</p>
              </div>
              <p className="font-semibold text-[var(--rb-accent-strong)]">
                {formatPrice(item.quantity * item.product.priceCents)}
              </p>
            </li>
          ))}
        </ul>
        <div className="mt-4 border-t border-[rgba(47,111,237,0.18)] pt-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-[var(--rb-muted)]">Subtotal</span>
            <span className="font-semibold text-[var(--rb-accent-strong)]">{formatPrice(subtotal)}</span>
          </div>
        </div>
        <Link
          href="/cart"
          className="mt-4 inline-block text-sm font-semibold uppercase tracking-[0.12em] text-[var(--rb-accent-strong)] hover:text-[var(--rb-accent-strong)]"
        >
          Back to cart
        </Link>
      </aside>
    </div>
  );
}

