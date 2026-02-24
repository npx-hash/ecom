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
        <h1 className="rb-title text-4xl text-[#edf5dd]">Account</h1>
        <p className="mt-2 text-sm text-[#a7bc9f]">
          Signed in as <span className="font-semibold">{user.email}</span>.
        </p>
      </section>

      {recentOrderId ? (
        <p className="rb-alert-success">
          Order <span className="font-mono">{recentOrderId}</span> has been placed successfully.
        </p>
      ) : null}

      <section className="space-y-4">
        <h2 className="rb-title text-3xl text-[#edf5dd]">Order history</h2>
        {orders.length === 0 ? (
          <div className="rb-panel p-6 text-[#a5bc9f]">
            You have no orders yet.{" "}
            <Link href="/products" className="font-semibold text-[#def3bd] underline">
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
                    <p className="text-sm text-[#8ea88b]">Order ID</p>
                    <p className="font-mono text-xs text-[#dceccb]">{order.id}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-[#93ab8e]">{formatDateTime(order.createdAt)}</p>
                    <p className="mt-1 text-sm font-semibold uppercase tracking-wide text-[#daf4b4]">
                      {order.status}
                    </p>
                  </div>
                </div>
                <ul className="mt-4 space-y-1 text-sm text-[#b3c7ad]">
                  {order.items.map((item) => (
                    <li key={item.id} className="flex items-center justify-between gap-3">
                      <span>
                        {item.productName} x {item.quantity}
                      </span>
                      <span className="font-medium text-[#def3bd]">
                        {formatPrice(item.quantity * item.unitPriceCents)}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 border-t border-[rgba(174,224,114,0.2)] pt-4 text-right">
                  <p className="text-sm text-[#8ea88b]">Total</p>
                  <p className="text-lg font-semibold text-[#daf4b4]">
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
