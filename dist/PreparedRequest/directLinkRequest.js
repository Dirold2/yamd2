"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = directLinkRequest;
const hyperttp_1 = require("hyperttp");
const url_1 = require("url");
function directLinkRequest(url) {
    const parsedUrl = new url_1.URL(url);
    const request = new hyperttp_1.Request({
        scheme: parsedUrl.protocol.replace(":", ""),
        host: parsedUrl.host,
        port: parsedUrl.protocol === "https:" ? 443 : 80,
        path: `${parsedUrl.pathname}${parsedUrl.search}`,
        headers: {},
        query: {},
        bodyData: {}
    });
    return request;
}
