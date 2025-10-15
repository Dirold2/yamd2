"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = shortenLink;
const hyperttp_1 = require("hyperttp");
const PreparedRequest_1 = require("./PreparedRequest");
const defaultClient = new hyperttp_1.HttpClientImproved();
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
