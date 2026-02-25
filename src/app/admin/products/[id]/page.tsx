import Link from "next/link";
import { notFound } from "next/navigation";

import { updateProductAction } from "@/actions/admin-actions";
import { formatDateTime, formatPrice } from "@/lib/format";
import { prisma } from "@/lib/prisma";

type AdminEditProductPageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function AdminEditProductPage({
  params,
  searchParams,
}: AdminEditProductPageProps) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const errorMessage = query.error?.toString().trim();

  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
    }),
    prisma.category.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="rb-title text-3xl text-[var(--rb-text)]">Edit product</h2>
        <Link href="/admin/products" className="text-sm font-semibold uppercase tracking-[0.12em] text-[var(--rb-accent-strong)] hover:text-[var(--rb-accent-strong)]">
          Back to products
        </Link>
      </div>

      {errorMessage ? (
        <p className="rb-alert">
          {errorMessage}
        </p>
      ) : null}

      <form
        action={updateProductAction}
        className="rb-panel space-y-4 p-6"
      >
        <input type="hidden" name="productId" value={product.id} />
        <input type="hidden" name="existingImageUrl" value={product.imageUrl ?? ""} />

        <div className="rb-panel-soft p-3 text-sm text-[var(--rb-muted)]">
          Created {formatDateTime(product.createdAt)} | Last updated {formatDateTime(product.updatedAt)}
          <br />
          Current price: <span className="text-[var(--rb-accent-strong)]">{formatPrice(product.priceCents)}</span> | SKU:{" "}
          <span className="font-mono text-[var(--rb-text)]">{product.sku}</span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="rb-label" htmlFor="name">
              Product name
            </label>
            <input
              id="name"
              name="name"
              required
              defaultValue={product.name}
              className="rb-input"
            />
          </div>
          <div>
            <label className="rb-label" htmlFor="slug">
              Slug
            </label>
            <input
              id="slug"
              name="slug"
              defaultValue={product.slug}
              className="rb-input"
            />
          </div>
        </div>

        <div>
          <label className="rb-label" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={6}
            required
            defaultValue={product.description}
            className="rb-textarea"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="rb-label" htmlFor="price">
              Price (USD)
            </label>
            <input
              id="price"
              name="price"
              type="number"
              step="0.01"
              min="0.01"
              required
              defaultValue={(product.priceCents / 100).toFixed(2)}
              className="rb-input"
            />
          </div>
          <div>
            <label className="rb-label" htmlFor="compareAtPrice">
              Compare-at price
            </label>
            <input
              id="compareAtPrice"
              name="compareAtPrice"
              type="number"
              step="0.01"
              min="0.01"
              defaultValue={
                product.compareAtPriceCents
                  ? (product.compareAtPriceCents / 100).toFixed(2)
                  : ""
              }
              className="rb-input"
            />
          </div>
          <div>
            <label className="rb-label" htmlFor="inventory">
              Inventory
            </label>
            <input
              id="inventory"
              name="inventory"
              type="number"
              min={0}
              required
              defaultValue={product.inventory}
              className="rb-input"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="rb-label" htmlFor="sku">
              SKU
            </label>
            <input
              id="sku"
              name="sku"
              required
              defaultValue={product.sku}
              className="rb-input"
            />
          </div>
          <div>
            <label className="rb-label" htmlFor="categoryId">
              Category
            </label>
            <select
              id="categoryId"
              name="categoryId"
              defaultValue={product.categoryId ?? ""}
              className="rb-select"
            >
              <option value="">Uncategorized</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="rb-label" htmlFor="imageUrl">
            Image URL
          </label>
          <input
            id="imageUrl"
            name="imageUrl"
            type="url"
            defaultValue={product.imageUrl ?? ""}
            className="rb-input"
            placeholder="https://cdn.example.com/products/aurora-keyboard.jpg"
          />
        </div>

        <div>
          <label className="rb-label" htmlFor="image">
            Upload replacement image
          </label>
          <input
            id="image"
            name="image"
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            className="rb-input"
          />
        </div>

        <label className="inline-flex items-center gap-2 text-sm font-medium text-[var(--rb-muted)]">
          <input
            type="checkbox"
            name="isPublished"
            defaultChecked={product.isPublished}
            className="size-4"
          />
          Published
        </label>

        <div>
          <button type="submit" className="rb-btn">
            Save changes
          </button>
        </div>
      </form>
    </div>
  );
}

