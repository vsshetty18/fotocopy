// ====================================================
// Passport Photo Generator Page
// Upload one passport photo, choose copy count, generate
// a printable A4 sheet, download as PNG or PDF.
// ====================================================

"use client";

import { useState, ChangeEvent } from "react";
import { UploadCloud, Download, X } from "lucide-react";
import LayoutSelector from "@/components/passport-photo/LayoutSelector";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { api, getErrorMessage } from "@/lib/api";
import { ApiResponse, PassportSheet, CopyCount } from "@/types";

export default function PassportPhotoPage() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [copies, setCopies] = useState<CopyCount | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<PassportSheet | null>(null);

  function handleFileSelect(e: ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    setPreviewUrl(URL.createObjectURL(selected));
    setResult(null);
  }

  function clearFile() {
    setFile(null);
    setPreviewUrl(null);
  }

  async function handleGenerate() {
    if (!file || !copies) return;

    setError("");
    setIsGenerating(true);

    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("copies", String(copies));

      const response = await api.post<ApiResponse<PassportSheet>>(
        "/passport",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setResult(response.data.data!);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsGenerating(false);
    }
  }

  async function handleDownload(format: "png" | "pdf") {
    if (!result) return;
    try {
      const response = await api.get(
        `/passport/${result.id}/download?format=${format}`,
        { responseType: "blob" }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.download = `passport-sheet.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground">
          Passport Photo Generator
        </h1>
        <p className="text-sm text-muted mt-1">
          Upload one photo, choose a layout, get a printable A4 sheet
        </p>
      </div>

      <Card className="space-y-6">
        {/* Photo upload */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Passport photo
          </label>
          {!previewUrl ? (
            <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-border rounded-card py-8 cursor-pointer hover:border-primary/50 transition-colors">
              <UploadCloud className="w-8 h-8 text-muted" />
              <span className="text-sm text-foreground">Click to upload a photo</span>
              <input
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                onChange={handleFileSelect}
                className="hidden"
              />
            </label>
          ) : (
            <div className="relative w-32 mx-auto">
              <div className="aspect-[35/45] rounded-xl overflow-hidden border border-border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={previewUrl} alt="Passport photo preview" className="w-full h-full object-cover" />
              </div>
              <button
                onClick={clearFile}
                className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-card border border-border flex items-center justify-center text-foreground hover:bg-background"
                aria-label="Remove photo"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Copy count selector */}
        <LayoutSelector value={copies} onChange={setCopies} />

        {error && <p className="text-sm text-red-500">{error}</p>}

        <Button
          className="w-full"
          onClick={handleGenerate}
          disabled={!file || !copies}
          isLoading={isGenerating}
        >
          Generate Sheet
        </Button>
      </Card>

      {/* Result */}
      {result && (
        <Card className="mt-6">
          <p className="font-medium text-foreground mb-4">
            Your sheet is ready ({result.copies} copies)
          </p>
          <div className="aspect-[210/297] max-w-xs mx-auto rounded-xl overflow-hidden border border-border mb-5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={result.sheetUrl} alt="Passport sheet" className="w-full h-full object-cover" />
          </div>
          <div className="flex gap-3 justify-center">
            <Button variant="secondary" onClick={() => handleDownload("png")}>
              <Download className="w-4 h-4" />
              PNG
            </Button>
            <Button variant="secondary" onClick={() => handleDownload("pdf")}>
              <Download className="w-4 h-4" />
              PDF
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
