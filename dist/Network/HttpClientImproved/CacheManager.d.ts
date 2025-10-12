export declare class CacheManager {
    private cache;
    private ttl;
    constructor(options?: {
        cacheTTL?: number;
        cacheMaxSize?: number;
    });
    get<T>(key: string): T | null;
    set<T>(key: string, value: T): void;
    clear(): void;
}
