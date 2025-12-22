"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = shortenLink;
const hyperttp_1 = require("hyperttp");
const index_js_1 = require("./PreparedRequest/index.js");
const defaultClient = new hyperttp_1.HttpClientImproved();
/**
 * GET: clck.ru/--
 * @param URL Url to shorten
 * @param client Optional custom HTTP client
 * @returns Promise<string> - shortened link
 */
function shortenLink(URL, client = defaultClient) {
    const request = (0, index_js_1.clckApiRequest)().setPath("/--").addQuery({ url: URL });
    return client.get(request);
}
