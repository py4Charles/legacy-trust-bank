import { forwardRef, useId, type SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, hint, className, id, children, ...props }, ref) => {
    const generatedId = useId();
    const selectId = id ?? generatedId;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={selectId}
            className="mb-1.5 block text-sm font-medium text-ink-800"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            aria-invalid={Boolean(error)}
            className={cn(
              "h-11 w-full appearance-none rounded-xl border bg-white px-3.5 pr-10 text-sm text-ink-900 shadow-sm transition-all duration-200 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/15",
              error ? "border-negative-600" : "border-ink-200 hover:border-ink-300",
              className,
            )}
            {...props}
          >
            {children}
          </select>
          <svg
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400"
          >
            <path d="m5 7.5 5 5 5-5" />
          </svg>
        </div>
        {error ? (
          <p className="mt-1.5 text-sm text-negative-600">{error}</p>
        ) : hint ? (
          <p className="mt-1.5 text-sm text-ink-500">{hint}</p>
        ) : null}
      </div>
    );
  },
);

Select.displayName = "Select";