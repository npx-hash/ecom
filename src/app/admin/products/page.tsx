import Link from "next/link";

import { deleteProductAction } from "@/actions/admin-actions";
import { formatDateTime, formatPrice } from "@/lib/format";
import { prisma } from "@/lib/prisma";

type AdminProductsPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function AdminProductsPage({
  searchParams,
}: AdminProductsPageProps) {
  const params = await searchParams;
  const errorMessage = params.error?.toString().trim();

  const products = await prisma.product.findMany({
    include: {
      category: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="rb-title text-3xl text-[#edf5dd]">Products</h2>
        <Link href="/admin/products/new" className="rb-btn">
          New product
        </Link>
      </div>

      {errorMessage ? (
        <p className="rb-alert">
          {errorMessage}
        </p>
      ) : null}

      <div className="rb-table-wrap">
        <table className="rb-table">
          <thead>
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Updated</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td className="px-4 py-3">
                  <p className="font-medium text-[#edf5dd]">{product.name}</p>
                  <p className="font-mono text-xs text-[#8ea88b]">{product.sku}</p>
                </td>
                <td className="px-4 py-3 text-[#daf4b4]">{formatPrice(product.priceCents)}</td>
                <td className="px-4 py-3 text-[#c0d1b8]">
                  {product.category?.name ?? "Uncategorized"}
                </td>
                <td className="px-4 py-3 text-[#c0d1b8]">{product.inventory}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rb-badge ${
                      product.isPublished
                        ? ""
                        : "!border-[rgba(255,184,91,0.4)] !bg-[rgba(255,184,91,0.12)] !text-[#ffd7a2]"
                    }`}
                  >
                    {product.isPublished ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="px-4 py-3 text-[#96ac91]">{formatDateTime(product.updatedAt)}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/admin/products/${product.id}`}
                      className="rb-btn-secondary !px-3 !py-1.5 !text-[10px]"
                    >
                      Edit
                    </Link>
                    <form action={deleteProductAction}>
                      <input type="hidden" name="productId" value={product.id} />
                      <button type="submit" className="rb-btn-danger !px-3 !py-1.5 !text-[10px]">
                        Delete
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
