import type { CreditsResponse } from "../Types/index.js";
import type { ApiContext } from "./ApiContext.js";
export declare class CreditApi {
    private ctx;
    constructor(ctx: ApiContext);
    /**
     * GET: /tracks/{trackId}/credits
     * @ru Получить авторов и исполнителей трека.
     * @en Get track credits (authors, performers).
     * @param trackId  Track ID.
     * @returns Promise with credits.
     */
    getTrackCredits(trackId: number | string): Promise<CreditsResponse>;
    /**
     * GET: /clips/{clipId}/credits
     * @ru Получить авторов и исполнителей клипа.
     * @en Get clip credits (authors, performers).
     * @param clipId  Clip ID.
     * @returns Promise with credits.
     */
    getClipCredits(clipId: number | string): Promise<CreditsResponse>;
}
