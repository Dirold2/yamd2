"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = shortenLink;
const Network_1 = require("./Network");
const PreparedRequest_1 = require("./PreparedRequest");
const httpClient = new Network_1.HttpClientImproved();
/**
 * GET: clck.ru/--
 * @param URL Url to something
 * @returns clck.ru shortened link
 */
function shortenLink(URL) {
    const request = (0, PreparedRequest_1.clckApiRequest)().setPath("/--").addQuery({ url: URL });
    return httpClient.get(request);
}
