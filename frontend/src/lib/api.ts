import {
  clearSessionTokens,
  getAccessToken,
  getRefreshToken,
  notifyUnauthorized,
  setSessionTokens,
} from "./session";

const API_BASE = (import.meta.env.VITE_API_URL ?? "/api").replace(/\/+$/, "");

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details?: unknown;

  constructor(
    status: number,
    code: string,
    message: string,
    details?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

interface RequestOptions {
  method?: string;
  body?: unknown;
  auth?: boolean;
}

interface ErrorEnvelope {
  error?: { code?: string; message?: string; details?: unknown };
}

let refreshPromise: Promise<boolean> | null = null;

async function refreshAccessToken(): Promise<boolean> {
  const token = getRefreshToken();
  if (!token) return false;

  if (!refreshPromise) {
    refreshPromise = (async () => {
      try {
        const res = await fetch(`${API_BASE}/auth/refresh`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken: token }),
        });
        if (!res.ok) return false;

        const payload = (await res.json()) as {
          data?: { accessToken?: string; refreshToken?: string };
        };
        const access = payload.data?.accessToken;
        const refresh = payload.data?.refreshToken;
        if (!access || !refresh) return false;

        setSessionTokens({ accessToken: access, refreshToken: refresh });
        return true;
      } catch {
        return false;
      } finally {
        refreshPromise = null;
      }
    })();
  }

  return refreshPromise;
}

function toApiError(res: Response, payload: unknown): ApiError {
  const envelope = payload as ErrorEnvelope | null;
  return new ApiError(
    res.status,
    envelope?.error?.code ?? "INTERNAL",
    envelope?.error?.message ?? `Request failed with status ${res.status}`,
    envelope?.error?.details,
  );
}

async function parsePayload(res: Response): Promise<unknown> {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { method = "GET", body, auth = true } = options;

  const send = (): Promise<Response> => {
    const headers: Record<string, string> = {};
    if (body !== undefined) headers["Content-Type"] = "application/json";

    const token = getAccessToken();
    if (auth && token) headers.Authorization = `Bearer ${token}`;

    return fetch(`${API_BASE}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  };

  let res = await send();

  if (res.status === 401 && auth) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      res = await send();
    } else {
      clearSessionTokens();
      notifyUnauthorized();
    }
  }

  const payload = await parsePayload(res);
  if (!res.ok) throw toApiError(res, payload);

  return (payload as { data: T }).data;
}
