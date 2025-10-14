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
const querystring = __importStar(require("querystring"));
class HttpClient {
    async _sendRequestAxios(method, request) {
        var _a;
        const isBodyAllowed = ["PUT", "POST", "DELETE", "PATCH"].includes(method.toUpperCase());
        const body = isBodyAllowed ? this.serializeBody(request) : undefined;
        const headers = { ...request.getHeaders() };
        if (isBodyAllowed && !headers["content-type"]) {
            headers["content-type"] = "application/json";
            if (body && typeof body === "string") {
                headers["content-type"] = "application/x-www-form-urlencoded";
            }
        }
        const axiosRequest = {
            method,
            url: request.getURL(),
            headers,
            data: body
        };
        const { data } = await (0, axios_1.default)(axiosRequest);
        return (_a = data.result) !== null && _a !== void 0 ? _a : data;
    }
    serializeBody(request) {
        var _a, _b, _c, _d;
        const body = (_b = (_a = request.getBodyData) === null || _a === void 0 ? void 0 : _a.call(request)) !== null && _b !== void 0 ? _b : {};
        const contentType = (_d = (_c = request.getHeaders()) === null || _c === void 0 ? void 0 : _c["content-type"]) !== null && _d !== void 0 ? _d : "";
        if (contentType.includes("application/x-www-form-urlencoded")) {
            return querystring.stringify(body);
        }
        return body;
    }
    get(request) {
        return this._sendRequestAxios("get", request);
    }
    post(request) {
        return this._sendRequestAxios("post", request);
    }
}
exports.default = HttpClient;
