import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import favicon from "@/assets/favicon.svg";

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
      <img
        src={favicon}
        alt=""
        aria-hidden="true"
        className="h-9 w-9 shrink-0 object-contain"
      />
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