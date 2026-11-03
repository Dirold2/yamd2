import { HyperClient, Request } from "hyperttp";
import type { HyperClientOptions } from "@hyperttp/types";
import type { ApiConfig, ApiUser, Codecs, Transport } from "../Types/index.js";
interface ApiGetOptions {
    headers?: Record<string, string>;
    query?: Record<string, string>;
    responseType?: ResponseType;
}
export declare const DEFAULT_HTTP_CONFIG: HyperClientOptions;
type ResponseType = "json" | "xml";
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
    getApiRaw<T>(path: string, options?: ApiGetOptions): Promise<T>;
    getApi<T>(path: string, options?: ApiGetOptions): Promise<T>;
    get<T>(request: Request, responseType?: ResponseType): Promise<T>;
    getRaw<T>(request: Request, responseType?: ResponseType): Promise<T>;
    post<T>(request: Request, responseType?: ResponseType): Promise<T>;
    postRaw<T>(request: Request, responseType?: ResponseType): Promise<T>;
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
export {};
