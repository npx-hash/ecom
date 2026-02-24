import Link from "next/link";

import { createProductAction } from "@/actions/admin-actions";
import { prisma } from "@/lib/prisma";

type AdminNewProductPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function AdminNewProductPage({
  searchParams,
}: AdminNewProductPageProps) {
  const [params, categories] = await Promise.all([
    searchParams,
    prisma.category.findMany({
      orderBy: {
        name: "asc",
      },
      select: {
        id: true,
        name: true,
      },
    }),
  ]);

  const errorMessage = params.error?.toString().trim();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="rb-title text-3xl text-[#edf5dd]">Create product</h2>
        <Link href="/admin/products" className="text-sm font-semibold uppercase tracking-[0.12em] text-[#b2c7aa] hover:text-[#e7f6d2]">
          Back to products
        </Link>
      </div>

      {errorMessage ? (
        <p className="rb-alert">
          {errorMessage}
        </p>
      ) : null}

      <form
        action={createProductAction}
        className="rb-panel space-y-4 p-6"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="rb-label" htmlFor="name">
              Product name
            </label>
            <input
              id="name"
              name="name"
              required
              className="rb-input"
            />
          </div>
          <div>
            <label className="rb-label" htmlFor="slug">
              Slug (optional)
            </label>
            <input
              id="slug"
              name="slug"
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
            rows={5}
            required
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
            Image URL (optional)
          </label>
          <input
            id="imageUrl"
            name="imageUrl"
            type="url"
            className="rb-input"
            placeholder="https://cdn.reaperbotany.com/products/night-bloom.jpg"
          />
          <p className="mt-1 text-xs text-[#8ea88b]">
            You can also upload an image file below. Uploaded file takes precedence.
          </p>
        </div>

        <div>
          <label className="rb-label" htmlFor="image">
            Upload image (optional)
          </label>
          <input
            id="image"
            name="image"
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            className="rb-input"
          />
        </div>

        <label className="inline-flex items-center gap-2 text-sm font-medium text-[#b8cdb0]">
          <input type="checkbox" name="isPublished" className="size-4" />
          Publish product immediately
        </label>

        <div>
          <button type="submit" className="rb-btn">
            Create product
          </button>
        </div>
      </form>
    </div>
  );
}
