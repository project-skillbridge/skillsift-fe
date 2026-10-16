import axios, {
  type AxiosError,
  type AxiosInstance,
  type CreateAxiosDefaults,
  type InternalAxiosRequestConfig,
} from "axios";

export class ApiError extends Error {
  constructor(
    public readonly status: number | undefined,
    public readonly data: unknown,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export function authFailureMessage(error: unknown): string {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error) return error.message;
  return "Something went wrong. Please try again.";
}

export function isServiceUnavailableError(error: unknown): boolean {
  return error instanceof ApiError && error.status === 503;
}

function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error;
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const message =
      axiosError.response?.data?.message ??
      axiosError.message ??
      "Request failed";
    return new ApiError(
      axiosError.response?.status,
      axiosError.response?.data,
      message,
    );
  }
  if (error instanceof Error) {
    return new ApiError(undefined, undefined, error.message);
  }
  return new ApiError(undefined, undefined, "Unknown error");
}

function attachErrorInterceptor(instance: AxiosInstance) {
  instance.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(toApiError(error)),
  );
  return instance;
}

type RetriableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

type StoredCookie = {
  name: string;
  value: string;
  httpOnly?: boolean;
  maxAge?: number;
  path?: string;
  sameSite?: "strict" | "lax" | "none";
  secure?: boolean;
};

let refreshRequest: Promise<string | undefined> | null = null;

function isAuthRefreshRequest(config: InternalAxiosRequestConfig | undefined) {
  return config?.url?.includes("/auth/refresh") ?? false;
}

function normalizeToken(token: string | undefined): string | undefined {
  if (!token || token === "undefined") return undefined;
  return token;
}

async function getServerCookieHeader(): Promise<string | undefined> {
  if (typeof window !== "undefined") return undefined;

  try {
    const { headers } = await import("next/headers");
    return (await headers()).get("cookie") ?? undefined;
  } catch {
    return undefined;
  }
}

function setCookieHeadersFrom(headers: unknown): string[] {
  if (!headers || typeof headers !== "object") return [];

  const maybeHeaders = headers as {
    get?: (name: string) => unknown;
    getSetCookie?: () => string[];
    ["set-cookie"]?: unknown;
  };

  const setCookie =
    maybeHeaders["set-cookie"] ?? maybeHeaders.get?.("set-cookie");
  if (Array.isArray(setCookie)) return setCookie.filter(Boolean);
  if (typeof setCookie === "string") return [setCookie];
  return maybeHeaders.getSetCookie?.() ?? [];
}

function parseSetCookieHeader(header: string): StoredCookie | undefined {
  const [cookiePair, ...attributes] = header
    .split(";")
    .map((part) => part.trim());
  const separatorIndex = cookiePair.indexOf("=");
  if (separatorIndex <= 0) return undefined;

  const cookie: StoredCookie = {
    name: cookiePair.slice(0, separatorIndex),
    value: cookiePair.slice(separatorIndex + 1),
  };

  for (const attribute of attributes) {
    const [key, ...valueParts] = attribute.split("=");
    const normalizedKey = key.toLowerCase();
    const value = valueParts.join("=");

    if (normalizedKey === "httponly") cookie.httpOnly = true;
    if (normalizedKey === "secure") cookie.secure = true;
    if (normalizedKey === "path" && value) cookie.path = value;
    if (normalizedKey === "max-age" && value) {
      const maxAge = Number(value);
      if (Number.isFinite(maxAge)) cookie.maxAge = maxAge;
    }
    if (normalizedKey === "samesite") {
      const sameSite = value.toLowerCase();
      if (sameSite === "strict" || sameSite === "lax" || sameSite === "none") {
        cookie.sameSite = sameSite;
      }
    }
  }

  return cookie;
}

