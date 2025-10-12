export declare class RateLimiter {
    private timestamps;
    private max;
    private window;
    constructor(config?: {
        maxRequests?: number;
        windowMs?: number;
    });
    wait(): Promise<void>;
}
