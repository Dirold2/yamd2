import type { Disclaimer } from "../Types/index.js";
import type { ApiContext } from "./ApiContext.js";

export class DisclaimerApi {
  constructor(private ctx: ApiContext) {}

  /**
   * GET: /tracks/{trackId}/disclaimer
   * @ru Получить дисклеймер трека.
   * @en Get track disclaimer.
   * @param trackId  Track ID.
   * @returns Promise with disclaimer.
   */
  getTrackDisclaimer(trackId: number | string): Promise<Disclaimer> {
    return this.ctx.get(this.ctx.createRequest(`/tracks/${trackId}/disclaimer`));
  }

  /**
   * GET: /albums/{albumId}/disclaimer
   * @ru Получить дисклеймер альбома.
   * @en Get album disclaimer.
   * @param albumId  Album ID.
   * @returns Promise with disclaimer.
   */
  getAlbumDisclaimer(albumId: number | string): Promise<Disclaimer> {
    return this.ctx.get(this.ctx.createRequest(`/albums/${albumId}/disclaimer`));
  }

  /**
   * GET: /artists/{artistId}/disclaimer
   * @ru Получить дисклеймер артиста.
   * @en Get artist disclaimer.
   * @param artistId  Artist ID.
   * @returns Promise with disclaimer.
   */
  getArtistDisclaimer(artistId: number | string): Promise<Disclaimer> {
    return this.ctx.get(this.ctx.createRequest(`/artists/${artistId}/disclaimer`));
  }

  /**
   * GET: /clips/{clipId}/disclaimer
   * @ru Получить дисклеймер клипа.
   * @en Get clip disclaimer.
   * @param clipId  Clip ID.
   * @returns Promise with disclaimer.
   */
  getClipDisclaimer(clipId: number | string): Promise<Disclaimer> {
    return this.ctx.get(this.ctx.createRequest(`/clips/${clipId}/disclaimer`));
  }
}
