import { forwardRef, type ButtonHTMLAttributes } from "react";
import { buttonClass } from "./buttonStyles";

type Variant =
  | "primary"
  | "secondary"
  | "outline"
  | "outlineLight"
  | "white"
  | "onbrand"
  | "ghost"
  | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", className, type, ...props }, ref) => (
    <button
      ref={ref}
      type={type ?? "button"}
      className={buttonClass(variant, size, className)}
      {...props}
    />
  ),
);

Button.displayName = "Button";
