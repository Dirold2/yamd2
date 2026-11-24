import { HyperClient, Request } from "hyperttp";
import type { HyperClientOptions } from "@hyperttp/types";
import { createHash, createHmac } from "crypto";
import { apiRequest } from "../PreparedRequest/index.js";
import fallbackConfig from "../PreparedRequest/config.js";
import type { ApiConfig, ApiUser, Codecs, Transport } from "../Types/index.js";
import { AuthError, YMApiError } from "../Types/index.js";
import { withRetry } from "../utils/timeout.js";

interface ApiResponse<T> {
  invocationInfo: unknown;
  result: T;
  error?: unknown;
}

function getApiErrorMessage(error: unknown): string {
  if (typeof error === "string") return error;

  if (error && typeof error === "object") {
    const message = "message" in error && typeof error.message === "string" ? error.message : null;
    const name = "name" in error && typeof error.name === "string" ? error.name : null;
    const code = "code" in error && typeof error.code === "string" ? error.code : null;
    return [name, code, message].filter(Boolean).join(": ") || "unknown API error";
  }

  return "unknown API error";
}

interface ApiGetOptions {
  headers?: Record<string, string>;
  query?: Record<string, string>;
  responseType?: ResponseType;
}

function serializeRequestBody(body: unknown): unknown {
  return body instanceof URLSearchParams ? body.toString() : body;
}

function unwrapApiResponse<T>(response: ApiResponse<T> | null | undefined): T {
  if (response == null) {
    throw new AuthError("Yandex Music API returned an empty response; verify the OAuth token");
  }

  if (typeof response !== "object" || !("result" in response)) {
    if (response && typeof response === "object" && "error" in response) {
      throw new YMApiError(
        `Yandex Music API error: ${getApiErrorMessage((response as { error?: unknown }).error)}`,
        "API_ERROR",
      );
    }

    throw new YMApiError(
      "Yandex Music API response is missing the result field",
      "INVALID_RESPONSE",
    );
  }

  return response.result;
}

const SIGNATURE_KEY = "kzqU4XhfCaY6B6JTHODeq5";
const DIRECT_LINK_SALT = "XGRlBW9FXlekgbPrRHuSiA";
const SERVER_OFFSET_CACHE_TTL = 300_000;

interface ServerOffsetCache {
  value: number;
  timestamp: number;
}

export const DEFAULT_HTTP_CONFIG = {
  network: {
    timeout: 10000,
    maxConcurrent: 20,
    userAgent: "YandexMusicDesktopAppWindows/5.13.2",
  },
  retry: {
    maxRetries: 2,
  },
  cache: {
    enabled: true,
    ttl: 60000,
  },
  rateLimit: {
    enabled: true,
  },
  queue: {
    enabled: true,
  },
  verbose: true,
} as HyperClientOptions;

type ResponseType = "json" | "xml";

export type UserId = number | string | null;

export class ApiContext {
  readonly httpClient: HyperClient;
  readonly config: ApiConfig;
  readonly user: ApiUser = {
    password: "",
    token: "",
    uid: 0,
    username: "",
  };

  private serverOffsetCache: ServerOffsetCache | null = null;

  constructor(httpClient?: HyperClient, config: ApiConfig = fallbackConfig) {
    this.config = config;
    const { scheme, host, port } = fallbackConfig.api;
    const baseURL = `${scheme}://${host}${port === 443 ? "" : `:${port}`}`;
    this.httpClient = httpClient ?? new HyperClient({ baseURL });
  }

  get authHeader(): { Authorization: string } {
    return { Authorization: `OAuth ${this.user.token}` };
  }

  get deviceHeader(): { "X-Yandex-Music-Device": string } {
    return {
      "X-Yandex-Music-Device":
        "os=unknown; os_version=unknown; manufacturer=unknown; model=unknown; clid=; device_id=unknown; uuid=unknown",
    };
  }

  resolveUserId(userId: UserId): number | string {
    return userId == null || userId === 0 || userId === "" ? this.user.uid : userId;
  }

  assertAuthenticated(): void {
    if (!this.user.token) {
      throw new AuthError("User token is missing");
    }
  }

  createRequest(path: string): Request {
    return apiRequest().setPath(path).addHeaders(this.authHeader);
  }

  async getApiRaw<T>(path: string, options: ApiGetOptions = {}): Promise<T> {
    const { headers = {}, query, responseType = "json" } = options;
    return this.httpClient.get<T>(path, {
      headers: { ...this.authHeader, ...headers },
      query,
      responseType,
    });
  }

  async getApi<T>(path: string, options: ApiGetOptions = {}): Promise<T> {
    return unwrapApiResponse(await this.getApiRaw<ApiResponse<T>>(path, options));
  }

  async get<T>(request: Request, responseType: ResponseType = "json"): Promise<T> {
    const response = await this.httpClient.get<ApiResponse<T>>(request.url, {
      headers: request.headers,
      responseType,
    });
    return unwrapApiResponse(response);
  }

  async getRaw<T>(request: Request, responseType: ResponseType = "json"): Promise<T> {
    return this.httpClient.get<T>(request.url, { headers: request.headers, responseType });
  }

  async post<T>(request: Request, responseType: ResponseType = "json"): Promise<T> {
    const response = await this.httpClient.post<ApiResponse<T>>(
      request.url,
      serializeRequestBody(request.body),
      {
        headers: request.headers,
        responseType,
      },
    );
    return unwrapApiResponse(response);
  }

  async postRaw<T>(request: Request, responseType: ResponseType = "json"): Promise<T> {
    return this.httpClient.post<T>(request.url, serializeRequestBody(request.body), {
      headers: request.headers,
      responseType,
    });
  }

  readonly DIRECT_LINK_SALT = DIRECT_LINK_SALT;

  async getYandexServerOffset(retries = 3, timeoutMs = 2000): Promise<number> {
    if (this.serverOffsetCache) {
      const age = Date.now() - this.serverOffsetCache.timestamp;
      if (age < SERVER_OFFSET_CACHE_TTL) {
        return this.serverOffsetCache.value;
      }
    }

    const fetchOffset = async (): Promise<number> => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

      try {
        const resp = await fetch("https://api.music.yandex.net", {
          signal: controller.signal,
        });

        const dateHeader = resp.headers.get("Date");
        if (!dateHeader) throw new Error("Date header missing");

        const serverTime = Math.floor(new Date(dateHeader).getTime() / 1000);
        const localTime = Math.floor(Date.now() / 1000);
        const offset = serverTime - localTime;

        this.serverOffsetCache = { value: offset, timestamp: Date.now() };
        return offset;
      } finally {
        clearTimeout(timeoutId);
      }
    };

    try {
      return await withRetry(fetchOffset, retries);
    } catch {
      return 0;
    }
  }

  generateTrackSignature(
    ts: number,
    trackId: string,
    quality: string,
    codecs: Codecs,
    transports: Transport,
  ): string {
    const signBase = `${ts}${trackId}${quality}${codecs}${transports}`.replace(/,/g, "");
    return Buffer.from(createHmac("sha256", SIGNATURE_KEY).update(signBase).digest())
      .toString("base64")
      .replace(/=+$/, "");
  }

  static createTrackDirectLink(downloadInfo: {
    host: string;
    path: string;
    ts: string;
    s: string;
  }): string {
    const { host, path, ts, s } = downloadInfo;
    const sign = createHash("md5")
      .update(DIRECT_LINK_SALT + path.slice(1) + s)
      .digest("hex");
    return `https://${host}/get-mp3/${sign}/${ts}${path}`;
  }
}
