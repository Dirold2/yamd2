import { HyperClient, Request } from "hyperttp";
import type { HttpClientOptions, RequestInterface, ResponseType } from "@hyperttp/types";
import { createHash, createHmac } from "crypto";
import { apiRequest } from "../PreparedRequest/index.js";
import fallbackConfig from "../PreparedRequest/config.js";
import type { ApiConfig, ApiUser, Codecs, Transport } from "../Types/index.js";
import { AuthError } from "../Types/index.js";
import { withRetry } from "../utils/timeout.js";

interface ApiResponse<T> {
  invocationInfo: unknown;
  result: T;
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
} as HttpClientOptions;

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

  constructor(httpClient?: HyperClient, config?: ApiConfig) {
    this.httpClient = httpClient ?? new HyperClient(DEFAULT_HTTP_CONFIG);
    this.config = config ?? fallbackConfig;
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

  async get<T>(request: RequestInterface, responseType: ResponseType = "json"): Promise<T> {
    const response = await this.httpClient.get<ApiResponse<T>>(request, responseType);
    return response.result;
  }

  async getRaw<T>(request: RequestInterface, responseType: ResponseType = "json"): Promise<T> {
    return this.httpClient.get<T>(request, responseType);
  }

  async post<T>(request: RequestInterface, responseType: ResponseType = "json"): Promise<T> {
    const response = await this.httpClient.post<ApiResponse<T>>(request, responseType);
    return response.result;
  }

  async postRaw<T>(request: RequestInterface, responseType: ResponseType = "json"): Promise<T> {
    return this.httpClient.post<T>(request, responseType);
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
