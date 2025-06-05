import { NextRequest, NextResponse } from "next/server";

const DISCOGS_API_BASE =
  process.env.DISCOGS_API_BASE_URL || "https://discogs-api.calebvanlue.com";
const API_KEY = process.env.DISCOGS_API_KEY;

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
  if (!API_KEY) {
    console.error("DISCOGS_API_KEY not configured in frontend environment");
    return NextResponse.json(
      {
        error: "API configuration error",
        details: "API key not configured",
      },
      { status: 500 }
    );
  }

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
    const url = `${DISCOGS_API_BASE}/discogs/search?query=${encodeURIComponent(
      query
    )}&page=${pageNum}&per_page=${perPageNum}`;

    console.log(`Searching Discogs API: ${url}`);

    const response = await fetch(url, {
      headers: {
        "User-Agent": "CalebVanLuePortfolio/1.0",
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-API-Key": API_KEY,
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `Discogs API search error: ${response.status} ${response.statusText}`,
        errorText
      );

      if (response.status === 401) {
        throw new Error("Unauthorized - Invalid API key");
      }

      throw new Error(
        `API responded with ${response.status}: ${response.statusText}`
      );
    }

    const data = (await response.json()) as SearchResponse;

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error searching Discogs API:", error);

    return NextResponse.json(
      {
        error: "Failed to search releases",
        details: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
