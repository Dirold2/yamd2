import type { HttpClientInterface, Response, RequestInterface } from "../Types/request";
export default class HttpClient implements HttpClientInterface {
    private cookieJar;
    private agent;
    private cache;
    private cacheTTL;
    private retryOptions;
    constructor(options?: {
        cacheTTL?: number;
        cacheMaxSize?: number;
        maxRetries?: number;
    });
    private decompressBody;
    private getCacheKey;
    private getCachedResponse;
    private sleep;
    private _sendRequestWithRetry;
    private _sendRequestUndici;
    get(requestObj: RequestInterface, useCache?: boolean): Promise<Response>;
    post(requestObj: RequestInterface): Promise<Response>;
    clearCache(): void;
    getCacheStats(): {
        size: number;
        maxSize: number;
    };
    getCookies(url: string): Promise<string>;
}
