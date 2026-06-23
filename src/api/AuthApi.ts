import { authRequest } from "../PreparedRequest/index.js";
import type { ApiInitConfig, InitResponse } from "../Types/index.js";
import { AuthError } from "../Types/index.js";
import type { ApiContext } from "./ApiContext.js";

export class AuthApi {
  constructor(private ctx: ApiContext) {}

  /**
   * POST: /token
   * @ru Инициализировать API: аутентификация через токен или логин/пароль.
   * @en Initialize the API: authenticate via token or username/password.
   * @param config  Init config (access_token + uid or username + password).
   * @returns Promise with auth data.
   */
  async init(config: ApiInitConfig): Promise<InitResponse> {
    if (config.access_token && config.uid) {
      this.ctx.user.token = config.access_token;
      this.ctx.user.uid = config.uid;
      return { access_token: config.access_token, uid: config.uid };
    }

    if (!config.username || !config.password) {
      throw new AuthError("username && password || access_token && uid must be set");
    }

    this.ctx.user.username = config.username;
    this.ctx.user.password = config.password;

    const data = await this.ctx.get<InitResponse>(
      authRequest().setPath("/token").setQuery({
        grant_type: "password",
        username: this.ctx.user.username,
        password: this.ctx.user.password,
        client_id: this.ctx.config.oauth.CLIENT_ID,
        client_secret: this.ctx.config.oauth.CLIENT_SECRET,
      }),
    );

    this.ctx.user.token = data.access_token;
    this.ctx.user.uid = data.uid;
    return data;
  }
}
