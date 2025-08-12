import type { HttpClientInterface, Method, Response, RequestInterface } from "../Types/request";
export default class HttpClient implements HttpClientInterface {
    private static readonly USER_AGENTS;
    private static readonly ACCEPT_LANGUAGES;
    private cookieJar;
    private lastRequestTime;
    private requestCount;
    private getRandomUserAgent;
    private getRandomAcceptLanguage;
    private addDelay;
    private getBrowserHeaders;
    private updateCookies;
    private getCookieString;
    private handleCaptchaResponse;
    _sendRequest(method: Method, request: RequestInterface): Promise<Response>;
    get(request: RequestInterface): Promise<Response>;
    post(request: RequestInterface): Promise<Response>;
    clearCookies(): void;
    getRequestStats(): {
        requestCount: number;
        cookieCount: number;
    };
}
