const ACCESS_TOKEN_KEY = "ltb-access-token";
const REFRESH_TOKEN_KEY = "ltb-refresh-token";

let accessToken: string | null = null;
let refreshToken: string | null = null;
let unauthorizedHandler: (() => void) | null = null;

function readStorage(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStorage(key: string, value: string | null): void {
  try {
    if (value === null) {
      window.localStorage.removeItem(key);
    } else {
      window.localStorage.setItem(key, value);
    }
  } catch {
    return;
  }
}

function hydrate(): void {
  accessToken = readStorage(ACCESS_TOKEN_KEY);
  refreshToken = readStorage(REFRESH_TOKEN_KEY);
}

hydrate();

export function getAccessToken(): string | null {
  return accessToken;
}

export function getRefreshToken(): string | null {
  return refreshToken;
}

export function setSessionTokens(tokens: {
  accessToken: string;
  refreshToken: string;
}): void {
  accessToken = tokens.accessToken;
  refreshToken = tokens.refreshToken;
  writeStorage(ACCESS_TOKEN_KEY, accessToken);
  writeStorage(REFRESH_TOKEN_KEY, refreshToken);
}

export function clearSessionTokens(): void {
  accessToken = null;
  refreshToken = null;
  writeStorage(ACCESS_TOKEN_KEY, null);
  writeStorage(REFRESH_TOKEN_KEY, null);
}

export function setUnauthorizedHandler(handler: (() => void) | null): void {
  unauthorizedHandler = handler;
}

export function notifyUnauthorized(): void {
  unauthorizedHandler?.();
}
