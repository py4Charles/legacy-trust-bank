import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  tone?: "dark" | "light";
}

export function Logo({ className, tone = "dark" }: LogoProps) {
  const textColor = tone === "light" ? "text-white" : "text-ink-900";
  const subColor =
    tone === "light" ? "text-white/60" : "text-brand-600";
  return (
    <Link
      to="/"
      className={cn("group inline-flex items-center gap-2.5", className)}
      aria-label="Legacy Trust Bank home"
    >
      <span className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-brand-500 to-brand-950 text-white shadow-lg shadow-brand-600/30">
        <span
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-1/2 bg-white/20"
        />
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="relative h-5 w-5"
          aria-hidden="true"
        >
          <path d="M12 3 4 6v5c0 4.5 3.4 8.3 8 10 4.6-1.7 8-5.5 8-10V6l-8-3Z" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      </span>
      <span className="flex flex-col leading-none">
        <span className={cn("text-base font-bold tracking-tight", textColor)}>
          Legacy Trust
        </span>
        <span
          className={cn(
            "mt-0.5 text-[9px] font-semibold uppercase tracking-[0.28em]",
            subColor,
          )}
        >
          Bank
        </span>
      </span>
    </Link>
  );
}