function mergeCookieHeader(
  currentCookieHeader: string | undefined,
  storedCookies: StoredCookie[],
): string | undefined {
  const cookies = new Map<string, string>();

  for (const cookie of currentCookieHeader?.split(";") ?? []) {
    const trimmedCookie = cookie.trim();
    const separatorIndex = trimmedCookie.indexOf("=");
    if (separatorIndex <= 0) continue;
    cookies.set(
      trimmedCookie.slice(0, separatorIndex),
      trimmedCookie.slice(separatorIndex + 1),
    );
  }

  for (const cookie of storedCookies) {
    cookies.set(cookie.name, cookie.value);
  }

  const mergedCookies = Array.from(
    cookies,
    ([name, value]) => `${name}=${value}`,
  );
  return mergedCookies.length ? mergedCookies.join("; ") : undefined;
}

async function persistServerCookies(storedCookies: StoredCookie[]) {
  if (typeof window !== "undefined" || storedCookies.length === 0) return;

  try {
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();

    for (const cookie of storedCookies) {
      cookieStore.set(cookie);
    }
  } catch {
    // Some server render contexts cannot mutate response cookies. The retry
    // still receives the rotated cookies through the returned Cookie header.
  }
}

async function getAuthToken(): Promise<string | undefined> {
  if (typeof window === "undefined") {
    const { auth } = await import("@/lib/auth");
    const session = await auth();
    return normalizeToken(session?.accessToken);
  }
  return undefined;
}

async function refreshAuthCookies(): Promise<string | undefined> {
  const refresh = async () => {
    const cookie = await getServerCookieHeader();
    const response = await publicApi.post(
      "/auth/refresh",
      undefined,
      cookie ? { headers: { Cookie: cookie } } : undefined,
    );
    const storedCookies = setCookieHeadersFrom(response.headers)
      .map(parseSetCookieHeader)
      .filter((storedCookie): storedCookie is StoredCookie =>
        Boolean(storedCookie),
      );

    await persistServerCookies(storedCookies);
    return mergeCookieHeader(cookie, storedCookies);
  };

  if (typeof window === "undefined") {
    return refresh();
  }

  refreshRequest ??= refresh().finally(() => {
    refreshRequest = null;
  });
  return refreshRequest;
}

/**
 * In the browser, talk to the same-origin `/backend` rewrite (see
 * next.config.ts) so the API's `SameSite=Strict` cookies are stored and sent.
 * On the server there is no cookie jar, so call the API directly.
 */
const baseConfig = {
  baseURL:
    typeof window === "undefined"
      ? (process.env.NEXT_PUBLIC_API_URL ?? "")
      : "/backend",
  /** Send cookies for refresh / logout / cookie-based session with the API. */
  withCredentials: true,
  /**
   * Safety net for hung requests. Generous because AI-backed endpoints
   * (e.g. skill assessment generation) can legitimately take ~2 min.
   */
  timeout: 180_000,
  headers: {
    Accept: "application/json, multipart/form-data",
  },
} satisfies CreateAxiosDefaults;

export const publicApi = attachErrorInterceptor(axios.create(baseConfig));

export const authApi = axios.create(baseConfig);

authApi.interceptors.request.use(async (config) => {
  if (config.headers.get("Authorization")) {
    return config;
  }

  const token = await getAuthToken();
  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }
  return config;
});

authApi.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (!axios.isAxiosError(error)) {
      return Promise.reject(error);
    }

    const originalRequest = error.config as RetriableRequestConfig | undefined;
    const shouldRefresh =
      error.response?.status === 401 &&
      originalRequest != null &&
      !originalRequest._retry &&
      !isAuthRefreshRequest(originalRequest);

    if (!shouldRefresh) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const refreshedCookieHeader = await refreshAuthCookies();
      originalRequest.headers.delete("Authorization");
      if (refreshedCookieHeader) {
        originalRequest.headers.set("Cookie", refreshedCookieHeader);
      }
      return authApi(originalRequest);
    } catch (refreshError) {
      if (typeof window !== "undefined") {
        const { clearPersistedSessionState } =
          await import("@/lib/client-session-cleanup");
        const { signOut } = await import("next-auth/react");
        clearPersistedSessionState();
        await signOut({ callbackUrl: "/login" });
      }
      return Promise.reject(refreshError);
    }
  },
);

attachErrorInterceptor(authApi);
