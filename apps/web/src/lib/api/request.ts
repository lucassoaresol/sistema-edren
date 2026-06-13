export type ApiResponse<T> = {
  data: T;
};

export type ApiErrorResponse = {
  details?: unknown;
  error?: string;
  issues?: unknown;
  message?: string;
  requestId?: string;
};

export class ApiError extends Error {
  public readonly status: number;
  public readonly code?: string;
  public readonly details?: unknown;
  public readonly issues?: unknown;
  public readonly requestId?: string;

  constructor(status: number, response: ApiErrorResponse = {}) {
    super(response.message ?? `API request failed with status ${status}`);
    this.name = 'ApiError';
    this.status = status;
    this.code = response.error;
    this.details = response.details;
    this.issues = response.issues;
    this.requestId = response.requestId;
  }
}

type RequestOptions = {
  body?: unknown;
  method?: string;
};

export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const response = await fetch(path, {
    credentials: 'include',
    method: options.method ?? 'GET',
    headers: {
      Accept: 'application/json',
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    throw await toApiError(response);
  }

  return response.json() as Promise<T>;
}

export async function ensureOk(response: Response) {
  if (response.ok) {
    return;
  }

  throw await toApiError(response);
}

async function toApiError(response: Response) {
  try {
    return new ApiError(response.status, await response.json() as ApiErrorResponse);
  } catch {
    return new ApiError(response.status);
  }
}
