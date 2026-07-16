// ====================================================
// Layout Selector Component
// Lets the user pick how many copies (4/6/8/16) to
// place on the printable A4 sheet.
// ====================================================

"use client";

import { cn } from "@/lib/utils";
import { CopyCount } from "@/types";

interface LayoutSelectorProps {
  value: CopyCount | null;
  onChange: (value: CopyCount) => void;
}

const OPTIONS: { copies: CopyCount; grid: string }[] = [
  { copies: 4, grid: "2 × 2" },
  { copies: 6, grid: "3 × 2" },
  { copies: 8, grid: "4 × 2" },
  { copies: 16, grid: "4 × 4" },
];

export default function LayoutSelector({ value, onChange }: LayoutSelectorProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-2">
        Number of copies
      </label>
      <div className="grid grid-cols-4 gap-3">
        {OPTIONS.map((option) => {
          const isSelected = value === option.copies;
          return (
            <button
              key={option.copies}
              type="button"
              onClick={() => onChange(option.copies)}
              className={cn(
                "flex flex-col items-center justify-center gap-1 py-4 rounded-xl border-2 transition-colors",
                isSelected
                  ? "border-primary bg-card"
                  : "border-border hover:border-primary/50"
              )}
            >
              <span className="text-lg font-semibold text-foreground">
                {option.copies}
              </span>
              <span className="text-xs text-muted">{option.grid}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
