"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const tough_cookie_1 = require("tough-cookie");
const undici_1 = require("http-cookie-agent/undici");
const undici_2 = require("undici");
const lru_cache_1 = require("lru-cache");
const zlib = __importStar(require("zlib"));
const util_1 = require("util");
const fast_xml_parser_1 = require("fast-xml-parser");
const gunzip = (0, util_1.promisify)(zlib.gunzip);
const inflate = (0, util_1.promisify)(zlib.inflate);
const brotliDecompress = (0, util_1.promisify)(zlib.brotliDecompress);
class HttpClient {
    constructor(options) {
        this.cacheTTL = 5 * 60 * 1000;
        this.cookieJar = new tough_cookie_1.CookieJar();
        this.agent = new undici_1.CookieAgent({ cookies: { jar: this.cookieJar } });
        this.cache = new lru_cache_1.LRUCache({
            max: (options === null || options === void 0 ? void 0 : options.cacheMaxSize) || 100,
            ttl: (options === null || options === void 0 ? void 0 : options.cacheTTL) || this.cacheTTL
        });
        this.retryOptions = {
            maxRetries: (options === null || options === void 0 ? void 0 : options.maxRetries) || 3,
            retryDelay: 1000,
            retryStatusCodes: [408, 429, 500, 502, 503, 504]
        };
    }
    async decompressBody(buffer, encoding) {
        if (!encoding)
            return buffer.toString("utf-8");
        switch (encoding.toLowerCase()) {
            case "gzip":
                return (await gunzip(buffer)).toString("utf-8");
            case "deflate":
                return (await inflate(buffer)).toString("utf-8");
            case "br":
                return (await brotliDecompress(buffer)).toString("utf-8");
            default:
                return buffer.toString("utf-8");
        }
    }
    getCacheKey(method, url, body) {
        return `${method}:${url}:${body ? JSON.stringify(body) : ""}`;
    }
    getCachedResponse(cacheKey) {
        const cached = this.cache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < this.cacheTTL)
            return cached.data;
        return null;
    }
    async sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
    async _sendRequestWithRetry(method, url, headers, body) {
        let lastError = null;
        for (let attempt = 0; attempt <= this.retryOptions.maxRetries; attempt++) {
            try {
                const response = await (0, undici_2.request)(url, {
                    method,
                    headers,
                    body,
                    dispatcher: this.agent,
                    bodyTimeout: 10000,
                    headersTimeout: 10000
                });
                const bodyBuffer = Buffer.from(await response.body.arrayBuffer());
                if (attempt < this.retryOptions.maxRetries &&
                    this.retryOptions.retryStatusCodes.includes(response.statusCode)) {
                    await this.sleep(this.retryOptions.retryDelay * Math.pow(2, attempt));
                    continue;
                }
                return {
                    statusCode: response.statusCode,
                    headers: response.headers,
                    body: bodyBuffer
                };
            }
            catch (error) {
                lastError = error;
                if (attempt < this.retryOptions.maxRetries)
                    await this.sleep(this.retryOptions.retryDelay * Math.pow(2, attempt));
            }
        }
        throw lastError || new Error("Request failed after all retries");
    }
    async _sendRequestUndici(method, requestObj, useCache = true) {
        var _a;
        const url = requestObj.getURL();
        const bodyData = requestObj.getBodyData();
        if (method.toUpperCase() === "GET" && useCache) {
            const cacheKey = this.getCacheKey(method, url);
            const cached = this.getCachedResponse(cacheKey);
            if (cached)
                return cached;
        }
        const headers = {
            ...requestObj.getHeaders(),
            "Accept-Encoding": "gzip, deflate, br"
        };
        if (!headers["User-Agent"] && !headers["user-agent"])
            headers["User-Agent"] = "YandexMusicDesktopAppWindows/5.23.2";
        const body = ["POST", "PUT", "PATCH", "DELETE"].includes(method.toUpperCase()) &&
            bodyData
            ? JSON.stringify(bodyData)
            : undefined;
        const response = await this._sendRequestWithRetry(method, url, headers, body);
        const encoding = Array.isArray(response.headers["content-encoding"])
            ? response.headers["content-encoding"][0]
            : response.headers["content-encoding"];
        const text = await this.decompressBody(response.body, encoding);
        const contentType = Array.isArray(response.headers["content-type"])
            ? response.headers["content-type"][0]
            : response.headers["content-type"];
        let data;
        if (contentType === null || contentType === void 0 ? void 0 : contentType.includes("json")) {
            try {
                data = JSON.parse(text);
            }
            catch (e) {
                throw new Error(`Invalid JSON response: ${text.slice(0, 200)}...`);
            }
        }
        else if ((contentType === null || contentType === void 0 ? void 0 : contentType.includes("xml")) || text.trim().startsWith("<")) {
            const parser = new fast_xml_parser_1.XMLParser({ ignoreAttributes: false });
            data = parser.parse(text);
        }
        else {
            data = text;
        }
        const responseData = (_a = data.result) !== null && _a !== void 0 ? _a : data;
        if (method.toUpperCase() === "GET" && useCache) {
            const cacheKey = this.getCacheKey(method, url);
            this.cache.set(cacheKey, { data: responseData, timestamp: Date.now() });
        }
        return responseData;
    }
    get(requestObj, useCache = true) {
        return this._sendRequestUndici("GET", requestObj, useCache);
    }
    post(requestObj) {
        return this._sendRequestUndici("POST", requestObj, false);
    }
    clearCache() {
        this.cache.clear();
    }
    getCacheStats() {
        return { size: this.cache.size, maxSize: this.cache.max };
    }
    getCookies(url) {
        return this.cookieJar.getCookieString(url);
    }
}
exports.default = HttpClient;
