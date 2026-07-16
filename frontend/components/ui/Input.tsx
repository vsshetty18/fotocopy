// ====================================================
// Input Component
// Reusable text input with label + error message
// support, styled consistently with the app's theme.
// ====================================================

import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    // Auto-generate an id from the label if none provided,
    // so <label htmlFor> always correctly links to the input
    // (accessibility — clicking the label focuses the input).
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-foreground mb-1.5"
          >
            {label}
          </label>
        )}

        <input
          ref={ref}
          id={inputId}
          className={cn(
            "w-full rounded-xl border bg-background px-4 py-2.5 text-sm text-foreground",
            "placeholder:text-muted",
            "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
            "transition-colors duration-150",
            error ? "border-red-500" : "border-border",
            props.disabled && "opacity-50 cursor-not-allowed",
            className
          )}
          {...props}
        />

        {error && (
          <p className="mt-1.5 text-sm text-red-500">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
