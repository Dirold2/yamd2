"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = apiRequest;
const Network_1 = require("../Network");
const config_1 = __importDefault(require("./config"));
function apiRequest() {
    return new Network_1.Request(config_1.default.api);
}
