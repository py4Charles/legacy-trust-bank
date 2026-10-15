import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import woman from "@/assets/woman.png";

interface LogoProps {
  className?: string;
  tone?: "dark" | "light";
}

export function Woman({ className }: LogoProps) {
  return (
    <Link
      to="/"
      className={cn("group inline-flex items-center gap-2.5", className)}
      aria-label="Legacy Trust Bank home"
    >
      <img
        src={woman}
        alt=""
        aria-hidden="true"
        className="h-9 w-9 shrink-0 object-contain"
      />
    </Link>
  );
}