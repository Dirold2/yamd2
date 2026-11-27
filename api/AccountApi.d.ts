import type { GetAccountStatusResponse, GetFeedResponse } from "../Types/index.js";
import type { ApiContext } from "./ApiContext.js";
export declare class AccountApi {
    private ctx;
    constructor(ctx: ApiContext);
    /**
     * GET: /account/status
     * @ru Получить статус аккаунта текущего пользователя.
     * @en Get current user account status.
     * @returns Promise with account status.
     */
    getAccountStatus(): Promise<GetAccountStatusResponse>;
    /**
     * GET: /feed
     * @ru Получить ленту пользователя (сгенерированные плейлисты, дни).
     * @en Get user feed (generated playlists, days).
     * @returns Promise with user feed.
     */
    getFeed(): Promise<GetFeedResponse>;
}
