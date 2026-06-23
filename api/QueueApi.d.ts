import type { QueuesResponse, QueueResponse } from "../Types/index.js";
import type { ApiContext } from "./ApiContext.js";
export declare class QueueApi {
    private ctx;
    constructor(ctx: ApiContext);
    /**
     * GET: /queues
     * @ru Получить все очереди воспроизведения.
     * @en Get all playback queues.
     * @returns Promise with queues.
     */
    getQueues(): Promise<QueuesResponse>;
    /**
     * GET: /queues/{queueId}
     * @ru Получить очередь воспроизведения по ID.
     * @en Get a playback queue by ID.
     * @param queueId  Queue ID.
     * @returns Promise with queue.
     */
    getQueue(queueId: string): Promise<QueueResponse>;
}
