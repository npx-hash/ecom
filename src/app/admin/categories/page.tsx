import {
  createCategoryAction,
  deleteCategoryAction,
  updateCategoryAction,
} from "@/actions/admin-actions";
import { prisma } from "@/lib/prisma";

type AdminCategoriesPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function AdminCategoriesPage({
  searchParams,
}: AdminCategoriesPageProps) {
  const [params, categories] = await Promise.all([
    searchParams,
    prisma.category.findMany({
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
      orderBy: { name: "asc" },
    }),
  ]);

  const errorMessage = params.error?.toString().trim();

  return (
    <div className="space-y-6">
      <section className="rb-panel p-6">
        <h2 className="rb-title text-3xl text-[#edf5dd]">Create category</h2>
        {errorMessage ? (
          <p className="rb-alert mt-3">
            {errorMessage}
          </p>
        ) : null}
        <form action={createCategoryAction} className="mt-4 grid gap-3 sm:grid-cols-3">
          <input
            name="name"
            placeholder="Name"
            required
            className="rb-input"
          />
          <input
            name="slug"
            placeholder="Slug (optional)"
            className="rb-input"
          />
          <button type="submit" className="rb-btn">
            Add category
          </button>
          <textarea
            name="description"
            rows={2}
            placeholder="Description (optional)"
            className="rb-textarea sm:col-span-3"
          />
        </form>
      </section>

      <section className="space-y-3">
        <h2 className="rb-title text-3xl text-[#edf5dd]">Existing categories</h2>
        {categories.length === 0 ? (
          <p className="rb-panel p-6 text-[#a5bc9f]">
            No categories yet.
          </p>
        ) : (
          categories.map((category) => (
            <article key={category.id} className="rb-panel p-5">
              <div className="grid gap-3 sm:grid-cols-3">
                <form action={updateCategoryAction} className="contents">
                  <input type="hidden" name="categoryId" value={category.id} />
                  <input
                    name="name"
                    defaultValue={category.name}
                    required
                    className="rb-input"
                  />
                  <input
                    name="slug"
                    defaultValue={category.slug}
                    className="rb-input"
                  />
                  <div className="flex items-center gap-2">
                    <button type="submit" className="rb-btn-secondary !py-2 !text-[11px]">
                      Save
                    </button>
                  </div>
                  <textarea
                    name="description"
                    rows={2}
                    defaultValue={category.description ?? ""}
                    className="rb-textarea sm:col-span-3"
                  />
                </form>
              </div>
              <form action={deleteCategoryAction} className="mt-2">
                <input type="hidden" name="categoryId" value={category.id} />
                <button type="submit" className="rb-btn-danger !py-2 !text-[11px]">
                  Delete
                </button>
              </form>
              <p className="mt-2 text-xs text-[#8ea88b]">
                {category._count.products} products assigned
              </p>
            </article>
          ))
        )}
      </section>
    </div>
  );
}
