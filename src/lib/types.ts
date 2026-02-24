export const ROLE_VALUES = ["USER", "ADMIN"] as const;
export type UserRole = (typeof ROLE_VALUES)[number];

export const ORDER_STATUS_VALUES = [
  "PENDING",
  "PAID",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
] as const;
export type OrderStatus = (typeof ORDER_STATUS_VALUES)[number];
