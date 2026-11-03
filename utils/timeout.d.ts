export declare function withTimeout<T>(promise: Promise<T>, timeoutMs: number, errorMessage?: string): Promise<T>;
export declare function withRetry<T>(fn: () => Promise<T>, retries: number, onError?: (error: unknown, attempt: number) => void): Promise<T>;
