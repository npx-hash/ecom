import { updateOrderStatusAction } from "@/actions/admin-actions";
import { formatDateTime, formatPrice } from "@/lib/format";
import { prisma } from "@/lib/prisma";

type AdminOrdersPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

const statusOptions = [
  "PENDING",
  "PAID",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
] as const;

export default async function AdminOrdersPage({
  searchParams,
}: AdminOrdersPageProps) {
  const [params, orders] = await Promise.all([
    searchParams,
    prisma.order.findMany({
      include: {
        user: {
          select: {
            email: true,
            name: true,
          },
        },
        items: {
          orderBy: { id: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const errorMessage = params.error?.toString().trim();

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-slate-900">Orders</h2>

      {errorMessage ? (
        <p className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {errorMessage}
        </p>
      ) : null}

      {orders.length === 0 ? (
        <p className="rounded-xl border border-slate-200 bg-white p-6 text-slate-600">
          No orders yet.
        </p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <article key={order.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-mono text-xs text-slate-500">{order.id}</p>
                  <p className="mt-1 text-sm text-slate-700">
                    {order.user.name} ({order.user.email})
                  </p>
                  <p className="text-xs text-slate-500">{formatDateTime(order.createdAt)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-slate-900">
                    {formatPrice(order.totalCents)}
                  </p>
                  <form action={updateOrderStatusAction} className="mt-2 flex items-center gap-2">
                    <input type="hidden" name="orderId" value={order.id} />
                    <select
                      name="status"
                      defaultValue={order.status}
                      className="rounded-md border border-slate-300 px-2 py-1.5 text-xs font-semibold"
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                    <button
                      type="submit"
                      className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-slate-400"
                    >
                      Update
                    </button>
                  </form>
                </div>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div className="rounded-md border border-slate-200 bg-slate-50 p-3 text-xs text-slate-700">
                  <p className="font-semibold text-slate-900">Shipping</p>
                  <p>{order.shippingName}</p>
                  <p>{order.shippingEmail}</p>
                  {order.shippingPhone ? <p>{order.shippingPhone}</p> : null}
                  <p>{order.shippingAddress1}</p>
                  {order.shippingAddress2 ? <p>{order.shippingAddress2}</p> : null}
                  <p>
                    {order.shippingCity}, {order.shippingState} {order.shippingPostalCode}
                  </p>
                  <p>{order.shippingCountry}</p>
                </div>
                <div className="rounded-md border border-slate-200 bg-slate-50 p-3 text-xs text-slate-700">
                  <p className="font-semibold text-slate-900">Items</p>
                  <ul className="mt-2 space-y-1">
                    {order.items.map((item) => (
                      <li key={item.id} className="flex justify-between gap-2">
                        <span>
                          {item.productName} x {item.quantity}
                        </span>
                        <span className="font-semibold">
                          {formatPrice(item.quantity * item.unitPriceCents)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
