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
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-900">Checkout</h1>
        <p className="mt-2 text-sm text-slate-600">
          Place your order and we will track fulfillment from the admin dashboard.
        </p>

        {errorMessage ? (
          <p className="mt-4 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {errorMessage}
          </p>
        ) : null}

        <form action={checkoutAction} className="mt-6 grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="shippingName">
                Full name
              </label>
              <input
                id="shippingName"
                name="shippingName"
                required
                defaultValue={user.name}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-sky-300 focus:ring"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="shippingEmail">
                Email
              </label>
              <input
                id="shippingEmail"
                name="shippingEmail"
                type="email"
                required
                defaultValue={user.email}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-sky-300 focus:ring"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="shippingPhone">
                Phone (optional)
              </label>
              <input
                id="shippingPhone"
                name="shippingPhone"
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-sky-300 focus:ring"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="shippingCountry">
                Country
              </label>
              <input
                id="shippingCountry"
                name="shippingCountry"
                required
                defaultValue="United States"
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-sky-300 focus:ring"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="shippingAddress1">
              Address line 1
            </label>
            <input
              id="shippingAddress1"
              name="shippingAddress1"
              required
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-sky-300 focus:ring"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="shippingAddress2">
              Address line 2 (optional)
            </label>
            <input
              id="shippingAddress2"
              name="shippingAddress2"
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-sky-300 focus:ring"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="shippingCity">
                City
              </label>
              <input
                id="shippingCity"
                name="shippingCity"
                required
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-sky-300 focus:ring"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="shippingState">
                State / Province
              </label>
              <input
                id="shippingState"
                name="shippingState"
                required
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-sky-300 focus:ring"
              />
            </div>
            <div>
              <label
                className="mb-1 block text-sm font-medium text-slate-700"
                htmlFor="shippingPostalCode"
              >
                Postal code
              </label>
              <input
                id="shippingPostalCode"
                name="shippingPostalCode"
                required
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-sky-300 focus:ring"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="notes">
              Order notes (optional)
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-sky-300 focus:ring"
            />
          </div>

          <button
            type="submit"
            className="mt-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
          >
            Place order
          </button>
        </form>
      </section>

      <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Order summary</h2>
        <ul className="mt-4 space-y-2">
          {cartItems.map((item) => (
            <li key={item.id} className="flex items-start justify-between gap-3 text-sm">
              <div>
                <p className="font-medium text-slate-800">{item.product.name}</p>
                <p className="text-slate-500">Qty {item.quantity}</p>
              </div>
              <p className="font-semibold text-slate-800">
                {formatPrice(item.quantity * item.product.priceCents)}
              </p>
            </li>
          ))}
        </ul>
        <div className="mt-4 border-t border-slate-200 pt-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">Subtotal</span>
            <span className="font-semibold text-slate-900">{formatPrice(subtotal)}</span>
          </div>
        </div>
        <Link href="/cart" className="mt-4 inline-block text-sm font-medium text-slate-700 hover:text-slate-900">
          Back to cart
        </Link>
      </aside>
    </div>
  );
}
