// ====================================================
// Modal Component
// Simple centered dialog — used for renaming a person,
// confirming actions, and viewing a full-size photo.
// No external dependency (no Radix/Headless UI) to keep
// the project lightweight, per the spec's constraints.
// ====================================================

"use client";

import { useEffect, ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  className,
}: ModalProps) {
  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      // Prevent background scroll while modal is open
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
    >
      {/* Backdrop — click to close */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal content */}
      <div
        className={cn(
          "relative bg-card border border-border rounded-card shadow-card-dark",
          "w-full max-w-md p-6",
          "animate-in fade-in zoom-in-95 duration-150",
          className
        )}
      >
        <div className="flex items-center justify-between mb-4">
          {title && (
            <h2 id="modal-title" className="text-lg font-semibold text-foreground">
              {title}
            </h2>
          )}
          <button
            onClick={onClose}
            className="ml-auto p-1 rounded-lg text-muted hover:bg-background hover:text-foreground transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}
