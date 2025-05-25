"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react";

export interface Artist {
  name: string;
  anv: string;
}

export interface BasicInformation {
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

export interface Release {
  id: number;
  instance_id?: number;
  rating: number;
  basic_information: BasicInformation;
  notes?: string | Array<{ field_id: number; value: string }>;
}

export interface PaginationData {
  page: number;
  pages: number;
  per_page: number;
  items: number;
}

export type SortOption =
  | "artist"
  | "title"
  | "rating"
  | "added"
  | "year"
  | "genre"
  | "format";
export type SortOrder = "asc" | "desc";

export interface SortConfig {
  value: string;
  label: string;
  sort: SortOption;
  order: SortOrder;
}

interface CollectionContextType {
  // Collection data
  collection: Release[];
  wantlist: Release[];

  // Loading states
  loadingCollection: boolean;
  loadingWantlist: boolean;

  // Errors
  collectionError: string | null;
  wantlistError: string | null;

  // Collection pagination
  collectionPage: number;
  collectionTotalPages: number;
  collectionPageSize: number;
  collectionTotalItems: number;
  setCollectionPage: (page: number) => void;
  setCollectionPageSize: (size: number) => void;

  // Wantlist pagination
  wantlistPage: number;
  wantlistTotalPages: number;
  wantlistPageSize: number;
  wantlistTotalItems: number;
  setWantlistPage: (page: number) => void;
  setWantlistPageSize: (size: number) => void;

  // Sorting
  collectionSort: SortOption;
  collectionSortOrder: SortOrder;
  collectionSortValue: string;
  wantlistSort: SortOption;
  wantlistSortOrder: SortOrder;
  wantlistSortValue: string;

  // Actions
  fetchCollection: () => Promise<void>;
  fetchWantlist: () => Promise<void>;
  refreshCollection: () => Promise<void>;
  refreshWantlist: () => Promise<void>;
  handleCollectionSortChange: (sortValue: string) => void;
  handleWantlistSortChange: (sortValue: string) => void;

