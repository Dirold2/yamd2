"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const undici_1 = require("undici");
class HttpClient {
    constructor() {
        this.cookieJar = new Map();
        this.lastRequestTime = 0;
        this.requestCount = 0;
    }
    getRandomUserAgent() {
        return HttpClient.USER_AGENTS[Math.floor(Math.random() * HttpClient.USER_AGENTS.length)];
    }
    getRandomAcceptLanguage() {
        return HttpClient.ACCEPT_LANGUAGES[Math.floor(Math.random() * HttpClient.ACCEPT_LANGUAGES.length)];
    }
    async addDelay() {
        const now = Date.now();
        const timeSinceLastRequest = now - this.lastRequestTime;
        const minDelay = 500;
        const maxDelay = 2000;
        const randomDelay = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
        if (timeSinceLastRequest < randomDelay) {
            await new Promise((resolve) => setTimeout(resolve, randomDelay - timeSinceLastRequest));
        }
        this.lastRequestTime = Date.now();
    }
    getBrowserHeaders() {
        return {
            "User-Agent": this.getRandomUserAgent(),
            Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
            "Accept-Language": this.getRandomAcceptLanguage(),
            "Accept-Encoding": "gzip, deflate, br",
            DNT: "1",
            Connection: "keep-alive",
            "Upgrade-Insecure-Requests": "1",
            "Sec-Fetch-Dest": "document",
            "Sec-Fetch-Mode": "navigate",
            "Sec-Fetch-Site": "none",
            "Sec-Fetch-User": "?1",
            "Cache-Control": "max-age=0",
        };
    }
    updateCookies(response) {
        const setCookieHeaders = response.headers.get("set-cookie");
        if (setCookieHeaders) {
            const cookies = setCookieHeaders.split(",");
            cookies.forEach((cookie) => {
                const [nameValue] = cookie.split(";");
                const [name, value] = nameValue.split("=");
                if (name && value) {
                    this.cookieJar.set(name.trim(), value.trim());
                }
            });
        }
    }
    getCookieString() {
        const cookies = Array.from(this.cookieJar.entries())
            .map(([name, value]) => `${name}=${value}`)
            .join("; ");
        return cookies;
    }
    async handleCaptchaResponse(response, url) {
        const responseText = await response.text();
        if (response.status === 403 && responseText.includes("smart-captcha")) {
            console.warn("Captcha detected, implementing bypass strategy...");
            await this.addDelay();
            const retryHeaders = {
                ...this.getBrowserHeaders(),
                Referer: "https://music.yandex.ru/",
                Origin: "https://music.yandex.ru",
            };
            const cookieString = this.getCookieString();
            if (cookieString) {
                retryHeaders["Cookie"] = cookieString;
            }
            const retryResponse = await (0, undici_1.fetch)(url, {
                method: "GET",
                headers: retryHeaders,
            });
            if (retryResponse.ok) {
                this.updateCookies(retryResponse);
                return retryResponse;
            }
        }
        return new globalThis.Response(responseText, {
            status: response.status,
            statusText: response.statusText,
            headers: response.headers,
        });
    }
    async _sendRequest(method, request) {
        await this.addDelay();
        const url = request.getURL();
        const requestHeaders = request.getHeaders();
        const headers = {
            ...this.getBrowserHeaders(),
            ...requestHeaders,
        };
        const cookieString = this.getCookieString();
        if (cookieString) {
            headers["Cookie"] = cookieString;
        }
        if (url.includes("music.yandex.ru") || url.includes("api.music.yandex.net")) {
            headers["Referer"] = "https://music.yandex.ru/";
            headers["Origin"] = "https://music.yandex.ru";
            headers["X-Requested-With"] = "XMLHttpRequest";
        }
        let body = undefined;
        if (method.toUpperCase() === "POST") {
            body = request.getBodyDataString();
            const hasContentTypeHeader = Object.keys(headers).some((h) => h.toLowerCase() === "content-type");
            if (!hasContentTypeHeader) {
                headers["content-type"] = "application/x-www-form-urlencoded";
            }
        }
        let response;
        try {
            response = await (0, undici_1.fetch)(url, {
                method: method.toUpperCase(),
                headers,
                body,
            });
            this.updateCookies(response);
            if (response.status === 403) {
                response = await this.handleCaptchaResponse(response, url);
            }
        }
        catch (error) {
            console.error("Request failed:", error);
            throw error;
        }
        const contentType = response.headers.get("content-type") || "";
        const responseText = await response.text();
        if (!response.ok) {
            if (response.status === 403 && responseText.includes("smart-captcha")) {
                throw new Error(`Yandex Captcha detected. Please try again later or use different approach. Status: ${response.status}`);
            }
            throw new Error(`HTTP ${response.status} ${response.statusText}: ${responseText}`);
        }
        this.requestCount++;
        if (contentType.includes("application/json")) {
            try {
                const json = JSON.parse(responseText);
                return json && typeof json === "object" && "result" in json ? json.result : json;
            }
            catch (_) {
                return responseText;
            }
        }
        else {
            try {
                const maybeJson = JSON.parse(responseText);
                return maybeJson && typeof maybeJson === "object" && "result" in maybeJson ? maybeJson.result : maybeJson;
            }
            catch (_) {
                return responseText;
            }
        }
    }
    get(request) {
        return this._sendRequest("get", request);
    }
    post(request) {
        return this._sendRequest("post", request);
    }
    clearCookies() {
        this.cookieJar.clear();
    }
    getRequestStats() {
        return {
            requestCount: this.requestCount,
            cookieCount: this.cookieJar.size,
        };
    }
}
HttpClient.USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15",
];
HttpClient.ACCEPT_LANGUAGES = [
    "ru-RU,ru;q=0.9,en;q=0.8",
    "en-US,en;q=0.9,ru;q=0.8",
    "ru,en-US;q=0.9,en;q=0.8",
];
exports.default = HttpClient;
