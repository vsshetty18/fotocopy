// ====================================================
// Search Page
// Search for a person by name, view matching photos.
// Debounced so it doesn't fire an API call on every
// keystroke.
// ====================================================

"use client";

import { useState, useEffect, useRef } from "react";
import { Search as SearchIcon } from "lucide-react";
import PhotoGrid from "@/components/people/PhotoGrid";
import EmptyState from "@/components/ui/EmptyState";
import Loader from "@/components/ui/Loader";
import Input from "@/components/ui/Input";
import { api, getErrorMessage } from "@/lib/api";
import { SearchResult, ApiResponse } from "@/types";

const DEBOUNCE_MS = 400;

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Clear any pending debounce timer on every keystroke
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (query.trim().length === 0) {
      setResults(null);
      setError("");
      return;
    }

    debounceRef.current = setTimeout(() => {
      performSearch(query.trim());
    }, DEBOUNCE_MS);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  async function performSearch(name: string) {
    setIsSearching(true);
    setError("");

    try {
      const response = await api.get<ApiResponse<SearchResult>>("/search", {
        params: { name },
      });
      setResults(response.data.data!);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSearching(false);
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground">Search</h1>
        <p className="text-sm text-muted mt-1">
          Find photos by the person&apos;s name
        </p>
      </div>

      <div className="max-w-md mb-8">
        <Input
          type="text"
          placeholder="Search by name (e.g. Vighnesh)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {isSearching && <Loader label="Searching..." />}

      {!isSearching && error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      {!isSearching && !error && query.trim().length === 0 && (
        <EmptyState
          icon={SearchIcon}
          title="Search for someone"
          description="Type a person's name above to find all photos they appear in."
        />
      )}

      {!isSearching && !error && results && (
        <>
          {results.photos.length === 0 ? (
            <EmptyState
              icon={SearchIcon}
              title="No matches found"
              description={`No people matching "${query}" were found. Try a different name, or rename people from the People page.`}
            />
          ) : (
            <>
              <p className="text-sm text-muted mb-4">
                {results.photos.length} photo{results.photos.length === 1 ? "" : "s"}{" "}
                found for &quot;{query}&quot;
              </p>
              <PhotoGrid photos={results.photos} />
            </>
          )}
        </>
      )}
    </div>
  );
}
