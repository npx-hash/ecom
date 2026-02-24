import { format } from "date-fns";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function formatPrice(cents: number) {
  return currency.format(cents / 100);
}

export function formatDateTime(date: Date) {
  return format(date, "MMM d, yyyy 'at' h:mm a");
}
