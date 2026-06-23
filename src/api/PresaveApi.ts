import type { PresavesResponse } from "../Types/index.js";
import type { ApiContext } from "./ApiContext.js";

type UserIdParam = number | string | null;

export class PresaveApi {
  constructor(private ctx: ApiContext) {}

  /**
   * GET: /users/{userId}/presaves
   * @ru Получить пресейвы (предзаказы) пользователя.
   * @en Get user presaves.
   * @param options  Filter options (includeReleased, includeUpcoming, userId).
   * @returns Promise with presaves.
   */
  getPresaves(
    options: { includeReleased?: boolean; includeUpcoming?: boolean; userId?: UserIdParam } = {},
  ): Promise<PresavesResponse> {
    const uid = this.ctx.resolveUserId(options.userId ?? null);
    const req = this.ctx.createRequest(`/users/${uid}/presaves`);
    if (options.includeReleased !== undefined)
      req.addQuery({ includeReleased: String(options.includeReleased) });
    if (options.includeUpcoming !== undefined)
      req.addQuery({ includeUpcoming: String(options.includeUpcoming) });
    return this.ctx.get(req);
  }

  /**
   * POST: /users/{userId}/presaves/add
   * @ru Добавить пресейв на альбом.
   * @en Add a presave for an album.
   * @param albumId  Album ID.
   * @param options  Options (likeAfterRelease, userId).
   * @returns Promise with confirmation.
   */
  addPresave(
    albumId: number | string,
    options: { likeAfterRelease?: boolean; userId?: UserIdParam } = {},
  ): Promise<"ok" | string> {
    const uid = this.ctx.resolveUserId(options.userId ?? null);
    const req = this.ctx.createRequest(`/users/${uid}/presaves/add`).addQuery({
      albumId: String(albumId),
      likeAfterRelease: String(options.likeAfterRelease ?? true),
    });
    return this.ctx.post(req);
  }

  /**
   * POST: /users/{userId}/presaves/remove
   * @ru Удалить пресейв с альбома.
   * @en Remove a presave for an album.
   * @param albumId  Album ID.
   * @param options  Options (userId).
   * @returns Promise with confirmation.
   */
  removePresave(
    albumId: number | string,
    options: { userId?: UserIdParam } = {},
  ): Promise<"ok" | string> {
    const uid = this.ctx.resolveUserId(options.userId ?? null);
    const req = this.ctx.createRequest(`/users/${uid}/presaves/remove`).addQuery({
      albumId: String(albumId),
    });
    return this.ctx.post(req);
  }
}
