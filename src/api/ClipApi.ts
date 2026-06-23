import type { Clip, ClipsWillLikeResponse } from "../Types/index.js";
import type { ApiContext } from "./ApiContext.js";

export class ClipApi {
  constructor(private ctx: ApiContext) {}

  /**
   * GET: /clips
   * @ru Получить клипы по их ID.
   * @en Get clips by IDs.
   * @param clipIds  Array of clip IDs.
   * @returns Promise with an array of clips.
   */
  getClips(clipIds: (number | string)[]): Promise<Clip[]> {
    return this.ctx.get(this.ctx.createRequest("/clips").addQuery({ clipIds: clipIds.join(",") }));
  }

  /**
   * GET: /clips/will/like
   * @ru Получить клипы, которые понравятся пользователю.
   * @en Get clips the user will likely like.
   * @param page  Page number.
   * @param pageSize  Page size.
   * @returns Promise with a selection of clips.
   */
  getClipsWillLike(page = 0, pageSize = 50): Promise<ClipsWillLikeResponse> {
    return this.ctx.get(
      this.ctx.createRequest("/clips/will/like").addQuery({
        page: String(page),
        pageSize: String(pageSize),
      }),
    );
  }
}
