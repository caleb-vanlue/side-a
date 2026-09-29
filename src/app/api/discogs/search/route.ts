import { NextRequest, NextResponse } from "next/server";
import { errorResponse, fetchDiscogsApi, getDiscogsConfig } from "@/lib/discogsApi";

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

interface SearchResponse {
  results: SearchResult[];
  pagination: {
    page: number;
    pages: number;
    per_page: number;
    items: number;
  };
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");
  const page = searchParams.get("page") || "1";
  const perPage = searchParams.get("per_page") || "20";

  if (!query) {
    return NextResponse.json(
      {
        error: "Missing query parameter",
        details: "Query parameter 'q' is required",
      },
      { status: 400 }
    );
  }

  const pageNum = Math.max(1, parseInt(page));
  const perPageNum = Math.min(100, Math.max(1, parseInt(perPage)));

  try {
    const config = getDiscogsConfig();
    const path = `/discogs/search?query=${encodeURIComponent(
      query
    )}&page=${pageNum}&per_page=${perPageNum}`;

    console.log(`Searching Discogs API: ${path}`);

    const data = await fetchDiscogsApi<SearchResponse>(config, path);

    return NextResponse.json(data);
  } catch (error) {
    return errorResponse("Failed to search releases", error);
  }
}
