import type { GetAccountStatusResponse, GetFeedResponse } from "../Types/index.js";
import type { ApiContext } from "./ApiContext.js";

export class AccountApi {
  constructor(private ctx: ApiContext) {}

  /**
   * GET: /account/status
   * @ru Получить статус аккаунта текущего пользователя.
   * @en Get current user account status.
   * @returns Promise with account status.
   */
  getAccountStatus(): Promise<GetAccountStatusResponse> {
    return this.ctx.get(this.ctx.createRequest("/account/status"));
  }

  /**
   * GET: /feed
   * @ru Получить ленту пользователя (сгенерированные плейлисты, дни).
   * @en Get user feed (generated playlists, days).
   * @returns Promise with user feed.
   */
  getFeed(): Promise<GetFeedResponse> {
    return this.ctx.get(this.ctx.createRequest("/feed"));
  }
}
