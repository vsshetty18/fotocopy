// ====================================================
// Background Remover Page
// Upload an image, remove its background, preview the
// transparent result, download as PNG.
// Self-contained (not split into a separate panel
// component) since this is the only page using this
// exact flow — no reuse benefit to extracting it yet.
// ====================================================

"use client";

import { useState, ChangeEvent } from "react";
import { UploadCloud, Download, X, Eraser } from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { downloadBlob } from "@/lib/utils";
import { api, getErrorMessage } from "@/lib/api";

// Simple checkered pattern (inline SVG data URL) to visually
// indicate transparency in the result preview — standard
// convention for showing transparent PNGs.
const CHECKERED_BG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16'%3E%3Crect width='8' height='8' fill='%23e5e7eb'/%3E%3Crect x='8' y='8' width='8' height='8' fill='%23e5e7eb'/%3E%3C/svg%3E";

export default function BackgroundRemoverPage() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");

  function handleFileSelect(e: ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    setPreviewUrl(URL.createObjectURL(selected));
    setResultUrl(null);
  }

  function clearFile() {
    setFile(null);
    setPreviewUrl(null);
    setResultUrl(null);
  }

  async function handleRemoveBackground() {
    if (!file) return;

    setError("");
    setIsProcessing(true);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await api.post("/background", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        responseType: "blob",
      });

      const blob = new Blob([response.data], { type: "image/png" });
      setResultUrl(URL.createObjectURL(blob));
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsProcessing(false);
    }
  }

  function handleDownload() {
    if (!resultUrl) return;
    fetch(resultUrl)
      .then((res) => res.blob())
      .then((blob) => downloadBlob(blob, "background-removed.png"));
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground">
          Background Remover
        </h1>
        <p className="text-sm text-muted mt-1">
          Remove the background from any photo — download as transparent PNG
        </p>
      </div>

      <Card>
        {!previewUrl ? (
          <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-border rounded-card py-10 cursor-pointer hover:border-primary/50 transition-colors">
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
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              {/* Original */}
              <div>
                <p className="text-xs text-muted mb-1.5 text-center">Original</p>
                <div className="relative aspect-square rounded-xl overflow-hidden border border-border">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={previewUrl} alt="Original" className="w-full h-full object-cover" />
                </div>
              </div>

              {/* Result */}
              <div>
                <p className="text-xs text-muted mb-1.5 text-center">Result</p>
                <div
                  className="relative aspect-square rounded-xl overflow-hidden border border-border"
                  style={
                    resultUrl
                      ? { backgroundImage: `url(${CHECKERED_BG})`, backgroundRepeat: "repeat" }
                      : undefined
                  }
                >
                  {resultUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={resultUrl} alt="Background removed" className="w-full h-full object-contain" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-card">
                      <Eraser className="w-6 h-6 text-muted" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <div className="flex gap-3">
              <Button variant="secondary" onClick={clearFile}>
                <X className="w-4 h-4" />
                Start over
              </Button>
              {!resultUrl ? (
                <Button
                  className="flex-1"
                  onClick={handleRemoveBackground}
                  isLoading={isProcessing}
                >
                  <Eraser className="w-4 h-4" />
                  Remove Background
                </Button>
              ) : (
                <Button className="flex-1" onClick={handleDownload}>
                  <Download className="w-4 h-4" />
                  Download PNG
                </Button>
              )}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
