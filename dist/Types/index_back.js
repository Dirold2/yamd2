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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChartType = exports.DownloadTrackCodec = exports.DownloadTrackQuality = void 0;
// Re-export all types
__exportStar(require("./request"), exports);
var DownloadTrackQuality;
(function (DownloadTrackQuality) {
    DownloadTrackQuality["Lossless"] = "lossless";
    DownloadTrackQuality["High"] = "high";
    DownloadTrackQuality["Medium"] = "medium";
    DownloadTrackQuality["Low"] = "low";
})(DownloadTrackQuality || (exports.DownloadTrackQuality = DownloadTrackQuality = {}));
var DownloadTrackCodec;
(function (DownloadTrackCodec) {
    DownloadTrackCodec["MP3"] = "mp3";
    DownloadTrackCodec["AAC"] = "aac";
    DownloadTrackCodec["FLAC"] = "flac";
})(DownloadTrackCodec || (exports.DownloadTrackCodec = DownloadTrackCodec = {}));
var ChartType;
(function (ChartType) {
    ChartType["World"] = "world";
    ChartType["Russia"] = "russia";
})(ChartType || (exports.ChartType = ChartType = {}));
