import type { ApiInitConfig, InitResponse } from "../Types/index.js";
import type { ApiContext } from "./ApiContext.js";
export declare class AuthApi {
    private ctx;
    constructor(ctx: ApiContext);
    /**
     * POST: /token
     * @ru Инициализировать API: аутентификация через токен или логин/пароль.
     * @en Initialize the API: authenticate via token or username/password.
     * @param config  Init config (access_token + uid or username + password).
     * @returns Promise with auth data.
     */
    init(config: ApiInitConfig): Promise<InitResponse>;
}
