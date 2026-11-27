import type { Label, LabelAlbumsResponse, LabelArtistsResponse } from "../Types/index.js";
import type { ApiContext } from "./ApiContext.js";
export declare class LabelApi {
    private ctx;
    constructor(ctx: ApiContext);
    /**
     * GET: /labels/{labelId}
     * @ru Получить информацию о лейбле.
     * @en Get label info.
     * @param labelId  Label ID.
     * @returns Promise with label info.
     */
    getLabel(labelId: number | string): Promise<Label>;
    /**
     * GET: /labels/{labelId}/albums
     * @ru Получить альбомы лейбла.
     * @en Get label albums.
     * @param labelId  Label ID.
     * @param options  Pagination and sort options.
     * @returns Promise with albums.
     */
    getLabelAlbums(labelId: number | string, options?: {
        page?: number;
        pageSize?: number;
        sortBy?: string;
        sortOrder?: string;
    }): Promise<LabelAlbumsResponse>;
    /**
     * GET: /labels/{labelId}/artists
     * @ru Получить артистов лейбла.
     * @en Get label artists.
     * @param labelId  Label ID.
     * @param options  Pagination options.
     * @returns Promise with artists.
     */
    getLabelArtists(labelId: number | string, options?: {
        page?: number;
        pageSize?: number;
    }): Promise<LabelArtistsResponse>;
}
