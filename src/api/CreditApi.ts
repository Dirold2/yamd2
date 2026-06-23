import type { CreditsResponse } from "../Types/index.js";
import type { ApiContext } from "./ApiContext.js";

export class CreditApi {
  constructor(private ctx: ApiContext) {}

  /**
   * GET: /tracks/{trackId}/credits
   * @ru Получить авторов и исполнителей трека.
   * @en Get track credits (authors, performers).
   * @param trackId  Track ID.
   * @returns Promise with credits.
   */
  getTrackCredits(trackId: number | string): Promise<CreditsResponse> {
    return this.ctx.get(this.ctx.createRequest(`/tracks/${trackId}/credits`));
  }

  /**
   * GET: /clips/{clipId}/credits
   * @ru Получить авторов и исполнителей клипа.
   * @en Get clip credits (authors, performers).
   * @param clipId  Clip ID.
   * @returns Promise with credits.
   */
  getClipCredits(clipId: number | string): Promise<CreditsResponse> {
    return this.ctx.get(this.ctx.createRequest(`/clips/${clipId}/credits`));
  }
}
