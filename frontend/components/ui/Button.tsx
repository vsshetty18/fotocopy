// ====================================================
// Button Component
// Reusable button with variants for the app's minimal,
// premium theme. Uses semantic color tokens so it
// automatically adapts to light/dark mode.
// ====================================================

"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          // Base styles — shared by every variant
          "inline-flex items-center justify-center gap-2 font-medium rounded-xl",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "transition-colors duration-150",

          // Size variants
          size === "sm" && "text-sm px-3 py-1.5",
          size === "md" && "text-sm px-4 py-2.5",
          size === "lg" && "text-base px-6 py-3",

          // Color variants
          variant === "primary" &&
            "bg-primary text-primary-foreground hover:opacity-90",
          variant === "secondary" &&
            "bg-card text-foreground border border-border hover:bg-border/40",
          variant === "ghost" &&
            "bg-transparent text-foreground hover:bg-card",
          variant === "danger" &&
            "bg-red-500 text-white hover:bg-red-600",

          className
        )}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
