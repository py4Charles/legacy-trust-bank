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
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/25";

const variants: Record<Variant, string> = {
  primary:
    "bg-gradient-to-b from-brand-500 to-brand-700 text-white shadow-lg shadow-brand-600/25 hover:from-brand-400 hover:to-brand-600 hover:shadow-brand-600/35",
  secondary: "bg-ink-900 text-white shadow-sm hover:bg-ink-800",
  outline:
    "border border-ink-200 bg-white text-ink-700 shadow-sm hover:border-ink-300 hover:bg-ink-50 hover:text-ink-900",
  outlineLight:
    "border border-white/25 bg-transparent text-white backdrop-blur hover:border-white/50 hover:bg-white/10",
  white:
    "bg-white text-brand-700 shadow-lg shadow-ink-950/10 hover:bg-ink-50 hover:shadow-ink-950/15",
  onbrand: "bg-white/15 text-white border border-white/20 backdrop-blur hover:bg-white/25",
  ghost: "bg-transparent text-ink-600 hover:bg-ink-100 hover:text-ink-900",
  danger:
    "bg-gradient-to-b from-negative-500 to-negative-600 text-white shadow-lg shadow-negative-600/20 hover:from-negative-500 hover:to-negative-700",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-[13px]",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-7 text-[15px]",
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