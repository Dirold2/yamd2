"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = apiRequest;
const Request_1 = __importDefault(require("../Network/Request"));
const config_1 = __importDefault(require("./config"));
function apiRequest() {
    return new Request_1.default(config_1.default.clckApi);
}
