// ====================================================
// Generate Image Page
// Text-to-image generation via OpenAI, with a history
// of previously generated images below.
// ====================================================

"use client";

import { useState, useEffect } from "react";
import { Download, Sparkles } from "lucide-react";
import PromptForm from "@/components/generate-image/PromptForm";
import Card from "@/components/ui/Card";
import EmptyState from "@/components/ui/EmptyState";
import Loader from "@/components/ui/Loader";
import { api, getErrorMessage } from "@/lib/api";
import { GeneratedImage, ApiResponse } from "@/types";

export default function GenerateImagePage() {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");

  const [history, setHistory] = useState<GeneratedImage[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  async function fetchHistory() {
    try {
      const response = await api.get<ApiResponse<{ images: GeneratedImage[] }>>(
        "/generate"
      );
      setHistory(response.data.data!.images);
    } catch (err) {
      // History failing to load isn't critical — the generate
      // form still works, so we don't block the page on this.
      console.error(getErrorMessage(err));
    } finally {
      setIsLoadingHistory(false);
    }
  }

  async function handleGenerate() {
    setError("");
    setIsGenerating(true);

    try {
      const response = await api.post<ApiResponse<GeneratedImage>>("/generate", {
        prompt,
      });
      const newImage = response.data.data!;
      // Prepend the new image to history immediately — no refetch needed
      setHistory((prev) => [newImage, ...prev]);
      setPrompt("");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground">Generate Image</h1>
        <p className="text-sm text-muted mt-1">
          Describe an image and let AI create it for you
        </p>
      </div>

      <Card>
        <PromptForm
          prompt={prompt}
          onPromptChange={setPrompt}
          onSubmit={handleGenerate}
          isGenerating={isGenerating}
        />
        {error && <p className="text-sm text-red-500 mt-3">{error}</p>}
      </Card>

      {/* History */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Your generated images
        </h2>

        {isLoadingHistory ? (
          <Loader label="Loading history..." />
        ) : history.length === 0 ? (
          <EmptyState
            icon={Sparkles}
            title="No images generated yet"
            description="Your generated images will appear here once you create your first one."
          />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {history.map((image) => (
              <Card key={image.id} padded={false} className="overflow-hidden">
                <div className="aspect-square bg-background">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image.url}
                    alt={image.prompt}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-3">
                  <p className="text-xs text-muted line-clamp-2 mb-2">
                    {image.prompt}
                  </p>
                  
                    href={image.url}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-foreground hover:underline"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download
                  </a>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
