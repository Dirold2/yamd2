import type { PresavesResponse } from "../Types/index.js";
import type { ApiContext } from "./ApiContext.js";
type UserIdParam = number | string | null;
export declare class PresaveApi {
    private ctx;
    constructor(ctx: ApiContext);
    /**
     * GET: /users/{userId}/presaves
     * @ru Получить пресейвы (предзаказы) пользователя.
     * @en Get user presaves.
     * @param options  Filter options (includeReleased, includeUpcoming, userId).
     * @returns Promise with presaves.
     */
    getPresaves(options?: {
        includeReleased?: boolean;
        includeUpcoming?: boolean;
        userId?: UserIdParam;
    }): Promise<PresavesResponse>;
    /**
     * POST: /users/{userId}/presaves/add
     * @ru Добавить пресейв на альбом.
     * @en Add a presave for an album.
     * @param albumId  Album ID.
     * @param options  Options (likeAfterRelease, userId).
     * @returns Promise with confirmation.
     */
    addPresave(albumId: number | string, options?: {
        likeAfterRelease?: boolean;
        userId?: UserIdParam;
    }): Promise<"ok" | string>;
    /**
     * POST: /users/{userId}/presaves/remove
     * @ru Удалить пресейв с альбома.
     * @en Remove a presave for an album.
     * @param albumId  Album ID.
     * @param options  Options (userId).
     * @returns Promise with confirmation.
     */
    removePresave(albumId: number | string, options?: {
        userId?: UserIdParam;
    }): Promise<"ok" | string>;
}
export {};
