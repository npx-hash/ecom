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
      <section className="rb-panel p-6">
        <h1 className="rb-title text-4xl text-[var(--rb-text)]">Account</h1>
        <p className="mt-2 text-sm text-[var(--rb-muted)]">
          Signed in as <span className="font-semibold">{user.email}</span>.
        </p>
      </section>

      {recentOrderId ? (
        <p className="rb-alert-success">
          Order <span className="font-mono">{recentOrderId}</span> has been placed successfully.
        </p>
      ) : null}

      <section className="space-y-4">
        <h2 className="rb-title text-3xl text-[var(--rb-text)]">Order history</h2>
        {orders.length === 0 ? (
          <div className="rb-panel p-6 text-[var(--rb-muted)]">
            You have no orders yet.{" "}
            <Link href="/products" className="font-semibold text-[var(--rb-accent-strong)] underline">
              Start shopping
            </Link>
            .
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <article key={order.id} className="rb-panel p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm text-[var(--rb-muted)]">Order ID</p>
                    <p className="font-mono text-xs text-[var(--rb-text)]">{order.id}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-[var(--rb-muted)]">{formatDateTime(order.createdAt)}</p>
                    <p className="mt-1 text-sm font-semibold uppercase tracking-wide text-[var(--rb-accent-strong)]">
                      {order.status}
                    </p>
                  </div>
                </div>
                <ul className="mt-4 space-y-1 text-sm text-[var(--rb-muted)]">
                  {order.items.map((item) => (
                    <li key={item.id} className="flex items-center justify-between gap-3">
                      <span>
                        {item.productName} x {item.quantity}
                      </span>
                      <span className="font-medium text-[var(--rb-accent-strong)]">
                        {formatPrice(item.quantity * item.unitPriceCents)}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 border-t border-[rgba(47,111,237,0.18)] pt-4 text-right">
                  <p className="text-sm text-[var(--rb-muted)]">Total</p>
                  <p className="text-lg font-semibold text-[var(--rb-accent-strong)]">
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

