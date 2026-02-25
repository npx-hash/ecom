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
      <h2 className="rb-title text-3xl text-[var(--rb-text)]">Orders</h2>

      {errorMessage ? (
        <p className="rb-alert">
          {errorMessage}
        </p>
      ) : null}

      {orders.length === 0 ? (
        <p className="rb-panel p-6 text-[var(--rb-muted)]">
          No orders yet.
        </p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <article key={order.id} className="rb-panel p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-mono text-xs text-[var(--rb-muted)]">{order.id}</p>
                  <p className="mt-1 text-sm text-[var(--rb-muted)]">
                    {order.user.name} ({order.user.email})
                  </p>
                  <p className="text-xs text-[var(--rb-muted)]">{formatDateTime(order.createdAt)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-[var(--rb-accent-strong)]">
                    {formatPrice(order.totalCents)}
                  </p>
                  <form action={updateOrderStatusAction} className="mt-2 flex items-center gap-2">
                    <input type="hidden" name="orderId" value={order.id} />
                    <select
                      name="status"
                      defaultValue={order.status}
                      className="rb-select !w-auto !min-w-[140px] !py-1.5 !text-xs"
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                    <button type="submit" className="rb-btn-secondary !py-1.5 !text-[10px]">
                      Update
                    </button>
                  </form>
                </div>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div className="rb-panel-soft p-3 text-xs text-[var(--rb-muted)]">
                  <p className="font-semibold text-[var(--rb-text)]">Shipping</p>
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
                <div className="rb-panel-soft p-3 text-xs text-[var(--rb-muted)]">
                  <p className="font-semibold text-[var(--rb-text)]">Items</p>
                  <ul className="mt-2 space-y-1">
                    {order.items.map((item) => (
                      <li key={item.id} className="flex justify-between gap-2">
                        <span>
                          {item.productName} x {item.quantity}
                        </span>
                        <span className="font-semibold text-[var(--rb-accent-strong)]">
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

