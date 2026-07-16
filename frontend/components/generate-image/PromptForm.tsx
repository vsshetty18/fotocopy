// ====================================================
// Prompt Form Component
// Text input + generate button for the AI Image
// Generation feature.
// ====================================================

"use client";

import { FormEvent } from "react";
import { Sparkles } from "lucide-react";
import Button from "@/components/ui/Button";

interface PromptFormProps {
  prompt: string;
  onPromptChange: (value: string) => void;
  onSubmit: () => void;
  isGenerating: boolean;
}

const MAX_LENGTH = 1000;

export default function PromptForm({
  prompt,
  onPromptChange,
  onSubmit,
  isGenerating,
}: PromptFormProps) {
  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (prompt.trim().length === 0 || isGenerating) return;
    onSubmit();
  }

  return (
    <form onSubmit={handleSubmit}>
      <label className="block text-sm font-medium text-foreground mb-1.5">
        Describe the image you want to create
      </label>
      <textarea
        value={prompt}
        onChange={(e) => onPromptChange(e.target.value)}
        maxLength={MAX_LENGTH}
        rows={4}
        placeholder="A serene mountain lake at sunrise, photorealistic, soft golden light..."
        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors resize-none"
      />

      <div className="flex items-center justify-between mt-2">
        <p className="text-xs text-muted">
          {prompt.length}/{MAX_LENGTH}
        </p>
        <Button
          type="submit"
          disabled={prompt.trim().length === 0}
          isLoading={isGenerating}
        >
          <Sparkles className="w-4 h-4" />
          {isGenerating ? "Generating..." : "Generate Image"}
        </Button>
      </div>
    </form>
  );
}
