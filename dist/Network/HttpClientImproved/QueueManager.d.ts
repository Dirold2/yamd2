export declare class QueueManager {
    private maxConcurrent;
    private queue;
    private running;
    constructor(maxConcurrent?: number);
    enqueue<T>(executor: () => Promise<T>): Promise<T>;
}
