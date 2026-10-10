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
            "h-11 w-full rounded-xl border bg-white px-3.5 text-sm text-ink-900 shadow-sm transition-all duration-200 placeholder:text-ink-400",
            "focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/15",
            error ? "border-negative-600" : "border-ink-200 hover:border-ink-300",
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