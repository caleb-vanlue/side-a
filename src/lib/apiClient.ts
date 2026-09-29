export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly details?: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

interface ErrorBody {
  error?: string;
  details?: string;
}

/**
 * Builds an ApiError from a failed response, preferring the `{ error, details }`
 * body our API routes return over the (often empty) HTTP status text.
 */
export async function toApiError(response: Response): Promise<ApiError> {
  let body: ErrorBody = {};
  try {
    body = await response.json();
  } catch {
    // Non-JSON error body (e.g. a platform error page); fall back to the status.
  }

  const summary =
    body.error ||
    `Request failed with status ${response.status}${
      response.statusText ? ` ${response.statusText}` : ""
    }`;
  const message = body.details ? `${summary}: ${body.details}` : summary;

  return new ApiError(message, response.status, body.details);
}

/**
 * Network failures and transient server errors are worth retrying. Client errors
 * won't change on retry, and a 504 means the upstream already spent its full timeout.
 */
export function isRetryable(error: unknown): boolean {
  if (error instanceof ApiError) {
    return (
      error.status === 429 ||
      (error.status >= 500 && error.status !== 504)
    );
  }
  return error instanceof TypeError;
}

export interface FetchJsonOptions {
  attempts?: number;
  baseDelayMs?: number;
}

export async function fetchJson<T>(
  url: string,
  init?: RequestInit,
  { attempts = 3, baseDelayMs = 1000 }: FetchJsonOptions = {},
): Promise<T> {
  for (let attempt = 1; ; attempt++) {
    try {
      const response = await fetch(url, init);
      if (!response.ok) {
        throw await toApiError(response);
      }
      return (await response.json()) as T;
    } catch (error) {
      if (attempt >= attempts || !isRetryable(error)) {
        throw error;
      }
      console.warn(`Attempt ${attempt} for ${url} failed, retrying:`, error);
      await new Promise((resolve) =>
        setTimeout(resolve, Math.pow(2, attempt - 1) * baseDelayMs),
      );
    }
  }
}
