import type { Pin } from "../Types/index.js";
import type { ApiContext } from "./ApiContext.js";
export declare class PinApi {
    private ctx;
    constructor(ctx: ApiContext);
    /**
     * GET: /pins
     * @ru Получить закреплённые сущности пользователя.
     * @en Get user pinned entities.
     * @returns Promise with pinned items.
     */
    getPins(): Promise<Pin[]>;
}
