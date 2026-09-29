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

interface UserCollectionItem {
  id: number;
  discogsInstanceId?: number;
  rating: number;
  notes?: string;
  release: Release;
}

interface UserWantlistItem {
  id: number;
  notes?: string;
  release: Release;
}

interface ApiResponse {
  data: UserCollectionItem[] | UserWantlistItem[];
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
  releases?: TransformedItem[];
  wants?: TransformedItem[];
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") || "collection";
  const sort = searchParams.get("sort") || "added";
  const sortOrder = searchParams.get("sort_order") || "desc";
  const page = searchParams.get("page") || "1";
  const perPage = searchParams.get("per_page") || "50";

  const pageNum = Math.max(1, parseInt(page));
  const perPageNum = Math.min(100, Math.max(1, parseInt(perPage)));
  const offset = (pageNum - 1) * perPageNum;

  try {
    const config = getDiscogsConfig();
    const sortBy = mapSortField(sort, type);
    const sortOrderUpper = sortOrder.toUpperCase();
    const resource = type === "wantlist" ? "/wantlist" : "";
    const path = `/collection/${config.username}${resource}?limit=${perPageNum}&offset=${offset}&sort_by=${sortBy}&sort_order=${sortOrderUpper}`;

    console.log(`Fetching from NestJS API: ${path}`);

    const data = await fetchDiscogsApi<ApiResponse>(config, path);

    const transformedData = transformApiResponse(
      data,
      type,
      pageNum,
      perPageNum
    );

    return NextResponse.json(transformedData);
  } catch (error) {
    return errorResponse(`Failed to fetch ${type}`, error);
  }
}

function mapSortField(sort: string, type: string): string {
  const sortMappings: Record<string, string> = {
    added: "dateAdded",
    artist: "primaryArtist",
    title: "title",
    year: "year",
    rating: type === "collection" ? "rating" : "dateAdded",
    genre: "primaryGenre",
    format: "primaryFormat",
  };

  return sortMappings[sort] || "dateAdded";
}

function transformApiResponse(
  apiData: ApiResponse,
  type: string,
  page: number,
  perPage: number
): TransformedResponse {
  const { data: items, total } = apiData;

  const totalPages = Math.ceil(total / perPage);

  const transformedItems: TransformedItem[] = items.map((item) => {
    const collectionItem = item as UserCollectionItem;
    const wantlistItem = item as UserWantlistItem;
    const release = item.release || ({} as Release);

    return {
      id: item.id,
      instance_id: collectionItem.discogsInstanceId,
      rating: collectionItem.rating || 0,
      notes: collectionItem.notes || wantlistItem.notes || "",
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

  if (type === "wantlist") {
    return {
      pagination: {
        page,
        pages: totalPages,
        per_page: perPage,
        items: total,
      },
      wants: transformedItems,
    };
  } else {
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
}
