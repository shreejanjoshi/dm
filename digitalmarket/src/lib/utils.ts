import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(
  price: number | string,
  options: {
    currency?: "USD" | "EUR" | "GBP" | "BDT";
    // get ty type of this at the index of notation
    notation?: Intl.NumberFormatOptions["notation"];
  } = {}
) {
  // destructuring the currency and the notation and setting the default values
  const { currency = "USD", notation = "compact" } = options;

  // if string convert to the price
  const nummericPrice = typeof price === "string" ? parseFloat(price) : price;

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    notation: notation,
    maximumFractionDigits: 2,
  }).format(nummericPrice);
}
