import { IconImage, IconPerson } from "./icons";

interface PhotoSlotProps {
  /** Stable identifier kept from the design handoff for easy image replacement. */
  photo:
    | "head-office"
    | "founder"
    | "cofounder-one"
    | "cofounder-two"
    | "managing-director"
    | "biometric-banking"
    | "fintech-partnership"
    | "media-contact";
  /** Modifier class controlling size, background and crop treatment. */
  variant: string;
  ariaLabel: string;
  label?: string;
  sub?: string;
  note?: string;
  /** Large faint editorial index shown near the lower-left corner. */
  index?: string;
  icon?: "image" | "person";
  className?: string;
  /** Decorative registration corners and office line overlay (hero image). */
  crop?: boolean;
  officeLines?: boolean;
  /** Small portraits skip the centred label block. */
  compact?: boolean;
}

export function PhotoSlot({
  photo,
  variant,
  ariaLabel,
  label,
  sub,
  note,
  index,
  icon = "image",
  className,
  crop = false,
  officeLines = false,
  compact = false,
}: PhotoSlotProps) {
  const PlaceholderIcon = icon === "person" ? IconPerson : IconImage;
  const iconClass = icon === "person" ? "portrait-icon" : "placeholder-icon";

  return (
    <div
      className={["photo-slot", variant, className].filter(Boolean).join(" ")}
      role="img"
      aria-label={ariaLabel}
      data-photo={photo}
    >
      {crop && (
        <>
          <span className="slot-corner top-left" />
          <span className="slot-corner bottom-right" />
        </>
      )}
      {compact ? (
        <PlaceholderIcon className={iconClass} />
      ) : (
        <div className="slot-center">
          <PlaceholderIcon className={iconClass} />
          {label && <span>{label}</span>}
          {sub && <small>{sub}</small>}
        </div>
      )}
      {note && <span className="slot-note">{note}</span>}
      {index && <span className="photo-index">{index}</span>}
      {officeLines && <span className="office-lines" aria-hidden="true" />}
    </div>
  );
}
