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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const fast_xml_parser_1 = require("fast-xml-parser");
const util_1 = require("util");
const zlib = __importStar(require("zlib"));
const gunzip = (0, util_1.promisify)(zlib.gunzip);
const inflate = (0, util_1.promisify)(zlib.inflate);
const brotliDecompress = (0, util_1.promisify)(zlib.brotliDecompress);
class HttpClient {
    constructor(options) {
        this.defaultTimeout = 10000; // 10 сек
        this.retryCount = 2;
        if (options === null || options === void 0 ? void 0 : options.timeout)
            this.defaultTimeout = options.timeout;
        if (options === null || options === void 0 ? void 0 : options.retryCount)
            this.retryCount = options.retryCount;
    }
    async _sendRequestAxios(method, request, attempt = 0) {
        var _a, _b, _c, _d;
        const axiosRequest = {
            method,
            url: request.getURL(),
            headers: {
                ...request.getHeaders(),
                "Content-Type": "application/json, text/plain, */*",
                "Accept-Encoding": "gzip, deflate, br",
                "User-Agent": "YandexMusicDesktopAppWindows/5.13.2",
                "X-Yandex-Music-Client": "YandexMusicDesktopAppWindows/5.13.2"
            },
            timeout: this.defaultTimeout,
            responseType: "arraybuffer", // для поддержки сжатых ответов
            data: ["POST", "PUT", "PATCH", "DELETE"].includes(method.toUpperCase())
                ? this.serializeBody(request)
                : undefined,
            decompress: true, // авто-распаковка gzip/deflate
        };
        try {
            const response = await (0, axios_1.default)(axiosRequest);
            const data = this.parseResponse(response);
            return data;
        }
        catch (err) {
            const error = err;
            if (attempt < this.retryCount &&
                (error.code === "ECONNABORTED" || ((_b = (_a = error.response) === null || _a === void 0 ? void 0 : _a.status) !== null && _b !== void 0 ? _b : 0) >= 500)) {
                await new Promise((r) => setTimeout(r, 500 * (attempt + 1))); // простая задержка
                return this._sendRequestAxios(method, request, attempt + 1);
            }
            throw new Error(`HTTP ${((_c = error.response) === null || _c === void 0 ? void 0 : _c.status) || "??"} - ${((_d = error.response) === null || _d === void 0 ? void 0 : _d.statusText) || error.message}`);
        }
    }
    serializeBody(request) {
        var _a, _b;
        try {
            const body = request.getBodyData
                ? request.getBodyData()
                : request.getBodyDataString
                    ? JSON.parse(request.getBodyDataString())
                    : {};
            return body;
        }
        catch {
            return (_b = (_a = request.getBodyDataString) === null || _a === void 0 ? void 0 : _a.call(request)) !== null && _b !== void 0 ? _b : {};
        }
    }
    async parseResponse(response) {
        var _a, _b, _c;
        const contentEncoding = response.headers["content-encoding"];
        let buf = Buffer.isBuffer(response.data) ? response.data : Buffer.from(response.data);
        // Распаковка, если сжатие
        if (contentEncoding) {
            switch (contentEncoding.toLowerCase()) {
                case "gzip":
                    buf = await (0, util_1.promisify)(zlib.gunzip)(buf);
                    break;
                case "deflate":
                    buf = await (0, util_1.promisify)(zlib.inflate)(buf);
                    break;
                case "br":
                    buf = await (0, util_1.promisify)(zlib.brotliDecompress)(buf);
                    break;
            }
        }
        const text = buf.toString("utf-8");
        const contentType = (_a = response.headers["content-type"]) !== null && _a !== void 0 ? _a : "";
        if (contentType.includes("application/json")) {
            return (_c = (_b = JSON.parse(text)) === null || _b === void 0 ? void 0 : _b.result) !== null && _c !== void 0 ? _c : JSON.parse(text);
        }
        if (contentType.includes("xml") || text.startsWith("<")) {
            return new fast_xml_parser_1.XMLParser({ ignoreAttributes: false }).parse(text);
        }
        return text;
    }
    get(request) {
        return this._sendRequestAxios("get", request);
    }
    post(request) {
        return this._sendRequestAxios("post", request);
    }
}
exports.default = HttpClient;
