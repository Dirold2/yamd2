import type { MusicHistoryResponse } from "../Types/index.js";
import type { ApiContext } from "./ApiContext.js";
export declare class MusicHistoryApi {
    private ctx;
    constructor(ctx: ApiContext);
    /**
     * GET: /music-history
     * @ru Получить историю прослушиваний.
     * @en Get listening history.
     * @param page  Page number.
     * @param pageSize  Page size.
     * @returns Promise with history.
     */
    getMusicHistory(page?: number, pageSize?: number): Promise<MusicHistoryResponse>;
}
