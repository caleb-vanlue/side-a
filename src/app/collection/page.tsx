"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import HamburgerButton from "../../components/HamburgerButton";
import SideDrawer from "../../components/SideDrawer";

function DiscogsBanner({ className = "" }: { className?: string }) {
  return (
    <a
      href="https://www.discogs.com"
      target="_blank"
      rel="noopener noreferrer"
      className={`flex items-center justify-center gap-3 py-3 px-6 bg-gray-50 border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100 hover:shadow-md transition-all duration-200 cursor-pointer ${className}`}
    >
      <span className="text-gray-600 text-sm font-medium">Powered by</span>
      <div className="flex items-center gap-2">
        <Image
          src="/images/discogs.svg"
          alt="Discogs"
          width={24}
          height={24}
          className="w-14 h-8"
        />
      </div>
    </a>
  );
}

interface Artist {
  name: string;
  anv: string;
}

interface BasicInformation {
  id: number;
  title: string;
  year: number;
  thumb: string;
  cover_image: string;
  artists: Artist[];
  labels: Array<{ name: string; catno: string }>;
  formats: Array<{
    name: string;
    qty: string;
    descriptions: string[];
    text?: string;
  }>;
  genres?: string[];
  styles?: string[];
}

interface Release {
  id: number;
  instance_id?: number;
  rating: number;
  basic_information: BasicInformation;
  notes?: string | Array<{ field_id: number; value: string }>;
}

interface CollectionResponse {
  pagination: {
    page: number;
    pages: number;
    per_page: number;
    items: number;
  };
  releases: Release[];
}

interface WantlistResponse {
  pagination: {
    page: number;
    pages: number;
    per_page: number;
    items: number;
  };
  wants: Release[];
}

type SortOption =
  | "artist"
  | "title"
  | "rating"
  | "added"
  | "year"
  | "genre"
  | "format";
type SortOrder = "asc" | "desc";

const COLLECTION_SORT_OPTIONS: {
  value: string;
  label: string;
  sort: SortOption;
  order: SortOrder;
}[] = [
  {
    value: "added_desc",
    label: "Date Added (Newest First)",
    sort: "added",
    order: "desc",
  },
  {
    value: "added_asc",
    label: "Date Added (Oldest First)",
    sort: "added",
    order: "asc",
  },
  { value: "artist_asc", label: "Artist (A-Z)", sort: "artist", order: "asc" },
  {
    value: "artist_desc",
    label: "Artist (Z-A)",
    sort: "artist",
    order: "desc",
  },
  { value: "title_asc", label: "Title (A-Z)", sort: "title", order: "asc" },
  { value: "title_desc", label: "Title (Z-A)", sort: "title", order: "desc" },
  {
    value: "year_desc",
    label: "Year (Newest First)",
    sort: "year",
    order: "desc",
  },
  {
    value: "year_asc",
    label: "Year (Oldest First)",
    sort: "year",
    order: "asc",
  },
  {
    value: "rating_desc",
    label: "Rating (Highest First)",
    sort: "rating",
    order: "desc",
  },
  {
    value: "rating_asc",
    label: "Rating (Lowest First)",
    sort: "rating",
    order: "asc",
  },
  {
    value: "genre_asc",
    label: "Genre (A-Z)",
    sort: "genre",
    order: "asc",
  },
  {
    value: "genre_desc",
    label: "Genre (Z-A)",
    sort: "genre",
    order: "desc",
  },
  {
    value: "format_asc",
    label: "Format (A-Z)",
    sort: "format",
    order: "asc",
  },
  {
    value: "format_desc",
    label: "Format (Z-A)",
    sort: "format",
    order: "desc",
  },
];

const WANTLIST_SORT_OPTIONS: {
  value: string;
  label: string;
  sort: SortOption;
  order: SortOrder;
}[] = [
  {
    value: "added_desc",
    label: "Date Added (Newest First)",
    sort: "added",
    order: "desc",
  },
  {
    value: "added_asc",
    label: "Date Added (Oldest First)",
    sort: "added",
    order: "asc",
  },
  { value: "artist_asc", label: "Artist (A-Z)", sort: "artist", order: "asc" },
  {
    value: "artist_desc",
    label: "Artist (Z-A)",
    sort: "artist",
    order: "desc",
  },
  { value: "title_asc", label: "Title (A-Z)", sort: "title", order: "asc" },
  { value: "title_desc", label: "Title (Z-A)", sort: "title", order: "desc" },
  {
    value: "year_desc",
    label: "Year (Newest First)",
    sort: "year",
    order: "desc",
  },
  {
    value: "year_asc",
    label: "Year (Oldest First)",
    sort: "year",
    order: "asc",
  },
  {
    value: "genre_asc",
    label: "Genre (A-Z)",
    sort: "genre",
    order: "asc",
  },
  {
    value: "genre_desc",
    label: "Genre (Z-A)",
    sort: "genre",
    order: "desc",
  },
  {
    value: "format_asc",
    label: "Format (A-Z)",
    sort: "format",
    order: "asc",
  },
  {
    value: "format_desc",
    label: "Format (Z-A)",
    sort: "format",
    order: "desc",
  },
];

