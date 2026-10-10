import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  tone?: "dark" | "light";
}

export function Logo({ className, tone = "dark" }: LogoProps) {
  const textColor = tone === "light" ? "text-white" : "text-ink-900";
  return (
    <Link
      to="/"
      className={cn("inline-flex items-center gap-2.5", className)}
      aria-label="Legacy Trust Bank home"
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-white shadow-sm">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5"
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
            "text-[10px] font-semibold uppercase tracking-[0.2em]",
            tone === "light" ? "text-white/70" : "text-ink-400",
          )}
        >
          Bank
        </span>
      </span>
    </Link>
  );
}
