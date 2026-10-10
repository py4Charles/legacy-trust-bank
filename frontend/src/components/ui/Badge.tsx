import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Tone = "neutral" | "brand" | "positive" | "warning" | "danger" | "light";

const tones: Record<Tone, string> = {
  neutral: "bg-ink-100 text-ink-600",
  brand: "bg-brand-50 text-brand-700 ring-1 ring-brand-100",
  positive: "bg-emerald-50 text-positive-700 ring-1 ring-emerald-100",
  warning: "bg-amber-50 text-amber-700 ring-1 ring-amber-100",
  danger: "bg-red-50 text-negative-600 ring-1 ring-red-100",
  light: "bg-white/15 text-white backdrop-blur",
};

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
}

export function Badge({ tone = "neutral", className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}