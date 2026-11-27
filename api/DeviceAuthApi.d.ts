import { HyperClient } from "hyperttp";
import type { DeviceCode, OAuthToken } from "../Types/index.js";
export type OnCodeCallback = (code: DeviceCode) => void;
export declare class DeviceAuthApi {
    private readonly httpClient;
    constructor(httpClient?: HyperClient);
    /**
     * POST: https://oauth.yandex.ru/device/code
     * @ru Запросить код устройства для OAuth-авторизации.
     * @en Request a device code for OAuth authorization.
     * @param options  Options (deviceId, deviceName, clientId).
     * @returns Promise with device code data.
     */
    requestDeviceCode(options?: {
        deviceId?: string;
        deviceName?: string;
        clientId?: string;
    }): Promise<DeviceCode>;
    /**
     * POST: https://oauth.yandex.ru/token
     * @ru Опросить токен по коду устройства.
     * @en Poll for token using device code.
     * @param deviceCode  Device code from requestDeviceCode.
     * @param options  Options (clientId, clientSecret).
     * @returns Promise with token or null if still pending.
     */
    pollDeviceToken(deviceCode: string, options?: {
        clientId?: string;
        clientSecret?: string;
    }): Promise<OAuthToken | null>;
    /**
     * @ru Полный цикл device auth: запрос кода, отображение пользователю, опрос токена.
     * @en Full device auth flow: request code, show to user, poll for token.
     * @param onCode  Callback with device code to display to user.
     * @param options  Flow options (pollInterval, timeout, shouldCancel, etc.).
     * @returns Promise with OAuth token.
     */
    deviceAuth(onCode: OnCodeCallback, options?: {
        pollInterval?: number;
        timeout?: number;
        shouldCancel?: () => boolean;
        deviceId?: string;
        deviceName?: string;
        clientId?: string;
        clientSecret?: string;
    }): Promise<OAuthToken>;
}
