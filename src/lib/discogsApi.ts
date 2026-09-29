import { NextResponse } from "next/server";

const REQUEST_TIMEOUT_MS = 10000;

export interface DiscogsConfig {
  baseUrl: string;
  username: string;
  apiKey: string;
}

export class UpstreamError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly upstreamStatus?: number,
  ) {
    super(message);
    this.name = "UpstreamError";
  }
}

export class ConfigError extends Error {
  constructor(public readonly missing: string[]) {
    super(`Missing required environment variables: ${missing.join(", ")}`);
    this.name = "ConfigError";
  }
}

export function getDiscogsConfig(): DiscogsConfig {
  const config = {
    baseUrl: process.env.DISCOGS_API_BASE_URL,
    username: process.env.DISCOGS_USERNAME,
    apiKey: process.env.DISCOGS_API_KEY,
  };

  const missing = [
    !config.apiKey && "DISCOGS_API_KEY",
    !config.baseUrl && "DISCOGS_API_BASE_URL",
    !config.username && "DISCOGS_USERNAME",
  ].filter((name): name is string => Boolean(name));

  if (missing.length > 0) {
    throw new ConfigError(missing);
  }

  return config as DiscogsConfig;
}

/**
 * Maps an upstream (NestJS API) status to the status we return to the browser.
 * Client errors pass through; auth and server failures are our problem, not the caller's.
 */
export function mapUpstreamStatus(upstreamStatus: number): number {
  if (upstreamStatus === 401 || upstreamStatus === 403) return 502;
  if (upstreamStatus >= 400 && upstreamStatus < 500) return upstreamStatus;
  return 502;
}

export async function fetchDiscogsApi<T>(
  config: DiscogsConfig,
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const url = `${config.baseUrl}${path}`;

  let response: Response;
  try {
    response = await fetch(url, {
      ...init,
      headers: {
        "User-Agent": "CalebVanLuePortfolio/1.0",
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-API-Key": config.apiKey,
      },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
  } catch (error) {
    if (error instanceof Error && error.name === "TimeoutError") {
      throw new UpstreamError(
        `Upstream API timed out after ${REQUEST_TIMEOUT_MS}ms`,
        504,
      );
    }
    const cause = error instanceof Error ? error.message : String(error);
    throw new UpstreamError(`Upstream API unreachable: ${cause}`, 502);
  }

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    console.error(
      `Upstream API error for ${path}: ${response.status} ${response.statusText}`,
      errorText,
    );

    const reason =
      response.status === 401 || response.status === 403
        ? "Unauthorized - invalid API key"
        : `Upstream API responded with ${response.status}${
            response.statusText ? ` ${response.statusText}` : ""
          }`;

    throw new UpstreamError(
      reason,
      mapUpstreamStatus(response.status),
      response.status,
    );
  }

  try {
    return (await response.json()) as T;
  } catch (error) {
    const cause = error instanceof Error ? error.message : String(error);
    throw new UpstreamError(`Upstream API returned invalid JSON: ${cause}`, 502);
  }
}

export function errorResponse(context: string, error: unknown): NextResponse {
  console.error(`${context}:`, error);

  if (error instanceof ConfigError) {
    return NextResponse.json(
      { error: "API configuration error", details: "Server misconfiguration" },
      { status: 500 },
    );
  }

  const status = error instanceof UpstreamError ? error.status : 500;
  const upstreamStatus =
    error instanceof UpstreamError ? error.upstreamStatus : undefined;

  return NextResponse.json(
    {
      error: context,
      details: error instanceof Error ? error.message : "Unknown error",
      ...(upstreamStatus !== undefined && { upstreamStatus }),
      timestamp: new Date().toISOString(),
    },
    { status },
  );
}
