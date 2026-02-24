"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/auth";
import { saveUploadedImage } from "@/lib/image";
import { prisma } from "@/lib/prisma";
import {
  categorySchema,
  orderStatusSchema,
  productSchema,
  userRoleSchema,
} from "@/lib/schemas";
import { slugify } from "@/lib/slug";
import type { UserRole } from "@/lib/types";

function toCents(value: number) {
  return Math.round(value * 100);
}

function normalizeOptionalString(value: FormDataEntryValue | null) {
  const normalized = value?.toString().trim();
  if (!normalized) {
    return undefined;
  }

  return normalized;
}

async function resolveImageUrl(formData: FormData) {
  const uploaded = formData.get("image");
  const rawImageUrl = normalizeOptionalString(formData.get("imageUrl"));
  const existingImageUrl = normalizeOptionalString(formData.get("existingImageUrl"));

  if (uploaded instanceof File && uploaded.size > 0) {
    return saveUploadedImage(uploaded);
  }

  if (rawImageUrl) {
    return rawImageUrl;
  }

  return existingImageUrl;
}

export async function createCategoryAction(formData: FormData) {
  await requireAdmin("/admin/categories");

  const parsed = categorySchema.safeParse({
    name: formData.get("name"),
    slug: normalizeOptionalString(formData.get("slug")),
    description: normalizeOptionalString(formData.get("description")),
  });

  if (!parsed.success) {
    redirect(
      `/admin/categories?error=${encodeURIComponent(
        "Invalid category details.",
      )}`,
    );
  }

  const slug = slugify(parsed.data.slug || parsed.data.name);
  if (!slug) {
    redirect(
      `/admin/categories?error=${encodeURIComponent(
        "Category slug could not be generated.",
      )}`,
    );
  }

  await prisma.category.create({
    data: {
      name: parsed.data.name,
      slug,
      description: parsed.data.description,
    },
  });

  revalidatePath("/admin/categories");
  revalidatePath("/products");
  redirect("/admin/categories");
}

export async function updateCategoryAction(formData: FormData) {
  await requireAdmin("/admin/categories");
  const categoryId = formData.get("categoryId")?.toString();

  if (!categoryId) {
    redirect(`/admin/categories?error=${encodeURIComponent("Invalid category.")}`);
  }

  const parsed = categorySchema.safeParse({
    name: formData.get("name"),
    slug: normalizeOptionalString(formData.get("slug")),
    description: normalizeOptionalString(formData.get("description")),
  });

  if (!parsed.success) {
    redirect(
      `/admin/categories?error=${encodeURIComponent(
        "Invalid category details.",
      )}`,
    );
  }

  const slug = slugify(parsed.data.slug || parsed.data.name);
  if (!slug) {
    redirect(
      `/admin/categories?error=${encodeURIComponent(
        "Category slug could not be generated.",
      )}`,
    );
  }

  await prisma.category.update({
    where: { id: categoryId },
    data: {
      name: parsed.data.name,
      slug,
      description: parsed.data.description,
    },
  });

  revalidatePath("/admin/categories");
  revalidatePath("/products");
  redirect("/admin/categories");
}

export async function deleteCategoryAction(formData: FormData) {
  await requireAdmin("/admin/categories");
  const categoryId = formData.get("categoryId")?.toString();
  if (!categoryId) {
    redirect(`/admin/categories?error=${encodeURIComponent("Invalid category.")}`);
  }

  try {
    await prisma.category.delete({
      where: { id: categoryId },
    });
  } catch {
    redirect(
      `/admin/categories?error=${encodeURIComponent(
        "Unable to delete category while products are assigned to it.",
      )}`,
    );
  }

  revalidatePath("/admin/categories");
  revalidatePath("/products");
  redirect("/admin/categories");
}

export async function createProductAction(formData: FormData) {
  await requireAdmin("/admin/products/new");

  const parsed = productSchema.safeParse({
    name: formData.get("name"),
    slug: normalizeOptionalString(formData.get("slug")),
    description: formData.get("description"),
    imageUrl: normalizeOptionalString(formData.get("imageUrl")),
    price: formData.get("price"),
    compareAtPrice: normalizeOptionalString(formData.get("compareAtPrice")),
    sku: formData.get("sku"),
    inventory: formData.get("inventory"),
    categoryId: normalizeOptionalString(formData.get("categoryId")),
    isPublished: formData.get("isPublished") === "on",
  });

  if (!parsed.success) {
    redirect(`/admin/products/new?error=${encodeURIComponent("Invalid product.")}`);
  }

  if (parsed.data.compareAtPrice && parsed.data.compareAtPrice < parsed.data.price) {
    redirect(
      `/admin/products/new?error=${encodeURIComponent(
        "Compare-at price must be greater than or equal to the price.",
      )}`,
    );
  }

  const slug = slugify(parsed.data.slug || parsed.data.name);
  if (!slug) {
    redirect(
      `/admin/products/new?error=${encodeURIComponent("Product slug is invalid.")}`,
    );
  }

  const imageUrl = await resolveImageUrl(formData);

  const createdProduct = await prisma.product.create({
    data: {
      name: parsed.data.name,
      slug,
      description: parsed.data.description,
      imageUrl,
      priceCents: toCents(parsed.data.price),
      compareAtPriceCents: parsed.data.compareAtPrice
        ? toCents(parsed.data.compareAtPrice)
        : undefined,
      sku: parsed.data.sku,
      inventory: parsed.data.inventory,
      categoryId: parsed.data.categoryId || null,
      isPublished: parsed.data.isPublished,
    },
    select: { id: true },
  });

  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/admin/products");
  redirect(`/admin/products/${createdProduct.id}`);
}

