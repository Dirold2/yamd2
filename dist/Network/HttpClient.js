"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
class HttpClient {
    async _sendRequestAxios(method, request) {
        const axiosRequest = {
            method,
            url: request.getURL(),
            headers: request.getHeaders(),
            data: {}
        };
        if (["PUT", "POST", "DELETE", "PATCH"].includes(method.toUpperCase())) {
            axiosRequest.data = request.getBodyDataString();
            axiosRequest.headers = {
                ...axiosRequest.headers,
                ...{ "content-type": "application/x-www-form-urlencoded" }
            };
        }
        const { data } = await (0, axios_1.default)(axiosRequest);
        if (data.result) {
            return data.result;
        }
        else {
            return data;
        }
    }
    get(request) {
        return this._sendRequestAxios("get", request);
    }
    post(request) {
        return this._sendRequestAxios("post", request);
    }
}
exports.default = HttpClient;
