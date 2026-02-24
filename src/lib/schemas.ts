import { z } from "zod";

import { ORDER_STATUS_VALUES, ROLE_VALUES } from "@/lib/types";

export const registerSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email(),
  password: z.string().min(8).max(100),
});

export const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(8).max(100),
});

export const categorySchema = z.object({
  name: z.string().trim().min(2).max(80),
  slug: z.string().trim().min(2).max(100).optional(),
  description: z.string().trim().max(300).optional(),
});

export const productSchema = z.object({
  name: z.string().trim().min(2).max(160),
  slug: z.string().trim().min(2).max(160).optional(),
  description: z.string().trim().min(10).max(4000),
  imageUrl: z.string().trim().url().optional().or(z.literal("")),
  price: z.coerce.number().positive(),
  compareAtPrice: z.coerce.number().positive().optional(),
  sku: z.string().trim().min(2).max(100),
  inventory: z.coerce.number().int().min(0),
  categoryId: z.string().trim().optional(),
  isPublished: z.boolean().default(false),
});

export const addToCartSchema = z.object({
  productId: z.string().trim().min(1),
  quantity: z.coerce.number().int().min(1).max(50).default(1),
});

export const cartQuantitySchema = z.object({
  cartItemId: z.string().trim().min(1),
  quantity: z.coerce.number().int().min(1).max(50),
});

export const checkoutSchema = z.object({
  shippingName: z.string().trim().min(2).max(120),
  shippingEmail: z.string().trim().email(),
  shippingPhone: z.string().trim().max(30).optional(),
  shippingAddress1: z.string().trim().min(3).max(160),
  shippingAddress2: z.string().trim().max(160).optional(),
  shippingCity: z.string().trim().min(2).max(120),
  shippingState: z.string().trim().min(2).max(120),
  shippingPostalCode: z.string().trim().min(3).max(20),
  shippingCountry: z.string().trim().min(2).max(120),
  notes: z.string().trim().max(500).optional(),
});

export const orderStatusSchema = z.object({
  orderId: z.string().trim().min(1),
  status: z.enum(ORDER_STATUS_VALUES),
});

export const userRoleSchema = z.object({
  userId: z.string().trim().min(1),
  role: z.enum(ROLE_VALUES),
});
