import { NextRequest, NextResponse } from "next/server";

const DISCOGS_API_BASE =
  process.env.DISCOGS_API_BASE_URL || "https://discogs-api.calebvanlue.com";
const API_KEY = process.env.DISCOGS_API_KEY;
const DISCOGS_USERNAME = process.env.DISCOGS_USERNAME || "Irrelativity";

export async function POST(request: NextRequest) {
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

  try {
    const body = await request.json();
    const { releaseId, notes } = body;

    if (!releaseId) {
      return NextResponse.json(
        {
          error: "Missing releaseId",
          details: "releaseId is required",
        },
        { status: 400 }
      );
    }

    const url = `${DISCOGS_API_BASE}/discogs/suggestions/${DISCOGS_USERNAME}`;

    console.log(`Adding suggestion via API: ${url}`);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "User-Agent": "CalebVanLuePortfolio/1.0",
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-API-Key": API_KEY,
      },
      body: JSON.stringify({
        releaseId: parseInt(releaseId),
        notes: notes || "",
      }),
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `Suggest API error: ${response.status} ${response.statusText}`,
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

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error adding suggestion:", error);

    return NextResponse.json(
      {
        error: "Failed to add suggestion",
        details: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