export async function updateProductAction(formData: FormData) {
  await requireAdmin("/admin/products");
  const productId = formData.get("productId")?.toString();

  if (!productId) {
    redirect(`/admin/products?error=${encodeURIComponent("Invalid product.")}`);
  }

  const parsed = productSchema.safeParse({
    name: formData.get("name"),
    slug: normalizeOptionalString(formData.get("slug")),
    description: formData.get("description"),
    imageUrl: normalizeOptionalString(formData.get("imageUrl")),
    price: formData.get("price"),
    compareAtPrice: normalizeOptionalString(formData.get("compareAtPrice")),
    sku: formData.get("sku"),
    inventory: formData.get("inventory"),
    categoryId: normalizeOptionalString(formData.get("categoryId")),
    isPublished: formData.get("isPublished") === "on",
  });

  if (!parsed.success) {
    redirect(
      `/admin/products/${productId}?error=${encodeURIComponent("Invalid product.")}`,
    );
  }

  if (parsed.data.compareAtPrice && parsed.data.compareAtPrice < parsed.data.price) {
    redirect(
      `/admin/products/${productId}?error=${encodeURIComponent(
        "Compare-at price must be greater than or equal to the price.",
      )}`,
    );
  }

  const slug = slugify(parsed.data.slug || parsed.data.name);
  if (!slug) {
    redirect(
      `/admin/products/${productId}?error=${encodeURIComponent(
        "Product slug is invalid.",
      )}`,
    );
  }

  const imageUrl = await resolveImageUrl(formData);

  await prisma.product.update({
    where: { id: productId },
    data: {
      name: parsed.data.name,
      slug,
      description: parsed.data.description,
      imageUrl,
      priceCents: toCents(parsed.data.price),
      compareAtPriceCents: parsed.data.compareAtPrice
        ? toCents(parsed.data.compareAtPrice)
        : undefined,
      sku: parsed.data.sku,
      inventory: parsed.data.inventory,
      categoryId: parsed.data.categoryId || null,
      isPublished: parsed.data.isPublished,
    },
  });

  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath(`/products/${slug}`);
  revalidatePath("/admin/products");
  redirect(`/admin/products/${productId}`);
}

export async function deleteProductAction(formData: FormData) {
  await requireAdmin("/admin/products");
  const productId = formData.get("productId")?.toString();
  if (!productId) {
    redirect(`/admin/products?error=${encodeURIComponent("Invalid product.")}`);
  }

  try {
    await prisma.product.delete({
      where: { id: productId },
    });
  } catch {
    redirect(
      `/admin/products?error=${encodeURIComponent(
        "Unable to delete product with existing order history.",
      )}`,
    );
  }

  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function updateOrderStatusAction(formData: FormData) {
  await requireAdmin("/admin/orders");

  const parsed = orderStatusSchema.safeParse({
    orderId: formData.get("orderId"),
    status: formData.get("status"),
  });

  if (!parsed.success) {
    redirect(`/admin/orders?error=${encodeURIComponent("Invalid order update.")}`);
  }

  await prisma.order.update({
    where: { id: parsed.data.orderId },
    data: { status: parsed.data.status },
  });

  revalidatePath("/admin/orders");
  revalidatePath("/account");
  redirect("/admin/orders");
}

export async function updateUserRoleAction(formData: FormData) {
  const admin = await requireAdmin("/admin/users");

  const parsed = userRoleSchema.safeParse({
    userId: formData.get("userId"),
    role: formData.get("role") as UserRole,
  });

  if (!parsed.success) {
    redirect(`/admin/users?error=${encodeURIComponent("Invalid user update.")}`);
  }

  if (admin.id === parsed.data.userId && parsed.data.role !== "ADMIN") {
    redirect(
      `/admin/users?error=${encodeURIComponent(
        "You cannot remove your own admin access.",
      )}`,
    );
  }

  await prisma.user.update({
    where: { id: parsed.data.userId },
    data: { role: parsed.data.role },
  });

  revalidatePath("/admin/users");
  redirect("/admin/users");
}
