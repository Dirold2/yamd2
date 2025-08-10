"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = shortenLink;
const HttpClient_1 = __importDefault(require("./Network/HttpClient"));
const PreparedRequest_1 = require("./PreparedRequest");
const httpClient = new HttpClient_1.default();
/**
 * GET: clck.ru/--
 * @param URL Url to something
 * @returns clck.ru shortened link
 */
function shortenLink(URL) {
    const request = (0, PreparedRequest_1.clckApiRequest)().setPath("/--").addQuery({ url: URL });
    return httpClient.get(request);
}
