"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.directLinkRequest = exports.authRequest = exports.clckApiRequest = exports.apiRequest = void 0;
const apiRequest_js_1 = __importDefault(require("./apiRequest.js"));
exports.apiRequest = apiRequest_js_1.default;
const clckApiRequest_js_1 = __importDefault(require("./clckApiRequest.js"));
exports.clckApiRequest = clckApiRequest_js_1.default;
const authRequest_js_1 = __importDefault(require("./authRequest.js"));
exports.authRequest = authRequest_js_1.default;
const directLinkRequest_js_1 = __importDefault(require("./directLinkRequest.js"));
exports.directLinkRequest = directLinkRequest_js_1.default;
