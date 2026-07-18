// ====================================================
// Convert Panel Component
// Full self-contained tool: upload an image, choose a
// target format, download the converted result.
// ====================================================

"use client";

import { useState, ChangeEvent } from "react";
import { UploadCloud, Download, X } from "lucide-react";
import Button from "@/components/ui/Button";
import { cn, downloadBlob } from "@/lib/utils";
import { api, getErrorMessage } from "@/lib/api";
import { ImageFormat } from "@/types";

const FORMATS: { value: ImageFormat; label: string }[] = [
  { value: "png", label: "PNG" },
  { value: "jpg", label: "JPG" },
  { value: "jpeg", label: "JPEG" },
  { value: "webp", label: "WEBP" },
];

export default function ConvertPanel() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [format, setFormat] = useState<ImageFormat | null>(null);
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

  const canSubmit = file && format;

  async function handleConvert() {
    if (!file || !format) return;

    setError("");
    setIsProcessing(true);

    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("format", format);

      const response = await api.post("/convert", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        responseType: "blob",
      });

      downloadBlob(new Blob([response.data]), `converted-image.${format}`);
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

      {/* Format selector */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Convert to
        </label>
        <div className="grid grid-cols-4 gap-2">
          {FORMATS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setFormat(f.value)}
              className={cn(
                "py-2 px-3 rounded-xl border-2 text-sm font-medium transition-colors",
                format === f.value
                  ? "border-primary bg-card text-foreground"
                  : "border-border text-muted hover:border-primary/50"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <Button className="w-full" onClick={handleConvert} disabled={!canSubmit} isLoading={isProcessing}>
        <Download className="w-4 h-4" />
        Convert & Download
      </Button>
    </div>
  );
}
