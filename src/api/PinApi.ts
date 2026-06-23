import type { Pin } from "../Types/index.js";
import type { ApiContext } from "./ApiContext.js";

export class PinApi {
  constructor(private ctx: ApiContext) {}

  /**
   * GET: /pins
   * @ru Получить закреплённые сущности пользователя.
   * @en Get user pinned entities.
   * @returns Promise with pinned items.
   */
  getPins(): Promise<Pin[]> {
    return this.ctx.get(this.ctx.createRequest("/pins"));
  }
}
