import { NextRequest, NextResponse } from "next/server";
import { errorResponse, fetchDiscogsApi, getDiscogsConfig } from "@/lib/discogsApi";

interface Release {
  discogsId: number;
  title: string;
  year: number;
  thumbUrl: string;
  coverImageUrl: string;
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

interface UserSuggestionItem {
  id: number;
  notes?: string;
  release: Release;
}

interface ApiResponse {
  data: UserSuggestionItem[];
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
  sortBy: string;
  sortOrder: string;
}

interface TransformedItem {
  id: number;
  instance_id?: number;
  rating: number;
  notes: string;
  basic_information: {
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
  };
}

interface TransformedResponse {
  pagination: {
    page: number;
    pages: number;
    per_page: number;
    items: number;
  };
  releases: TransformedItem[];
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const sort = searchParams.get("sort_by") || "dateAdded";
  const sortOrder = searchParams.get("sort_order") || "desc";
  const page = searchParams.get("page") || "1";
  const perPage = searchParams.get("per_page") || "50";
  const limit = searchParams.get("limit") || perPage;
  const offset = searchParams.get("offset") || "0";

  const pageNum = Math.max(1, parseInt(page));
  const perPageNum = Math.min(100, Math.max(1, parseInt(perPage)));
  const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
  const offsetNum = Math.max(0, parseInt(offset));

  try {
    const config = getDiscogsConfig();
    const sortOrderUpper = sortOrder.toUpperCase();
    const path = `/discogs/suggestions/${config.username}?limit=${limitNum}&offset=${offsetNum}&sort_by=${sort}&sort_order=${sortOrderUpper}`;

    console.log(`Fetching suggestions from API: ${path}`);

    const data = await fetchDiscogsApi<ApiResponse>(config, path);

    const transformedData = transformApiResponse(data, pageNum, perPageNum);

    return NextResponse.json(transformedData);
  } catch (error) {
    return errorResponse("Failed to fetch suggestions", error);
  }
}

function transformApiResponse(
  apiData: ApiResponse,
  page: number,
  perPage: number
): TransformedResponse {
  const { data: items, total } = apiData;

  const totalPages = Math.ceil(total / perPage);

  const transformedItems: TransformedItem[] = items.map((item) => {
    const suggestionItem = item as UserSuggestionItem;
    const release = item.release || ({} as Release);

    return {
      id: item.id,
      instance_id: undefined,
      rating: 0,
      notes: suggestionItem.notes || "",
      basic_information: {
        id: release.discogsId || 0,
        title: release.title || "Unknown Title",
        year: release.year || 0,
        thumb: release.thumbUrl || "",
        cover_image: release.coverImageUrl || release.thumbUrl || "",
        artists: release.artists || [{ name: "Unknown Artist", anv: "" }],
        labels: release.labels || [],
        formats: release.formats || [],
        genres: release.genres || [],
        styles: release.styles || [],
      },
    };
  });

  return {
    pagination: {
      page,
      pages: totalPages,
      per_page: perPage,
      items: total,
    },
    releases: transformedItems,
  };
}
