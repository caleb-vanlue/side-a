"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import ReleaseGrid from "./ReleaseGrid";
import CollectionControls from "./CollectionControls";
import { COLLECTION_SORT_OPTIONS, PAGE_SIZE_OPTIONS } from "./CollectionContext";

interface Release {
  id: number;
  title: string;
  year: number;
  thumb: string;
  cover_image: string;
  artists: Array<{ name: string; anv: string }>;
  labels: Array<{ name: string; catno: string }>;
  formats: Array<{
    name: string;
    qty: string;
    descriptions: string[];
    text?: string;
  }>;
  genres: string[];
  styles: string[];
}

interface SearchResult {
  id: number;
  title: string;
  year: number;
  thumb: string;
  cover_image: string;
  artists: Array<{ name: string; anv: string }>;
  labels: Array<{ name: string; catno: string }>;
  formats: Array<{
    name: string;
    qty: string;
    descriptions: string[];
    text?: string;
  }>;
  genres: string[];
  styles: string[];
}

interface SuggestedItem {
  id: number;
  instance_id?: number;
  rating: number;
  notes: string;
  basic_information: Release;
}

export default function SuggestionsTab() {
  const [suggestions, setSuggestions] = useState<SuggestedItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [totalItems, setTotalItems] = useState(0);
  const [sortValue, setSortValue] = useState("added");
  
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [suggestingId, setSuggestingId] = useState<number | null>(null);

  const fetchSuggestions = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const offset = (page - 1) * pageSize;
      const sortOption = COLLECTION_SORT_OPTIONS.find(opt => opt.value === sortValue);
      const sortBy = mapSortField(sortValue);
      // Flip sort order for year sorting to match expected behavior
      const sortOrder = sortOption?.sort === "year" 
        ? (sortOption.order === "desc" ? "asc" : "desc")
        : sortOption?.order || "desc";
      
      const response = await fetch(
        `/api/discogs/suggestions?limit=${pageSize}&offset=${offset}&sort_by=${sortBy}&sort_order=${sortOrder}`
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch suggestions: ${response.statusText}`);
      }
      
      const data = await response.json();
      setSuggestions(data.releases || []);
      setTotalPages(data.pagination?.pages || 1);
      setTotalItems(data.pagination?.items || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch suggestions");
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, sortValue]);

  const searchReleases = async () => {
    if (!searchQuery.trim()) return;
    
    setSearchLoading(true);
    setSearchError(null);
    
    try {
      const response = await fetch(
        `/api/discogs/search?q=${encodeURIComponent(searchQuery)}&type=release`
      );
      
      if (!response.ok) {
        throw new Error(`Search failed: ${response.statusText}`);
      }
      
      const data = await response.json();
      setSearchResults(data.results || []);
    } catch (err) {
      setSearchError(err instanceof Error ? err.message : "Search failed");
    } finally {
      setSearchLoading(false);
    }
  };

  const suggestRelease = async (releaseId: number) => {
    setSuggestingId(releaseId);
    try {
      const response = await fetch("/api/discogs/suggest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ releaseId }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to suggest release: ${response.statusText}`);
      }
      
      // Refresh suggestions list
      await fetchSuggestions();
      
      // Show success toast
      toast.success("Album suggested! Thanks for the recommendation! :)");
      
      // Close search and clear results
      setShowSearch(false);
      setSearchQuery("");
      setSearchResults([]);
    } catch (err) {
      console.error("Failed to suggest release:", err);
    } finally {
      setSuggestingId(null);
    }
  };

  const handleSortChange = (newSortValue: string) => {
    setSortValue(newSortValue);
    setPage(1);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(1);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    searchReleases();
  };

  useEffect(() => {
    fetchSuggestions();
  }, [fetchSuggestions]);

  const mapSortField = (sort: string): string => {
    const sortMappings: Record<string, string> = {
      added: "dateAdded",
      artist: "primaryArtist",
      title: "title",
      year: "year",
      rating: "dateAdded",
      genre: "primaryGenre",
      format: "primaryFormat",
    };
    return sortMappings[sort] || "dateAdded";
  };

  // Add simple error boundary
  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">Error loading suggestions: {error}</p>
        <button 
          onClick={() => {
            setError(null);
            fetchSuggestions();
          }}
          className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="mb-6">
        <CollectionControls
          sortValue={sortValue}
          pageSize={pageSize}
          totalItems={totalItems}
          sortOptions={COLLECTION_SORT_OPTIONS}
          pageSizeOptions={PAGE_SIZE_OPTIONS}
          onSortChange={handleSortChange}
          onPageSizeChange={handlePageSizeChange}
        />
        
        <div className="mt-4">
          {!showSearch ? (
            <button
              onClick={() => setShowSearch(true)}
              className="w-full sm:w-auto px-4 sm:px-6 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-all duration-200 shadow-sm hover:shadow-md text-sm sm:text-base"
            >
              Suggest an Album
            </button>
          ) : (
            <div className="bg-white/60 backdrop-blur-sm p-4 sm:p-6 rounded-lg border border-white/40 shadow-sm">
              <form onSubmit={handleSearchSubmit} className="mb-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for an album to suggest..."
                    className="flex-1 px-3 sm:px-4 py-2 border border-gray-300/60 rounded-md bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm sm:text-base"
                    autoFocus
                  />
                  <div className="flex gap-2 sm:gap-3">
                    <button
                      type="submit"
                      disabled={searchLoading || !searchQuery.trim()}
                      className="flex-1 sm:flex-none px-4 sm:px-6 py-2 bg-emerald-600 text-white rounded-md font-medium hover:bg-emerald-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 text-sm sm:text-base"
                    >
                      {searchLoading ? "Searching..." : "Search"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowSearch(false);
                        setSearchQuery("");
                        setSearchResults([]);
                      }}
                      className="px-3 sm:px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors text-sm sm:text-base"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
              
              {searchError && (
                <div className="text-red-600 text-sm mb-4">{searchError}</div>
              )}
              
              {searchResults.length > 0 && (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {searchResults.map((result) => (
                    <div
                      key={result.id}
                      className="flex items-start gap-3 sm:gap-4 p-3 bg-white/50 rounded-lg border border-white/30"
                    >
                      <Image
                        src={result.thumb || "/record.png"}
                        alt={result.title}
                        width={64}
                        height={64}
                        className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded flex-shrink-0"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/record.png";
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 text-sm sm:text-base line-clamp-2 leading-tight">
                          {result.title}
                        </h4>
                        <p className="text-xs sm:text-sm text-gray-600 line-clamp-1 mt-1">
                          {result.artists?.map(artist => artist.name).join(", ")}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-500 mt-0.5">{result.year}</p>
                      </div>
                      <button
                        onClick={() => suggestRelease(result.id)}
                        disabled={suggestingId !== null}
                        className={`px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-all duration-200 flex-shrink-0 self-start mt-1 ${
                          suggestingId !== null
                            ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                            : "bg-emerald-600 text-white hover:bg-emerald-700"
                        }`}
                      >
                        {suggestingId !== null ? (
                          suggestingId === result.id ? (
                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                                fill="none"
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              />
                            </svg>
                          ) : (
                            <div className="h-4 w-4"></div>
                          )
                        ) : (
                          "Suggest"
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <ReleaseGrid
        releases={suggestions}
        loading={loading}
        error={error}
        currentPage={page}
        totalPages={totalPages}
        pageSize={pageSize}
        totalItems={totalItems}
        onPageChange={setPage}
        showRating={false}
      />
    </div>
  );
}