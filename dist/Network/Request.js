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
exports.PreparedRequest = void 0;
const querystring = __importStar(require("querystring"));
class Request {
    constructor(config) {
        this.scheme = config.scheme;
        this.host = config.host;
        this.port = config.port;
        this.path = config.path || "";
        this.headers = config.headers || {};
        this.query = config.query || {};
        this.bodyData = config.bodyData || {};
    }
    setPath(path) {
        this.path = path;
        return this;
    }
    setHost(host) {
        this.host = host;
        return this;
    }
    getHeaders() {
        return this.headers;
    }
    setHeaders(headers) {
        this.headers = headers;
        return this;
    }
    addHeaders(headers) {
        if (!this.headers) {
            this.headers = headers;
        }
        else {
            for (var key in headers) {
                this.headers[key] = headers[key];
            }
        }
        return this;
    }
    getQuery() {
        return this.query;
    }
    setQuery(query) {
        this.query = query;
        return this;
    }
    addQuery(query) {
        if (!this.query) {
            this.query = query;
        }
        else {
            for (var key in query) {
                this.query[key] = query[key];
            }
        }
        return this;
    }
    getQueryAsString() {
        if (Object.keys(this.query).length < 1)
            return "";
        const params = [];
        for (var key in this.query) {
            params.push(key + "=" + this.query[key]);
        }
        return "?" + params.join("&");
    }
    getBodyData() {
        return this.bodyData;
    }
    getBodyDataString() {
        return querystring.stringify(this.bodyData);
    }
    setBodyData(bodyData) {
        this.bodyData = bodyData;
        return this;
    }
    addBodyData(bodyData) {
        if (!this.bodyData) {
            this.bodyData = bodyData;
        }
        else {
            for (var key in bodyData) {
                this.bodyData[key] = bodyData[key];
            }
        }
        return this;
    }
    getURI() {
        let uri = this.scheme + "://" + this.host;
        if (this.port) {
            uri += ":" + this.port;
        }
        if (this.path) {
            uri += this.path;
        }
        return uri;
    }
    getURL() {
        return this.getURI() + this.getQueryAsString();
    }
}
exports.default = Request;
class PreparedRequest {
    constructor(baseUrl) {
        // Parse the URL to extract scheme, host, port
        const url = new URL(baseUrl);
        const config = {
            scheme: url.protocol.replace(":", ""),
            host: url.hostname,
            port: url.port
                ? Number.parseInt(url.port)
                : url.protocol === "https:"
                    ? 443
                    : 80,
            path: ""
        };
        this.request = new Request(config);
    }
    setPath(path) {
        this.request.setPath(path);
        return this;
    }
    setHost(host) {
        this.request.setHost(host);
        return this;
    }
    getHeaders() {
        return this.request.getHeaders();
    }
    setHeaders(headers) {
        this.request.setHeaders(headers);
        return this;
    }
    addHeaders(headers) {
        this.request.addHeaders(headers);
        return this;
    }
    getQuery() {
        return this.request.getQuery();
    }
    setQuery(query) {
        this.request.setQuery(query);
        return this;
    }
    addQuery(query) {
        this.request.addQuery(query);
        return this;
    }
    getQueryAsString() {
        return this.request.getQueryAsString();
    }
    getBodyData() {
        return this.request.getBodyData();
    }
    getBodyDataString() {
        return this.request.getBodyDataString();
    }
    setBodyData(bodyData) {
        this.request.setBodyData(bodyData);
        return this;
    }
    addBodyData(bodyData) {
        this.request.addBodyData(bodyData);
        return this;
    }
    getURI() {
        return this.request.getURI();
    }
    getURL() {
        return this.request.getURL();
    }
}
exports.PreparedRequest = PreparedRequest;
