// ====================================================
// People Page
// Grid of all detected people (Google Photos style),
// each showing their cover photo, name, and photo count.
// ====================================================

"use client";

import { useEffect, useState } from "react";
import { Users } from "lucide-react";
import PersonCard from "@/components/people/PersonCard";
import EmptyState from "@/components/ui/EmptyState";
import Loader from "@/components/ui/Loader";
import { api, getErrorMessage } from "@/lib/api";
import { Person, ApiResponse } from "@/types";

export default function PeoplePage() {
  const [people, setPeople] = useState<Person[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchPeople() {
      try {
        const response = await api.get<ApiResponse<{ people: Person[] }>>(
          "/people"
        );
        setPeople(response.data.data!.people);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setIsLoading(false);
      }
    }
    fetchPeople();
  }, []);

  if (isLoading) return <Loader fullScreen label="Finding people in your photos..." />;

  if (error) {
    return (
      <div className="max-w-lg mx-auto mt-12 text-center">
        <p className="text-sm text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground">People</h1>
        <p className="text-sm text-muted mt-1">
          Photos are automatically grouped by the people in them
        </p>
      </div>

      {people.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No people found yet"
          description="Upload some photos with faces in them, and PhotoAI Studio will automatically group them by person."
          actionLabel="Upload photos"
          onAction={() => (window.location.href = "/upload")}
        />
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-5">
          {people.map((person) => (
            <PersonCard key={person.id} person={person} />
          ))}
        </div>
      )}
    </div>
  );
}
