// ====================================================
// Upload Page
// Select multiple images, upload them, and show results
// (including how many faces were detected per photo).
// ====================================================

"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Users } from "lucide-react";
import UploadDropzone from "@/components/upload/UploadDropzone";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { api, getErrorMessage } from "@/lib/api";
import { ApiResponse, UploadResult } from "@/types";

export default function UploadPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const [results, setResults] = useState<UploadResult[] | null>(null);

  async function handleUpload() {
    if (files.length === 0) return;

    setError("");
    setIsUploading(true);
    setResults(null);

    try {
      const formData = new FormData();
      files.forEach((file) => formData.append("images", file));

      const response = await api.post<ApiResponse<{ images: UploadResult[] }>>(
        "/upload",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setResults(response.data.data!.images);
      setFiles([]);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsUploading(false);
    }
  }

  const totalFacesDetected = results?.reduce((sum, r) => sum + r.facesDetected, 0) ?? 0;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground">Upload Photos</h1>
        <p className="text-sm text-muted mt-1">
          Photos are automatically scanned for faces and grouped into people
        </p>
      </div>

      <Card>
        <UploadDropzone files={files} onFilesChange={setFiles} />

        {error && <p className="text-sm text-red-500 mt-4">{error}</p>}

        <div className="flex justify-end mt-5">
          <Button
            onClick={handleUpload}
            disabled={files.length === 0}
            isLoading={isUploading}
          >
            {isUploading
              ? "Uploading..."
              : `Upload ${files.length || ""} photo${files.length === 1 ? "" : "s"}`}
          </Button>
        </div>
      </Card>

      {/* Upload results */}
      {results && results.length > 0 && (
        <Card className="mt-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-background border border-border flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-medium text-foreground">
                {results.length} photo{results.length === 1 ? "" : "s"} uploaded successfully
              </p>
              <p className="text-sm text-muted mt-0.5">
                {totalFacesDetected > 0
                  ? `${totalFacesDetected} face${totalFacesDetected === 1 ? "" : "s"} detected across your photos.`
                  : "No faces were detected in these photos."}
              </p>
              {totalFacesDetected > 0 && (
                <Link
                  href="/people"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground hover:underline mt-3"
                >
                  <Users className="w-4 h-4" />
                  View People
                </Link>
              )}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
