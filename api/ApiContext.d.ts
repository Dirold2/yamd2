import { HyperClient, Request } from "hyperttp";
import type { HttpClientOptions, RequestInterface, ResponseType } from "@hyperttp/types";
import type { ApiConfig, ApiUser, Codecs, Transport } from "../Types/index.js";
export declare const DEFAULT_HTTP_CONFIG: HttpClientOptions;
export type UserId = number | string | null;
export declare class ApiContext {
    readonly httpClient: HyperClient;
    readonly config: ApiConfig;
    readonly user: ApiUser;
    private serverOffsetCache;
    constructor(httpClient?: HyperClient, config?: ApiConfig);
    get authHeader(): {
        Authorization: string;
    };
    get deviceHeader(): {
        "X-Yandex-Music-Device": string;
    };
    resolveUserId(userId: UserId): number | string;
    assertAuthenticated(): void;
    createRequest(path: string): Request;
    get<T>(request: RequestInterface, responseType?: ResponseType): Promise<T>;
    getRaw<T>(request: RequestInterface, responseType?: ResponseType): Promise<T>;
    post<T>(request: RequestInterface, responseType?: ResponseType): Promise<T>;
    postRaw<T>(request: RequestInterface, responseType?: ResponseType): Promise<T>;
    readonly DIRECT_LINK_SALT = "XGRlBW9FXlekgbPrRHuSiA";
    getYandexServerOffset(retries?: number, timeoutMs?: number): Promise<number>;
    generateTrackSignature(ts: number, trackId: string, quality: string, codecs: Codecs, transports: Transport): string;
    static createTrackDirectLink(downloadInfo: {
        host: string;
        path: string;
        ts: string;
        s: string;
    }): string;
}
