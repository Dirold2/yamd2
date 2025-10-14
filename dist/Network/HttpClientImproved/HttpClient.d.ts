import type { HttpClientInterface, RequestInterface } from "../../Types/request";
export declare class HttpClientImproved implements HttpClientInterface {
    private cookieJar;
    private agent;
    private cache;
    private queue;
    private limiter;
    private inflight;
    private retryOptions;
    private defaultHeaders;
    constructor(options?: any);
    setDefaultHeaders(headers: Record<string, string>): void;
    private decompress;
    private sendWithRetry;
    private calcDelay;
    private sleep;
    private parseResponse;
    private request;
    get(req: RequestInterface): Promise<any>;
    post(req: RequestInterface): Promise<any>;
    put(req: RequestInterface): Promise<any>;
    delete(req: RequestInterface): Promise<any>;
    clearCache(): void;
}