  // Utility functions
  formatArtists: (artists: Artist[]) => string;
  getVinylColor: (formats: BasicInformation["formats"]) => string | null;
  getFormatInfo: (formats: BasicInformation["formats"]) => string | null;
  handleReleaseClick: (release: Release) => void;
}

const defaultContext: CollectionContextType = {
  collection: [],
  wantlist: [],
  loadingCollection: true,
  loadingWantlist: true,
  collectionError: null,
  wantlistError: null,
  collectionPage: 1,
  collectionTotalPages: 1,
  collectionPageSize: 50,
  collectionTotalItems: 0,
  setCollectionPage: () => {},
  setCollectionPageSize: () => {},
  wantlistPage: 1,
  wantlistTotalPages: 1,
  wantlistPageSize: 50,
  wantlistTotalItems: 0,
  setWantlistPage: () => {},
  setWantlistPageSize: () => {},
  collectionSort: "added",
  collectionSortOrder: "desc",
  collectionSortValue: "added_desc",
  wantlistSort: "added",
  wantlistSortOrder: "desc",
  wantlistSortValue: "added_desc",
  fetchCollection: async () => {},
  fetchWantlist: async () => {},
  refreshCollection: async () => {},
  refreshWantlist: async () => {},
  handleCollectionSortChange: () => {},
  handleWantlistSortChange: () => {},
  formatArtists: () => "",
  getVinylColor: () => null,
  getFormatInfo: () => null,
  handleReleaseClick: () => {},
};

const CollectionContext = createContext<CollectionContextType>(defaultContext);
export const useCollection = () => useContext(CollectionContext);

export const COLLECTION_SORT_OPTIONS: SortConfig[] = [
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

export const WANTLIST_SORT_OPTIONS: SortConfig[] =
  COLLECTION_SORT_OPTIONS.filter((option) => option.sort !== "rating");

export const PAGE_SIZE_OPTIONS = [25, 50, 100];

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

export function CollectionProvider({ children }: { children: ReactNode }) {
  // Collection state
  const [collection, setCollection] = useState<Release[]>([]);
  const [wantlist, setWantlist] = useState<Release[]>([]);
  const [loadingCollection, setLoadingCollection] = useState(true);
  const [loadingWantlist, setLoadingWantlist] = useState(true);
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

  // Cache control - use a cache key that includes pagination params
  const [collectionCacheKey, setCollectionCacheKey] = useState("");
  const [wantlistCacheKey, setWantlistCacheKey] = useState("");
  const [collectionCache, setCollectionCache] = useState<
    Map<string, Release[]>
  >(new Map());
  const [wantlistCache, setWantlistCache] = useState<Map<string, Release[]>>(
    new Map()
  );

  const getCollectionCacheKey = useCallback(() => {
    return `${collectionPage}-${collectionPageSize}-${collectionSort}-${collectionSortOrder}`;
  }, [collectionPage, collectionPageSize, collectionSort, collectionSortOrder]);

  const getWantlistCacheKey = useCallback(() => {
    return `${wantlistPage}-${wantlistPageSize}-${wantlistSort}-${wantlistSortOrder}`;
  }, [wantlistPage, wantlistPageSize, wantlistSort, wantlistSortOrder]);

  const fetchCollection = useCallback(async () => {
    const cacheKey = getCollectionCacheKey();

    // Check cache first
    if (collectionCache.has(cacheKey)) {
      setCollection(collectionCache.get(cacheKey)!);
      setLoadingCollection(false);
      return;
    }

    try {
      setLoadingCollection(true);
      setCollectionError(null);

      const url = `/api/discogs/collection?type=collection&folder=0&page=${collectionPage}&per_page=${collectionPageSize}&sort=${collectionSort}&sort_order=${collectionSortOrder}`;
      const response = await fetchWithRetry(url);

      const data = await response.json();

      if (!data.releases || !Array.isArray(data.releases)) {
        throw new Error("Invalid response format from API");
      }

      setCollection(data.releases);
      setCollectionTotalPages(data.pagination.pages);
      setCollectionTotalItems(data.pagination.items);

      // Cache the result
      setCollectionCache((prev) => new Map(prev).set(cacheKey, data.releases));
      setCollectionCacheKey(cacheKey);
    } catch (err) {
      console.error("Collection fetch error:", err);
      setCollectionError(
        err instanceof Error ? err.message : "Failed to load collection"
      );
    } finally {
      setLoadingCollection(false);
    }
  }, [
    collectionPage,
    collectionPageSize,
    collectionSort,
    collectionSortOrder,
    getCollectionCacheKey,
    collectionCache,
  ]);

  const fetchWantlist = useCallback(async () => {
    const cacheKey = getWantlistCacheKey();

    // Check cache first
    if (wantlistCache.has(cacheKey)) {
      setWantlist(wantlistCache.get(cacheKey)!);
      setLoadingWantlist(false);
      return;
    }

    try {
      setLoadingWantlist(true);
      setWantlistError(null);

      const url = `/api/discogs/collection?type=wantlist&page=${wantlistPage}&per_page=${wantlistPageSize}&sort=${wantlistSort}&sort_order=${wantlistSortOrder}`;
      const response = await fetchWithRetry(url);

      const data = await response.json();

      if (!data.wants || !Array.isArray(data.wants)) {
        throw new Error("Invalid response format from API");
      }

      setWantlist(data.wants);
      setWantlistTotalPages(data.pagination.pages);
      setWantlistTotalItems(data.pagination.items);

      // Cache the result
      setWantlistCache((prev) => new Map(prev).set(cacheKey, data.wants));
      setWantlistCacheKey(cacheKey);
    } catch (err) {
      console.error("Wantlist fetch error:", err);
      setWantlistError(
        err instanceof Error ? err.message : "Failed to load wantlist"
      );
    } finally {
      setLoadingWantlist(false);
    }
  }, [
    wantlistPage,
    wantlistPageSize,
    wantlistSort,
    wantlistSortOrder,
    getWantlistCacheKey,
    wantlistCache,
  ]);

  // Force refresh functions (clear cache)
  const refreshCollection = useCallback(async () => {
    setCollectionCache(new Map());
    await fetchCollection();
  }, [fetchCollection]);

  const refreshWantlist = useCallback(async () => {
    setWantlistCache(new Map());
    await fetchWantlist();
  }, [fetchWantlist]);

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

  const handleCollectionPageChange = (newPage: number) => {
    setCollectionPage(newPage);
  };

  const handleWantlistPageChange = (newPage: number) => {
    setWantlistPage(newPage);
  };

  const handleCollectionPageSizeChange = (newPageSize: number) => {
    setCollectionPageSize(newPageSize);
    setCollectionPage(1);
  };

  const handleWantlistPageSizeChange = (newPageSize: number) => {
    setWantlistPageSize(newPageSize);
    setWantlistPage(1);
  };

  const value: CollectionContextType = {
    collection,
    wantlist,
    loadingCollection,
    loadingWantlist,
    collectionError,
    wantlistError,
    collectionPage,
    collectionTotalPages,
    collectionPageSize,
    collectionTotalItems,
    setCollectionPage: handleCollectionPageChange,
    setCollectionPageSize: handleCollectionPageSizeChange,
    wantlistPage,
    wantlistTotalPages,
    wantlistPageSize,
    wantlistTotalItems,
    setWantlistPage: handleWantlistPageChange,
    setWantlistPageSize: handleWantlistPageSizeChange,
    collectionSort,
    collectionSortOrder,
    collectionSortValue,
    wantlistSort,
    wantlistSortOrder,
    wantlistSortValue,
    fetchCollection,
    fetchWantlist,
    refreshCollection,
    refreshWantlist,
    handleCollectionSortChange,
    handleWantlistSortChange,
    formatArtists,
    getVinylColor,
    getFormatInfo,
    handleReleaseClick,
  };

  return (
    <CollectionContext.Provider value={value}>
      {children}
    </CollectionContext.Provider>
  );
}
