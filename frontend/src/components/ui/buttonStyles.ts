type Variant =
  | "primary"
  | "secondary"
  | "outline"
  | "outlineLight"
  | "white"
  | "onbrand"
  | "ghost"
  | "danger";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary:
    "bg-brand-600 text-white hover:bg-brand-700 focus-visible:outline-brand-600",
  secondary: "bg-ink-900 text-white hover:bg-ink-950",
  outline:
    "border border-ink-300 bg-white text-ink-800 hover:bg-ink-50 hover:border-ink-400",
  outlineLight:
    "border border-white/40 bg-transparent text-white hover:bg-white/10 hover:border-white/60",
  white: "bg-white text-brand-700 hover:bg-ink-100",
  onbrand: "bg-brand-500 text-white hover:bg-brand-400",
  ghost: "bg-transparent text-ink-700 hover:bg-ink-100",
  danger: "bg-negative-600 text-white hover:bg-red-700",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-base",
};

export function buttonClass(
  variant: Variant = "primary",
  size: Size = "md",
  className?: string,
): string {
  return [base, variants[variant], sizes[size], className]
    .filter(Boolean)
    .join(" ");
}
