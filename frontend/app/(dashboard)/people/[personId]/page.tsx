// ====================================================
// Person Detail Page
// Shows all photos containing a specific person, with
// an inline rename option.
// ====================================================

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Pencil, Image as ImageIcon } from "lucide-react";
import PhotoGrid from "@/components/people/PhotoGrid";
import EmptyState from "@/components/ui/EmptyState";
import Loader from "@/components/ui/Loader";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { api, getErrorMessage } from "@/lib/api";
import { PersonDetail, ApiResponse } from "@/types";

export default function PersonDetailPage() {
  const params = useParams();
  const router = useRouter();
  const personId = params.personId as string;

  const [detail, setDetail] = useState<PersonDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Rename modal state
  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameError, setRenameError] = useState("");

  useEffect(() => {
    fetchPersonDetail();
  }, [personId]);

  async function fetchPersonDetail() {
    setIsLoading(true);
    try {
      const response = await api.get<ApiResponse<PersonDetail>>(
        `/people/${personId}`
      );
      setDetail(response.data.data!);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }

  function openRenameModal() {
    setNewName(detail?.person.name || "");
    setRenameError("");
    setIsRenameOpen(true);
  }

  async function handleRename() {
    if (!newName.trim()) {
      setRenameError("Name cannot be empty");
      return;
    }

    setIsRenaming(true);
    setRenameError("");

    try {
      await api.patch(`/people/${personId}`, { name: newName.trim() });
      setDetail((prev) =>
        prev ? { ...prev, person: { ...prev.person, name: newName.trim() } } : prev
      );
      setIsRenameOpen(false);
    } catch (err) {
      setRenameError(getErrorMessage(err));
    } finally {
      setIsRenaming(false);
    }
  }

  if (isLoading) return <Loader fullScreen label="Loading photos..." />;

  if (error || !detail) {
    return (
      <div className="max-w-lg mx-auto mt-12 text-center">
        <p className="text-sm text-red-500">{error || "Person not found"}</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <button
        onClick={() => router.push("/people")}
        className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground mb-4 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to People
      </button>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            {detail.person.name}
          </h1>
          <p className="text-sm text-muted mt-1">
            {detail.photos.length} photo{detail.photos.length === 1 ? "" : "s"}
          </p>
        </div>
        <Button variant="secondary" size="sm" onClick={openRenameModal}>
          <Pencil className="w-3.5 h-3.5" />
          Rename
        </Button>
      </div>

      {detail.photos.length === 0 ? (
        <EmptyState
          icon={ImageIcon}
          title="No photos found"
          description="This person doesn't have any photos linked yet."
        />
      ) : (
        <PhotoGrid photos={detail.photos} />
      )}

      {/* Rename Modal */}
      <Modal
        isOpen={isRenameOpen}
        onClose={() => setIsRenameOpen(false)}
        title="Rename person"
      >
        <div className="space-y-4">
          <Input
            label="Name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            error={renameError}
            autoFocus
          />
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setIsRenameOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleRename} isLoading={isRenaming}>
              Save
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
