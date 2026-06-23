import type { Label, LabelAlbumsResponse, LabelArtistsResponse } from "../Types/index.js";
import type { ApiContext } from "./ApiContext.js";

export class LabelApi {
  constructor(private ctx: ApiContext) {}

  /**
   * GET: /labels/{labelId}
   * @ru Получить информацию о лейбле.
   * @en Get label info.
   * @param labelId  Label ID.
   * @returns Promise with label info.
   */
  getLabel(labelId: number | string): Promise<Label> {
    return this.ctx.get(this.ctx.createRequest(`/labels/${labelId}`));
  }

  /**
   * GET: /labels/{labelId}/albums
   * @ru Получить альбомы лейбла.
   * @en Get label albums.
   * @param labelId  Label ID.
   * @param options  Pagination and sort options.
   * @returns Promise with albums.
   */
  getLabelAlbums(
    labelId: number | string,
    options: { page?: number; pageSize?: number; sortBy?: string; sortOrder?: string } = {},
  ): Promise<LabelAlbumsResponse> {
    const req = this.ctx.createRequest(`/labels/${labelId}/albums`);
    if (options.page !== undefined) req.addQuery({ page: String(options.page) });
    if (options.pageSize !== undefined) req.addQuery({ pageSize: String(options.pageSize) });
    if (options.sortBy !== undefined) req.addQuery({ sortBy: options.sortBy });
    if (options.sortOrder !== undefined) req.addQuery({ sortOrder: options.sortOrder });
    return this.ctx.get(req);
  }

  /**
   * GET: /labels/{labelId}/artists
   * @ru Получить артистов лейбла.
   * @en Get label artists.
   * @param labelId  Label ID.
   * @param options  Pagination options.
   * @returns Promise with artists.
   */
  getLabelArtists(
    labelId: number | string,
    options: { page?: number; pageSize?: number } = {},
  ): Promise<LabelArtistsResponse> {
    const req = this.ctx.createRequest(`/labels/${labelId}/artists`);
    if (options.page !== undefined) req.addQuery({ page: String(options.page) });
    if (options.pageSize !== undefined) req.addQuery({ pageSize: String(options.pageSize) });
    return this.ctx.get(req);
  }
}
