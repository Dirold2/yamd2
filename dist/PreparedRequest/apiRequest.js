"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = apiRequest;
const hyperttp_1 = require("hyperttp");
const config_1 = __importDefault(require("./config"));
function apiRequest() {
    return new hyperttp_1.Request(config_1.default.api);
}
