import type { Clip, ClipsWillLikeResponse } from "../Types/index.js";
import type { ApiContext } from "./ApiContext.js";
export declare class ClipApi {
    private ctx;
    constructor(ctx: ApiContext);
    /**
     * GET: /clips
     * @ru Получить клипы по их ID.
     * @en Get clips by IDs.
     * @param clipIds  Array of clip IDs.
     * @returns Promise with an array of clips.
     */
    getClips(clipIds: (number | string)[]): Promise<Clip[]>;
    /**
     * GET: /clips/will/like
     * @ru Получить клипы, которые понравятся пользователю.
     * @en Get clips the user will likely like.
     * @param page  Page number.
     * @param pageSize  Page size.
     * @returns Promise with a selection of clips.
     */
    getClipsWillLike(page?: number, pageSize?: number): Promise<ClipsWillLikeResponse>;
}
