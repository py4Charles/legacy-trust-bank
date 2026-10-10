import { forwardRef, useId, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className, id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="mb-1.5 block text-sm font-medium text-ink-800"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          aria-invalid={Boolean(error)}
          className={cn(
            "h-11 w-full rounded-lg border bg-white px-3 text-sm text-ink-900 placeholder:text-ink-400",
            "focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500",
            error ? "border-negative-600" : "border-ink-300",
            className,
          )}
          {...props}
        />
        {error ? (
          <p className="mt-1.5 text-sm text-negative-600">{error}</p>
        ) : hint ? (
          <p className="mt-1.5 text-sm text-ink-500">{hint}</p>
        ) : null}
      </div>
    );
  },
);

Input.displayName = "Input";
