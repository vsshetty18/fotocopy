// ====================================================
// Resize Panel Component
// Full self-contained tool: upload an image, choose a
// preset or custom dimensions, download the result.
// Self-contained (not split into a page + component)
// since Resize is a single-step utility with no history
// or extra state to lift up.
// ====================================================

"use client";

import { useState, ChangeEvent } from "react";
import { UploadCloud, Download, X } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { cn, downloadBlob } from "@/lib/utils";
import { api, getErrorMessage } from "@/lib/api";
import { ResizePreset } from "@/types";

const PRESETS: { value: ResizePreset; label: string }[] = [
  { value: "instagram", label: "Instagram" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "passport", label: "Passport" },
  { value: "square", label: "Square" },
  { value: "landscape", label: "Landscape" },
  { value: "portrait", label: "Portrait" },
];

export default function ResizePanel() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [preset, setPreset] = useState<ResizePreset | null>(null);
  const [customWidth, setCustomWidth] = useState("");
  const [customHeight, setCustomHeight] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");

  function handleFileSelect(e: ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    setPreviewUrl(URL.createObjectURL(selected));
  }

  function clearFile() {
    setFile(null);
    setPreviewUrl(null);
  }

  function selectPreset(value: ResizePreset) {
    setPreset(value);
    setCustomWidth("");
    setCustomHeight("");
  }

  function handleCustomDimensionChange(field: "width" | "height", value: string) {
    setPreset(null); // custom dimensions and presets are mutually exclusive
    if (field === "width") setCustomWidth(value);
    else setCustomHeight(value);
  }

  const canSubmit = file && (preset || (customWidth && customHeight));

  async function handleResize() {
    if (!file || !canSubmit) return;

    setError("");
    setIsProcessing(true);

    try {
      const formData = new FormData();
      formData.append("image", file);
      if (preset) {
        formData.append("preset", preset);
      } else {
        formData.append("width", customWidth);
        formData.append("height", customHeight);
      }

      const response = await api.post("/resize", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        responseType: "blob",
      });

      downloadBlob(new Blob([response.data]), "resized-image.jpg");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Upload */}
      {!previewUrl ? (
        <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-border rounded-card py-8 cursor-pointer hover:border-primary/50 transition-colors">
          <UploadCloud className="w-8 h-8 text-muted" />
          <span className="text-sm text-foreground">Click to upload an image</span>
          <input
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/webp"
            onChange={handleFileSelect}
            className="hidden"
          />
        </label>
      ) : (
        <div className="relative w-40 mx-auto">
          <div className="aspect-square rounded-xl overflow-hidden border border-border">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
          </div>
          <button
            onClick={clearFile}
            className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-card border border-border flex items-center justify-center text-foreground hover:bg-background"
            aria-label="Remove image"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Presets */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Choose a preset
        </label>
        <div className="grid grid-cols-3 gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.value}
              type="button"
              onClick={() => selectPreset(p.value)}
              className={cn(
                "py-2 px-3 rounded-xl border-2 text-sm font-medium transition-colors",
                preset === p.value
                  ? "border-primary bg-card text-foreground"
                  : "border-border text-muted hover:border-primary/50"
              )}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Custom dimensions */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Or enter custom dimensions (px)
        </label>
        <div className="grid grid-cols-2 gap-3">
          <Input
            type="number"
            placeholder="Width"
            value={customWidth}
            onChange={(e) => handleCustomDimensionChange("width", e.target.value)}
            min={1}
          />
          <Input
            type="number"
            placeholder="Height"
            value={customHeight}
            onChange={(e) => handleCustomDimensionChange("height", e.target.value)}
            min={1}
          />
        </div>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <Button className="w-full" onClick={handleResize} disabled={!canSubmit} isLoading={isProcessing}>
        <Download className="w-4 h-4" />
        Resize & Download
      </Button>
    </div>
  );
}
