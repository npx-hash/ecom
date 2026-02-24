import Link from "next/link";

import { requireUser } from "@/lib/auth";
import { formatDateTime, formatPrice } from "@/lib/format";
import { prisma } from "@/lib/prisma";

type AccountPageProps = {
  searchParams: Promise<{
    order?: string;
  }>;
};

export default async function AccountPage({ searchParams }: AccountPageProps) {
  const [user, params] = await Promise.all([requireUser("/account"), searchParams]);
  const recentOrderId = params.order?.toString().trim();

  const orders = await prisma.order.findMany({
    where: {
      userId: user.id,
    },
    include: {
      items: {
        orderBy: { id: "asc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-900">Account</h1>
        <p className="mt-2 text-sm text-slate-600">
          Signed in as <span className="font-semibold">{user.email}</span>.
        </p>
      </section>

      {recentOrderId ? (
        <p className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          Order <span className="font-mono">{recentOrderId}</span> has been placed successfully.
        </p>
      ) : null}

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-slate-900">Order history</h2>
        {orders.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-6 text-slate-600">
            You have no orders yet.{" "}
            <Link href="/products" className="font-medium text-slate-900 underline">
              Start shopping
            </Link>
            .
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <article key={order.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm text-slate-600">Order ID</p>
                    <p className="font-mono text-xs text-slate-800">{order.id}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-600">{formatDateTime(order.createdAt)}</p>
                    <p className="mt-1 text-sm font-semibold uppercase tracking-wide text-slate-900">
                      {order.status}
                    </p>
                  </div>
                </div>
                <ul className="mt-4 space-y-1 text-sm text-slate-700">
                  {order.items.map((item) => (
                    <li key={item.id} className="flex items-center justify-between gap-3">
                      <span>
                        {item.productName} x {item.quantity}
                      </span>
                      <span className="font-medium">
                        {formatPrice(item.quantity * item.unitPriceCents)}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 border-t border-slate-200 pt-4 text-right">
                  <p className="text-sm text-slate-600">Total</p>
                  <p className="text-lg font-semibold text-slate-900">
                    {formatPrice(order.totalCents)}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
