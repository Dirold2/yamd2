"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = shortenLink;
const Network_1 = require("./Network");
const PreparedRequest_1 = require("./PreparedRequest");
const defaultClient = new Network_1.HttpClient();
/**
 * GET: clck.ru/--
 * @param URL Url to shorten
 * @param client Optional custom HTTP client
 * @returns Promise<string> - shortened link
 */
function shortenLink(URL, client = defaultClient) {
    const request = (0, PreparedRequest_1.clckApiRequest)().setPath("/--").addQuery({ url: URL });
    return client.get(request);
}
