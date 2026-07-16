// ====================================================
// Loader Component
// Full-section loading spinner — used while pages fetch
// their initial data (dashboard stats, people list, etc).
// ====================================================

import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoaderProps {
  size?: "sm" | "md" | "lg";
  fullScreen?: boolean;
  label?: string;
}

const SIZE_MAP = {
  sm: "w-5 h-5",
  md: "w-8 h-8",
  lg: "w-12 h-12",
};

export default function Loader({
  size = "md",
  fullScreen = false,
  label,
}: LoaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 text-muted",
        fullScreen ? "min-h-[60vh]" : "py-12"
      )}
    >
      <Loader2 className={cn(SIZE_MAP[size], "animate-spin text-primary")} />
      {label && <p className="text-sm">{label}</p>}
    </div>
  );
}
