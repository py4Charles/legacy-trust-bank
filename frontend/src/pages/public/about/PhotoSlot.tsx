import { cn } from "@/lib/utils";
import { IconImage, IconPerson } from "./icons";

interface PhotoSlotProps {
  ariaLabel: string;
  label?: string;
  sub?: string;
  note?: string;
  /** Large faint editorial index shown near the lower-left corner. */
  index?: string;
  icon?: "image" | "person";
  className?: string;
  /** Small portraits skip the centred label block. */
  compact?: boolean;
}

export function PhotoSlot({
  ariaLabel,
  label,
  sub,
  note,
  index,
  icon = "image",
  className,
  compact = false,
}: PhotoSlotProps) {
  const PlaceholderIcon = icon === "person" ? IconPerson : IconImage;

  return (
    <div
      role="img"
      aria-label={ariaLabel}
      className={cn(
        "relative flex items-center justify-center overflow-hidden rounded-2xl border border-dashed border-ink-200 bg-ink-100 text-ink-400",
        className,
      )}
    >
      {compact ? (
        <PlaceholderIcon className="h-10 w-10 opacity-60" />
      ) : (
        <div className="flex flex-col items-center px-6 py-8 text-center">
          <PlaceholderIcon className="mb-3 h-12 w-12 opacity-60" />
          {label && (
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-500">
              {label}
            </span>
          )}
          {sub && <small className="mt-1.5 text-xs text-ink-400">{sub}</small>}
        </div>
      )}
      {index && (
        <span className="pointer-events-none absolute bottom-3 left-4 font-display text-5xl font-bold leading-none text-brand-600/20">
          {index}
        </span>
      )}
      {note && (
        <span className="absolute bottom-3 right-4 text-[10px] font-medium uppercase tracking-wide text-ink-400">
          {note}
        </span>
      )}
    </div>
  );
}
