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
const zlib = __importStar(require("zlib"));
const util_1 = require("util");
const fast_xml_parser_1 = require("fast-xml-parser");
const querystring = __importStar(require("querystring"));
const CacheManager_1 = require("./CacheManager");
const QueueManager_1 = require("./QueueManager");
const RateLimiter_1 = require("./RateLimiter");
const gunzip = (0, util_1.promisify)(zlib.gunzip);
const inflate = (0, util_1.promisify)(zlib.inflate);
const brotliDecompress = (0, util_1.promisify)(zlib.brotliDecompress);
class HttpClientImproved {
    constructor(options) {
        var _a, _b;
        this.cookieJar = new tough_cookie_1.CookieJar();
        this.agent = new undici_1.CookieAgent({
            cookies: { jar: this.cookieJar },
            connections: 100,
            pipelining: 10
        });
        this.inflight = new Map();
        this.defaultHeaders = {
            Accept: "application/json, text/plain, */*",
            "Accept-Encoding": "gzip, deflate, br",
            "User-Agent": "YandexMusicDesktopAppWindows/5.13.2",
            "X-Yandex-Music-Client": "YandexMusicDesktopAppWindows/5.13.2"
        };
        this.cache = new CacheManager_1.CacheManager(options);
        this.queue = new QueueManager_1.QueueManager((_a = options === null || options === void 0 ? void 0 : options.maxConcurrent) !== null && _a !== void 0 ? _a : 50);
        this.limiter = new RateLimiter_1.RateLimiter(options === null || options === void 0 ? void 0 : options.rateLimit);
        this.retryOptions = {
            maxRetries: (_b = options === null || options === void 0 ? void 0 : options.maxRetries) !== null && _b !== void 0 ? _b : 3,
            baseDelay: 1000,
            maxDelay: 30000,
            retryStatusCodes: [408, 429, 500, 502, 503, 504],
            jitter: true
        };
    }
    setDefaultHeaders(headers) {
        Object.assign(this.defaultHeaders, headers);
    }
    async decompress(buf, enc) {
        if (!enc)
            return buf.toString("utf-8");
        switch (enc.toLowerCase()) {
            case "gzip": return (await gunzip(buf)).toString("utf-8");
            case "deflate": return (await inflate(buf)).toString("utf-8");
            case "br": return (await brotliDecompress(buf)).toString("utf-8");
            default: return buf.toString("utf-8");
        }
    }
    async sendWithRetry(method, url, headers, body) {
        let lastError;
        for (let i = 0; i <= this.retryOptions.maxRetries; i++) {
            try {
                await this.limiter.wait();
                const res = await (0, undici_2.request)(url, { method, headers, body, dispatcher: this.agent });
                const buf = Buffer.from(await res.body.arrayBuffer());
                if (this.retryOptions.retryStatusCodes.includes(res.statusCode)) {
                    await this.sleep(this.calcDelay(i));
                    continue;
                }
                return { status: res.statusCode, headers: res.headers, body: buf };
            }
            catch (err) {
                lastError = err;
                if (i < this.retryOptions.maxRetries)
                    await this.sleep(this.calcDelay(i));
            }
        }
        throw lastError;
    }
    calcDelay(attempt) {
        const base = Math.min(this.retryOptions.baseDelay * 2 ** attempt, this.retryOptions.maxDelay);
        return this.retryOptions.jitter ? base * (0.75 + Math.random() * 0.5) : base;
    }
    sleep(ms) {
        return new Promise(r => setTimeout(r, ms));
    }
    async parseResponse(res) {
        var _a;
        const text = await this.decompress(res.body, res.headers["content-encoding"]);
        const type = res.headers["content-type"];
        if (type === null || type === void 0 ? void 0 : type.includes("json"))
            return (_a = JSON.parse(text).result) !== null && _a !== void 0 ? _a : JSON.parse(text);
        if ((type === null || type === void 0 ? void 0 : type.includes("xml")) || text.startsWith("<"))
            return new fast_xml_parser_1.XMLParser({ ignoreAttributes: false }).parse(text);
        return text;
    }
    async request(method, req, useCache = true) {
        const url = req.getURL();
        const rawBody = req.getBodyData();
        const headers = { ...this.defaultHeaders, ...req.getHeaders() };
        const contentType = headers["content-type"] || "";
        const isBodyAllowed = ["POST", "PUT", "PATCH", "DELETE"].includes(method);
        let body;
        if (isBodyAllowed && rawBody) {
            if (contentType.includes("application/json")) {
                body = JSON.stringify(rawBody);
            }
            else if (contentType.includes("application/x-www-form-urlencoded")) {
                body = querystring.stringify(rawBody);
            }
            else {
                body = typeof rawBody === "string" ? rawBody : JSON.stringify(rawBody);
            }
        }
        const key = `${method}:${url}:${body !== null && body !== void 0 ? body : ""}`;
        if (method === "GET" && useCache) {
            const cached = this.cache.get(key);
            if (cached)
                return cached;
        }
        if (this.inflight.has(key))
            return this.inflight.get(key);
        const promise = this.queue.enqueue(async () => {
            const raw = await this.sendWithRetry(method, url, headers, body);
            const parsed = await this.parseResponse(raw);
            if (method === "GET" && useCache)
                this.cache.set(key, parsed);
            return parsed;
        }).finally(() => this.inflight.delete(key));
        this.inflight.set(key, promise);
        return promise;
    }
    get(req) { return this.request("GET", req); }
    post(req) { return this.request("POST", req, false); }
    put(req) { return this.request("PUT", req, false); }
    delete(req) { return this.request("DELETE", req, false); }
    clearCache() { this.cache.clear(); }
}
exports.default = HttpClientImproved;
