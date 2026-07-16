// ====================================================
// Upload Dropzone Component
// Drag-and-drop + click-to-browse multi-image selector.
// Hand-rolled with native HTML5 drag events — no extra
// dependency needed for this.
// ====================================================

"use client";

import { useState, useRef, DragEvent, ChangeEvent } from "react";
import { UploadCloud, X, ImageIcon } from "lucide-react";
import { cn, formatFileSize } from "@/lib/utils";

interface UploadDropzoneProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
  maxFiles?: number;
}

const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/webp"];

export default function UploadDropzone({
  files,
  onFilesChange,
  maxFiles = 20,
}: UploadDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function addFiles(newFiles: FileList | File[]) {
    const validFiles = Array.from(newFiles).filter((file) =>
      ACCEPTED_TYPES.includes(file.type)
    );
    const combined = [...files, ...validFiles].slice(0, maxFiles);
    onFilesChange(combined);
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) {
      addFiles(e.dataTransfer.files);
    }
  }

  function handleFileInput(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      addFiles(e.target.files);
    }
    // Reset input so selecting the same file again re-triggers onChange
    e.target.value = "";
  }

  function removeFile(index: number) {
    onFilesChange(files.filter((_, i) => i !== index));
  }

  return (
    <div>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={cn(
          "border-2 border-dashed rounded-card p-10 text-center cursor-pointer transition-colors",
          isDragging
            ? "border-primary bg-card"
            : "border-border hover:border-primary/50 hover:bg-card"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={ACCEPTED_TYPES.join(",")}
          onChange={handleFileInput}
          className="hidden"
        />
        <UploadCloud className="w-10 h-10 text-muted mx-auto mb-3" />
        <p className="text-sm font-medium text-foreground mb-1">
          Drag and drop photos here, or click to browse
        </p>
        <p className="text-xs text-muted">
          PNG, JPG, or WEBP — up to {maxFiles} images at once
        </p>
      </div>

      {/* Selected files preview */}
      {files.length > 0 && (
        <div className="mt-4">
          <p className="text-sm text-muted mb-2">
            {files.length} photo{files.length === 1 ? "" : "s"} selected
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            {files.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="relative aspect-square rounded-xl overflow-hidden bg-card border border-border group"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(index);
                  }}
                  className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label={`Remove ${file.name}`}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
                <div className="absolute inset-x-0 bottom-0 bg-black/60 px-1.5 py-1">
                  <p className="text-[10px] text-white truncate">
                    {formatFileSize(file.size)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
