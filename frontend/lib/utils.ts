// ====================================================
// General Utility Functions
// Small shared helpers used across components.
// ====================================================

import { type ClassValue, clsx } from "clsx";

/**
 * Merge conditional class names cleanly.
 * Usage: cn("px-4 py-2", isActive && "bg-primary", className)
 */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}

/**
 * Format a date string/Date into a readable, compact form.
 * e.g. "Jul 16, 2026"
 */
export function formatDate(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Format a date into a relative "time ago" string.
 * e.g. "2 hours ago", "3 days ago"
 * Falls back to formatDate() for anything older than 30 days.
 */
export function timeAgo(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const seconds = Math.floor((Date.now() - d.getTime()) / 1000);

  const intervals: [number, string][] = [
    [60, "second"],
    [60, "minute"],
    [24, "hour"],
    [30, "day"],
  ];

  let unit = "second";
  let value = seconds;
  let divisor = 1;

  for (const [amount, label] of intervals) {
    if (value < amount) {
      unit = label;
      break;
    }
    value = Math.floor(value / amount);
    divisor *= amount;
    unit = label;
  }

  if (divisor > 60 * 60 * 24 * 30) {
    return formatDate(d);
  }

  return value <= 1 ? `just now` : `${value} ${unit}${value === 1 ? "" : "s"}`;
}

/**
 * Truncate long text with an ellipsis — used for prompts
 * in the Generate Image history, long file names, etc.
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
}

/**
 * Format bytes into a human-readable file size.
 * e.g. 1048576 -> "1 MB"
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
}

/**
 * Trigger a browser download for a Blob (used after
 * fetching resize/convert/background-removal results,
 * which stream back as raw file blobs, not JSON).
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}