const PAGE_SIZE_OPTIONS = [25, 50, 100];

const fetchWithRetry = async (
  url: string,
  retries: number = 3
): Promise<Response> => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        return response;
      }
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    } catch (error) {
      console.warn(`Attempt ${i + 1} failed:`, error);
      if (i === retries - 1) throw error;
      await new Promise((resolve) =>
        setTimeout(resolve, Math.pow(2, i) * 1000)
      );
    }
  }
  throw new Error("Max retries exceeded");
};

export default function Collection() {
  const [activeTab, setActiveTab] = useState<"collection" | "wantlist">(
    "collection"
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const [collection, setCollection] = useState<Release[]>([]);
  const [wantlist, setWantlist] = useState<Release[]>([]);
  const [loadingCollection, setLoadingCollection] = useState(true);
  const [loadingWantlist, setLoadingWantlist] = useState(false);
  const [collectionError, setCollectionError] = useState<string | null>(null);
  const [wantlistError, setWantlistError] = useState<string | null>(null);

  // Collection pagination and sorting
  const [collectionPage, setCollectionPage] = useState(1);
  const [collectionTotalPages, setCollectionTotalPages] = useState(1);
  const [collectionSort, setCollectionSort] = useState<SortOption>("added");
  const [collectionSortOrder, setCollectionSortOrder] =
    useState<SortOrder>("desc");
  const [collectionSortValue, setCollectionSortValue] = useState("added_desc");
  const [collectionPageSize, setCollectionPageSize] = useState(50);
  const [collectionTotalItems, setCollectionTotalItems] = useState(0);

  // Wantlist pagination and sorting
  const [wantlistPage, setWantlistPage] = useState(1);
  const [wantlistTotalPages, setWantlistTotalPages] = useState(1);
  const [wantlistSort, setWantlistSort] = useState<SortOption>("added");
  const [wantlistSortOrder, setWantlistSortOrder] = useState<SortOrder>("desc");
  const [wantlistSortValue, setWantlistSortValue] = useState("added_desc");
  const [wantlistPageSize, setWantlistPageSize] = useState(50);
  const [wantlistTotalItems, setWantlistTotalItems] = useState(0);

  useEffect(() => {
    fetchCollection();
  }, [collectionPage, collectionSort, collectionSortOrder, collectionPageSize]);

  useEffect(() => {
    if (activeTab === "wantlist") {
      fetchWantlist();
    }
  }, [
    activeTab,
    wantlistPage,
    wantlistSort,
    wantlistSortOrder,
    wantlistPageSize,
  ]);

  const fetchCollection = async () => {
    try {
      setLoadingCollection(true);
      setCollectionError(null);

      const url = `/api/discogs/collection?type=collection&folder=0&page=${collectionPage}&per_page=${collectionPageSize}&sort=${collectionSort}&sort_order=${collectionSortOrder}`;
      const response = await fetchWithRetry(url);

      const data: CollectionResponse = await response.json();

      if (!data.releases || !Array.isArray(data.releases)) {
        throw new Error("Invalid response format from API");
      }

      setCollection(data.releases);
      setCollectionTotalPages(data.pagination.pages);
      setCollectionTotalItems(data.pagination.items);
    } catch (err) {
      console.error("Collection fetch error:", err);
      setCollectionError(
        err instanceof Error ? err.message : "Failed to load collection"
      );
    } finally {
      setLoadingCollection(false);
    }
  };

  const fetchWantlist = async () => {
    try {
      setLoadingWantlist(true);
      setWantlistError(null);

      const url = `/api/discogs/collection?type=wantlist&page=${wantlistPage}&per_page=${wantlistPageSize}&sort=${wantlistSort}&sort_order=${wantlistSortOrder}`;
      const response = await fetchWithRetry(url);

      const data: WantlistResponse = await response.json();

      if (!data.wants || !Array.isArray(data.wants)) {
        throw new Error("Invalid response format from API");
      }

      setWantlist(data.wants);
      setWantlistTotalPages(data.pagination.pages);
      setWantlistTotalItems(data.pagination.items);
    } catch (err) {
      console.error("Wantlist fetch error:", err);
      setWantlistError(
        err instanceof Error ? err.message : "Failed to load wantlist"
      );
    } finally {
      setLoadingWantlist(false);
    }
  };

  const formatArtists = (artists: Artist[]) => {
    return artists.map((artist) => artist.name || artist.anv).join(", ");
  };

  const getVinylColor = (formats: BasicInformation["formats"]) => {
    const colorFormat = formats.find(
      (format) => format.text && format.text.trim() !== ""
    );

    if (colorFormat?.text) {
      let color = colorFormat.text;
      color = color.replace(/,\s*$/, "").replace(/,\s+/g, ", ").trim();
      return color || null;
    }

    return null;
  };

  const getFormatInfo = (formats: BasicInformation["formats"]) => {
    if (!formats || formats.length === 0) return null;

    const format = formats[0];
    const parts = [];

    if (format.name) parts.push(format.name);
    if (format.qty && format.qty !== "1") parts.push(`(${format.qty})`);

    return parts.join(" ");
  };

  const handleReleaseClick = (release: Release) => {
    const discogsUrl = `https://www.discogs.com/release/${release.basic_information.id}`;
    window.open(discogsUrl, "_blank", "noopener,noreferrer");
  };

  const handleCollectionSortChange = (sortValue: string) => {
    const sortOption = COLLECTION_SORT_OPTIONS.find(
      (option) => option.value === sortValue
    );
    if (sortOption) {
      setCollectionSort(sortOption.sort);
      setCollectionSortOrder(sortOption.order);
      setCollectionSortValue(sortValue);
      setCollectionPage(1); // Reset to first page when sorting changes
    }
  };

  const handleWantlistSortChange = (sortValue: string) => {
    const sortOption = WANTLIST_SORT_OPTIONS.find(
      (option) => option.value === sortValue
    );
    if (sortOption) {
      setWantlistSort(sortOption.sort);
      setWantlistSortOrder(sortOption.order);
      setWantlistSortValue(sortValue);
      setWantlistPage(1); // Reset to first page when sorting changes
    }
  };

  const handleCollectionPageSizeChange = (newPageSize: number) => {
    setCollectionPageSize(newPageSize);
    setCollectionPage(1);
  };

  const handleWantlistPageSizeChange = (newPageSize: number) => {
    setWantlistPageSize(newPageSize);
    setWantlistPage(1);
  };

  const renderControls = (
    type: "collection" | "wantlist",
    sortValue: string,
    pageSize: number,
    totalItems: number,
    sortOptions: typeof COLLECTION_SORT_OPTIONS,
    onSortChange: (sortValue: string) => void,
    onPageSizeChange: (size: number) => void
  ) => (
    <div className="flex flex-col sm:flex-row gap-4 mb-6 items-start sm:items-center justify-between">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Sort by:</label>
          <select
            value={sortValue}
            onChange={(e) => onSortChange(e.target.value)}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[200px]"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Show:</label>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {PAGE_SIZE_OPTIONS.map((size) => (
              <option key={size} value={size}>
                {size} items
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="text-sm text-gray-500">
        {totalItems.toLocaleString()} total items
      </div>
    </div>
  );

  const renderReleases = (
    releases: Release[],
    loading: boolean,
    error: string | null,
    currentPage: number,
    totalPages: number,
    pageSize: number,
    totalItems: number,
    onPageChange: (page: number) => void,
    showRating: boolean = true
  ) => {
    if (loading) {
      return (
        <div className="flex justify-center items-center py-12">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            <p className="text-gray-500 text-sm sm:text-base">Loading...</p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-12">
          <p className="text-red-500 text-sm sm:text-base mb-4">
            Error: {error}
          </p>
          <button
            onClick={() => {
              if (activeTab === "collection") {
                fetchCollection();
              } else {
                fetchWantlist();
              }
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Retry
          </button>
        </div>
      );
    }

    if (releases.length === 0) {
      return (
        <p className="text-gray-500 text-sm sm:text-base text-center py-12">
          No items found.
        </p>
      );
    }

    const startItem = (currentPage - 1) * pageSize + 1;
    const endItem = Math.min(currentPage * pageSize, totalItems);

    return (
      <>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {releases.map((release) => {
            const vinylColor = getVinylColor(release.basic_information.formats);
            const formatInfo = getFormatInfo(release.basic_information.formats);

            return (
              <div
                key={release.id}
                className="group cursor-pointer"
                onClick={() => handleReleaseClick(release)}
              >
                <div className="aspect-square relative overflow-hidden rounded-lg shadow-md transition-transform duration-200 group-hover:scale-105">
                  {release.basic_information.cover_image &&
                  release.basic_information.cover_image !== "" ? (
                    <Image
                      src={release.basic_information.cover_image}
                      alt={`${release.basic_information.title} cover`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <svg
                        className="w-12 h-12 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                        />
                      </svg>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-200 rounded-lg" />
                </div>
                <div className="mt-2 text-center sm:text-left">
                  <p className="text-sm font-medium text-gray-900 truncate group-hover:text-blue-600 transition-colors duration-200">
                    {release.basic_information.title}
                  </p>
                  <p className="text-xs text-gray-600 truncate">
                    {formatArtists(release.basic_information.artists)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {release.basic_information.year}
                  </p>
                  {formatInfo && (
                    <p className="text-xs text-gray-600 mt-1">{formatInfo}</p>
                  )}
                  {vinylColor && (
                    <div className="text-xs text-emerald-600 font-medium mt-1">
                      {vinylColor}
                    </div>
                  )}
                  {release.notes && (
                    <div className="text-xs text-gray-600 font-medium mt-1 bg-green-50 px-2 py-1 rounded">
                      {" "}
                      {typeof release.notes === "string"
                        ? release.notes
                        : "Custom notes"}
                    </div>
                  )}
                  {showRating && release.rating > 0 && (
                    <div className="flex justify-center sm:justify-start mt-1">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`text-xs ${
                            i < release.rating
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {totalPages > 1 && (
          <div className="mt-8 space-y-4">
            <div className="flex justify-center text-sm text-gray-600">
              Showing {startItem.toLocaleString()}-{endItem.toLocaleString()} of{" "}
              {totalItems.toLocaleString()} items
            </div>
            <div className="flex items-center justify-center gap-2 flex-wrap">
              <button
                onClick={() => onPageChange(1)}
                disabled={currentPage === 1}
                className="px-3 py-2 rounded-md bg-gray-100 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 text-sm"
              >
                First
              </button>
              <button
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-md bg-gray-100 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200"
              >
                Previous
              </button>

              <span className="px-4 py-2 text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={() =>
                  onPageChange(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-md bg-gray-100 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200"
              >
                Next
              </button>
              <button
                onClick={() => onPageChange(totalPages)}
                disabled={currentPage === totalPages}
                className="px-3 py-2 rounded-md bg-gray-100 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 text-sm"
              >
                Last
              </button>
            </div>
          </div>
        )}
      </>
    );
  };

  return (
    <main className="min-h-screen bg-white">
      <HamburgerButton
        isOpen={menuOpen}
        onClick={() => setMenuOpen(!menuOpen)}
      />
      <SideDrawer isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center mb-6 mt-12 sm:mt-4">
          <DiscogsBanner className="max-w-sm" />
        </div>

        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-lg bg-gray-100 p-1">
            <button
              onClick={() => setActiveTab("collection")}
              className={`
                px-4 sm:px-6 py-2 rounded-md font-medium transition-all duration-200 text-sm sm:text-base
                ${
                  activeTab === "collection"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }
              `}
            >
              Collection
            </button>
            <button
              onClick={() => setActiveTab("wantlist")}
              className={`
                px-4 sm:px-6 py-2 rounded-md font-medium transition-all duration-200 text-sm sm:text-base
                ${
                  activeTab === "wantlist"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }
              `}
            >
              Wantlist
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto">
          {activeTab === "collection" ? (
            <div>
              {renderControls(
                "collection",
                collectionSortValue,
                collectionPageSize,
                collectionTotalItems,
                COLLECTION_SORT_OPTIONS,
                handleCollectionSortChange,
                handleCollectionPageSizeChange
              )}
              {renderReleases(
                collection,
                loadingCollection,
                collectionError,
                collectionPage,
                collectionTotalPages,
                collectionPageSize,
                collectionTotalItems,
                setCollectionPage,
                true
              )}
            </div>
          ) : (
            <div>
              {renderControls(
                "wantlist",
                wantlistSortValue,
                wantlistPageSize,
                wantlistTotalItems,
                WANTLIST_SORT_OPTIONS,
                handleWantlistSortChange,
                handleWantlistPageSizeChange
              )}
              {renderReleases(
                wantlist,
                loadingWantlist,
                wantlistError,
                wantlistPage,
                wantlistTotalPages,
                wantlistPageSize,
                wantlistTotalItems,
                setWantlistPage,
                false
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
