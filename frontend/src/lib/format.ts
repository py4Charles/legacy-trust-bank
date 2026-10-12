export function formatCurrency(
  amount: number,
  currency = "GHS",
  options: Intl.NumberFormatOptions = {},
): string {
  return new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    ...options,
  }).format(amount);
}

export function formatSignedCurrency(amount: number, currency = "GHS"): string {
  const formatted = formatCurrency(Math.abs(amount), currency);
  return amount >= 0 ? `+${formatted}` : `-${formatted}`;
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("en-GH", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));
}

export function formatDateTime(iso: string): string {
  return new Intl.DateTimeFormat("en-GH", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

export function maskCardNumber(last4: string): string {
  return `•••• •••• •••• ${last4}`;
}
