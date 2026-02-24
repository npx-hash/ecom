"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  addToCartSchema,
  cartQuantitySchema,
  checkoutSchema,
} from "@/lib/schemas";

export async function addToCartAction(formData: FormData) {
  const user = await requireUser("/products");

  const parsed = addToCartSchema.safeParse({
    productId: formData.get("productId"),
    quantity: formData.get("quantity") ?? "1",
  });

  if (!parsed.success) {
    redirect(`/products?error=${encodeURIComponent("Invalid cart input.")}`);
  }

  const product = await prisma.product.findFirst({
    where: {
      id: parsed.data.productId,
      isPublished: true,
    },
    select: {
      id: true,
      inventory: true,
      slug: true,
    },
  });

  if (!product) {
    redirect(`/products?error=${encodeURIComponent("Product not found.")}`);
  }

  const existingCartItem = await prisma.cartItem.findUnique({
    where: {
      userId_productId: {
        userId: user.id,
        productId: product.id,
      },
    },
    select: { id: true, quantity: true },
  });

  const nextQuantity = (existingCartItem?.quantity ?? 0) + parsed.data.quantity;
  if (nextQuantity > product.inventory) {
    redirect(
      `/products/${product.slug}?error=${encodeURIComponent(
        "Not enough inventory to fulfill this quantity.",
      )}`,
    );
  }

  if (existingCartItem) {
    await prisma.cartItem.update({
      where: { id: existingCartItem.id },
      data: { quantity: nextQuantity },
    });
  } else {
    await prisma.cartItem.create({
      data: {
        userId: user.id,
        productId: product.id,
        quantity: parsed.data.quantity,
      },
    });
  }

  revalidatePath("/cart");
  revalidatePath(`/products/${product.slug}`);
  redirect("/cart");
}

export async function updateCartQuantityAction(formData: FormData) {
  const user = await requireUser("/cart");

  const parsed = cartQuantitySchema.safeParse({
    cartItemId: formData.get("cartItemId"),
    quantity: formData.get("quantity"),
  });

  if (!parsed.success) {
    redirect(`/cart?error=${encodeURIComponent("Invalid quantity.")}`);
  }

  const cartItem = await prisma.cartItem.findFirst({
    where: {
      id: parsed.data.cartItemId,
      userId: user.id,
    },
    include: {
      product: {
        select: {
          inventory: true,
        },
      },
    },
  });

  if (!cartItem) {
    redirect(`/cart?error=${encodeURIComponent("Cart item not found.")}`);
  }

  if (parsed.data.quantity > cartItem.product.inventory) {
    redirect(
      `/cart?error=${encodeURIComponent(
        "Quantity exceeds available inventory.",
      )}`,
    );
  }

  await prisma.cartItem.update({
    where: { id: cartItem.id },
    data: { quantity: parsed.data.quantity },
  });

  revalidatePath("/cart");
  redirect("/cart");
}

export async function removeCartItemAction(formData: FormData) {
  const user = await requireUser("/cart");
  const cartItemId = formData.get("cartItemId")?.toString();

  if (!cartItemId) {
    redirect(`/cart?error=${encodeURIComponent("Invalid cart item.")}`);
  }

  await prisma.cartItem.deleteMany({
    where: {
      id: cartItemId,
      userId: user.id,
    },
  });

  revalidatePath("/cart");
  redirect("/cart");
}

export async function checkoutAction(formData: FormData) {
  const user = await requireUser("/checkout");

  const parsed = checkoutSchema.safeParse({
    shippingName: formData.get("shippingName"),
    shippingEmail: formData.get("shippingEmail"),
    shippingPhone: formData.get("shippingPhone") || undefined,
    shippingAddress1: formData.get("shippingAddress1"),
    shippingAddress2: formData.get("shippingAddress2") || undefined,
    shippingCity: formData.get("shippingCity"),
    shippingState: formData.get("shippingState"),
    shippingPostalCode: formData.get("shippingPostalCode"),
    shippingCountry: formData.get("shippingCountry"),
    notes: formData.get("notes") || undefined,
  });

  if (!parsed.success) {
    redirect(
      `/checkout?error=${encodeURIComponent(
        "Please fill out all required shipping details.",
      )}`,
    );
  }

  const cartItems = await prisma.cartItem.findMany({
    where: { userId: user.id },
    include: {
      product: true,
    },
  });

  if (cartItems.length === 0) {
    redirect(`/cart?error=${encodeURIComponent("Your cart is empty.")}`);
  }

  for (const item of cartItems) {
    if (!item.product.isPublished) {
      redirect(`/cart?error=${encodeURIComponent("One product is unavailable.")}`);
    }

    if (item.quantity > item.product.inventory) {
      redirect(
        `/cart?error=${encodeURIComponent(
          `Insufficient inventory for ${item.product.name}.`,
        )}`,
      );
    }
  }

  const totalCents = cartItems.reduce(
    (sum, item) => sum + item.quantity * item.product.priceCents,
    0,
  );

  try {
    const order = await prisma.$transaction(async (tx) => {
      for (const item of cartItems) {
        const inventoryUpdate = await tx.product.updateMany({
          where: {
            id: item.productId,
            inventory: { gte: item.quantity },
          },
          data: {
            inventory: { decrement: item.quantity },
          },
        });

        if (inventoryUpdate.count !== 1) {
          throw new Error("Inventory update failed.");
        }
      }

      const createdOrder = await tx.order.create({
        data: {
          userId: user.id,
          status: "PENDING",
          totalCents,
          shippingName: parsed.data.shippingName,
          shippingEmail: parsed.data.shippingEmail,
          shippingPhone: parsed.data.shippingPhone,
          shippingAddress1: parsed.data.shippingAddress1,
          shippingAddress2: parsed.data.shippingAddress2,
          shippingCity: parsed.data.shippingCity,
          shippingState: parsed.data.shippingState,
          shippingPostalCode: parsed.data.shippingPostalCode,
          shippingCountry: parsed.data.shippingCountry,
          notes: parsed.data.notes,
          items: {
            create: cartItems.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              unitPriceCents: item.product.priceCents,
              productName: item.product.name,
              productSlug: item.product.slug,
              productImageUrl: item.product.imageUrl,
            })),
          },
        },
        select: { id: true },
      });

      await tx.cartItem.deleteMany({
        where: { userId: user.id },
      });

      return createdOrder;
    });

    revalidatePath("/cart");
    revalidatePath("/account");
    revalidatePath("/admin/orders");
    redirect(`/account?order=${order.id}`);
  } catch {
    redirect(
      `/checkout?error=${encodeURIComponent(
        "Order placement failed. Please try again.",
      )}`,
    );
  }
}
