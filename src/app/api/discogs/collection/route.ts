import { NextRequest, NextResponse } from "next/server";

const DISCOGS_API_BASE = "https://api.discogs.com";
const DISCOGS_USERNAME = "Irrelativity";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") || "collection"; // 'collection' or 'wantlist'
  const folder = searchParams.get("folder") || "0";
  const sort = searchParams.get("sort") || "added";
  const sortOrder = searchParams.get("sort_order") || "desc";
  const page = searchParams.get("page") || "1";
  const perPage = searchParams.get("per_page") || "50";

  const discogsToken = process.env.DISCOGS_TOKEN;
  if (!discogsToken) {
    return NextResponse.json(
      { error: "Discogs token not configured" },
      { status: 500 }
    );
  }

  try {
    let url: string;

    if (type === "wantlist") {
      url = `${DISCOGS_API_BASE}/users/${DISCOGS_USERNAME}/wants?page=${page}&per_page=${perPage}`;
    } else {
      url = `${DISCOGS_API_BASE}/users/${DISCOGS_USERNAME}/collection/folders/${folder}/releases?sort=${sort}&sort_order=${sortOrder}&page=${page}&per_page=${perPage}`;
    }

    const response = await fetch(url, {
      headers: {
        Authorization: `Discogs token=${discogsToken}`,
        "User-Agent": "CalebVanLuePortfolio/1.0",
      },
    });

    if (!response.ok) {
      throw new Error(`Discogs API error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching from Discogs:", error);
    return NextResponse.json(
      { error: `Failed to fetch ${type}` },
      { status: 500 }
    );
  }
}
