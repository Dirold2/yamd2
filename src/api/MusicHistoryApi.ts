import type { MusicHistoryResponse } from "../Types/index.js";
import type { ApiContext } from "./ApiContext.js";

export class MusicHistoryApi {
  constructor(private ctx: ApiContext) {}

  /**
   * GET: /music-history
   * @ru Получить историю прослушиваний.
   * @en Get listening history.
   * @param page  Page number.
   * @param pageSize  Page size.
   * @returns Promise with history.
   */
  getMusicHistory(page = 0, pageSize = 50): Promise<MusicHistoryResponse> {
    return this.ctx.getRaw(
      this.ctx.createRequest("/music-history").addQuery({
        page: String(page),
        pageSize: String(pageSize),
      }),
    );
  }
}
