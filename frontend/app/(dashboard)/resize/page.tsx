// ====================================================
// Resize Page
// Thin wrapper — all logic lives in ResizePanel.
// ====================================================

import Card from "@/components/ui/Card";
import ResizePanel from "@/components/tools/ResizePanel";

export default function ResizePage() {
  return (
    <div className="max-w-xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground">Image Resize</h1>
        <p className="text-sm text-muted mt-1">
          Resize to a common preset or enter custom dimensions
        </p>
      </div>

      <Card>
        <ResizePanel />
      </Card>
    </div>
  );
}
