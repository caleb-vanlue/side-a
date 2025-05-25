import { NextRequest, NextResponse } from "next/server";

const DISCOGS_API_BASE =
  process.env.DISCOGS_API_BASE_URL || "https://discogs-api.calebvanlue.com";
const DISCOGS_USERNAME = process.env.DISCOGS_USERNAME || "Irrelativity";
const API_KEY = process.env.DISCOGS_API_KEY;

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
  const type = searchParams.get("type") || "collection";
  const sort = searchParams.get("sort") || "added";
  const sortOrder = searchParams.get("sort_order") || "desc";
  const page = searchParams.get("page") || "1";
  const perPage = searchParams.get("per_page") || "50";

  const pageNum = Math.max(1, parseInt(page));
  const perPageNum = Math.min(100, Math.max(1, parseInt(perPage)));
  const offset = (pageNum - 1) * perPageNum;

  try {
    let url: string;
    const sortBy = mapSortField(sort, type);
    const sortOrderUpper = sortOrder.toUpperCase();

    if (type === "wantlist") {
      url = `${DISCOGS_API_BASE}/collection/${DISCOGS_USERNAME}/wantlist?limit=${perPageNum}&offset=${offset}&sort_by=${sortBy}&sort_order=${sortOrderUpper}`;
    } else {
      url = `${DISCOGS_API_BASE}/collection/${DISCOGS_USERNAME}?limit=${perPageNum}&offset=${offset}&sort_by=${sortBy}&sort_order=${sortOrderUpper}`;
    }

    console.log(`Fetching from NestJS API: ${url}`);

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
        `NestJS API error: ${response.status} ${response.statusText}`,
        errorText
      );

      if (response.status === 401) {
        throw new Error("Unauthorized - Invalid API key");
      }

      throw new Error(
        `API responded with ${response.status}: ${response.statusText}`
      );
    }

    const data = await response.json();

    const transformedData = transformApiResponse(
      data,
      type,
      pageNum,
      perPageNum
    );

    return NextResponse.json(transformedData);
  } catch (error) {
    console.error("Error fetching from NestJS API:", error);

    return NextResponse.json(
      {
        error: `Failed to fetch ${type}`,
        details: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

function mapSortField(sort: string, type: string): string {
  const sortMappings: Record<string, string> = {
    added: "dateAdded",
    artist: "primaryArtist",
    title: "title",
    year: "year",
    rating: type === "collection" ? "rating" : "dateAdded", // rating only available for collection
    genre: "primaryGenre",
    format: "primaryFormat",
  };

  return sortMappings[sort] || "dateAdded";
}

function transformApiResponse(
  apiData: any,
  type: string,
  page: number,
  perPage: number
) {
  const { data: items, total } = apiData;

  const totalPages = Math.ceil(total / perPage);
  const transformedItems = items.map((item: any) => {
    const release = item.release || {};

    return {
      id: item.id,
      instance_id: item.discogsInstanceId,
      rating: item.rating || 0,
      notes: item.notes || "",
      basic_information: {
        id: release.discogsId || release.id,
        title: release.title || item.title || "Unknown Title",
        year: release.year || item.year || 0,
        thumb: release.thumbUrl || "",
        cover_image: release.coverImageUrl || release.thumbUrl || "",
        artists: release.artists || [
          { name: item.primaryArtist || "Unknown Artist", anv: "" },
        ],
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
