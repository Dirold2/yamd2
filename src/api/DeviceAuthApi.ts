import { HyperClient } from "hyperttp";
import type { DeviceCode, OAuthToken } from "../Types/index.js";

export type OnCodeCallback = (code: DeviceCode) => void;

export class DeviceAuthApi {
  private readonly httpClient: HyperClient;

  constructor(httpClient?: HyperClient) {
    this.httpClient = httpClient ?? new HyperClient();
  }

  /**
   * POST: https://oauth.yandex.ru/device/code
   * @ru Запросить код устройства для OAuth-авторизации.
   * @en Request a device code for OAuth authorization.
   * @param options  Options (deviceId, deviceName, clientId).
   * @returns Promise with device code data.
   */
  async requestDeviceCode(
    options: {
      deviceId?: string;
      deviceName?: string;
      clientId?: string;
    } = {},
  ): Promise<DeviceCode> {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const randId = Array.from(
      { length: 10 },
      () => chars[Math.floor(Math.random() * chars.length)],
    ).join("");

    const body = new URLSearchParams({
      client_id: options.clientId ?? "23cabbbdc6cd418abb4b39c32c41195d",
      device_id: options.deviceId ?? randId,
      device_name: options.deviceName ?? "YandexMusicAPI",
    });

    const json = await this.httpClient.post<Record<string, unknown>>(
      "https://oauth.yandex.ru/device/code",
      "json",
      body,
    );

    if (json.error) {
      throw new Error(`Device code request failed: ${String(json.error)}`);
    }

    return {
      deviceCode: json.device_code as string,
      userCode: json.user_code as string,
      verificationUrl: json.verification_url as string,
      expiresIn: json.expires_in as number,
      interval: json.interval as number,
    };
  }

  /**
   * POST: https://oauth.yandex.ru/token
   * @ru Опросить токен по коду устройства.
   * @en Poll for token using device code.
   * @param deviceCode  Device code from requestDeviceCode.
   * @param options  Options (clientId, clientSecret).
   * @returns Promise with token or null if still pending.
   */
  async pollDeviceToken(
    deviceCode: string,
    options: {
      clientId?: string;
      clientSecret?: string;
    } = {},
  ): Promise<OAuthToken | null> {
    const body = new URLSearchParams({
      grant_type: "device_code",
      code: deviceCode,
      client_id: options.clientId ?? "23cabbbdc6cd418abb4b39c32c41195d",
      client_secret: options.clientSecret ?? "53bc75238f0c4d08a118e51fe9203300",
    });

    const json = await this.httpClient.post<Record<string, unknown>>(
      "https://oauth.yandex.ru/token",
      "json",
      body,
    );

    if (json.error === "authorization_pending") return null;

    if (json.error) {
      throw new Error(
        `OAuth error: ${String(json.error)} - ${String(json.error_description ?? "")}`,
      );
    }

    return {
      accessToken: json.access_token as string,
      uid: json.uid as number,
      tokenType: (json.token_type as string) ?? "bearer",
      expiresIn: json.expires_in as number,
    };
  }

  /**
   * @ru Полный цикл device auth: запрос кода, отображение пользователю, опрос токена.
   * @en Full device auth flow: request code, show to user, poll for token.
   * @param onCode  Callback with device code to display to user.
   * @param options  Flow options (pollInterval, timeout, shouldCancel, etc.).
   * @returns Promise with OAuth token.
   */
  async deviceAuth(
    onCode: OnCodeCallback,
    options: {
      pollInterval?: number;
      timeout?: number;
      shouldCancel?: () => boolean;
      deviceId?: string;
      deviceName?: string;
      clientId?: string;
      clientSecret?: string;
    } = {},
  ): Promise<OAuthToken> {
    const code = await this.requestDeviceCode(options);

    onCode(code);

    const interval = options.pollInterval ?? code.interval;
    const deadline = Date.now() + (options.timeout ?? code.expiresIn) * 1000;

    while (true) {
      if (options.shouldCancel?.()) {
        throw new Error("Device auth cancelled by caller");
      }

      const token = await this.pollDeviceToken(code.deviceCode, options);
      if (token) return token;

      if (Date.now() >= deadline) {
        throw new Error("Device auth timed out");
      }

      await new Promise((resolve) => setTimeout(resolve, interval * 1000));
    }
  }
}
