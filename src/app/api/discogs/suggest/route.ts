import { NextRequest, NextResponse } from "next/server";
import { errorResponse, fetchDiscogsApi, getDiscogsConfig } from "@/lib/discogsApi";

export async function POST(request: NextRequest) {
  let body: { releaseId?: unknown; notes?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body", details: "Body must be valid JSON" },
      { status: 400 }
    );
  }

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

  try {
    const config = getDiscogsConfig();
    const path = `/discogs/suggestions/${config.username}`;

    console.log(`Adding suggestion via API: ${path}`);

    const data = await fetchDiscogsApi<unknown>(config, path, {
      method: "POST",
      body: JSON.stringify({
        releaseId: parseInt(String(releaseId)),
        notes: notes || "",
      }),
    });

    return NextResponse.json(data);
  } catch (error) {
    return errorResponse("Failed to add suggestion", error);
  }
}
