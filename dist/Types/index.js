"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DownloadTrackCodec = exports.DownloadTrackQuality = void 0;
var DownloadTrackQuality;
(function (DownloadTrackQuality) {
    DownloadTrackQuality["Lossless"] = "lossless";
    DownloadTrackQuality["High"] = "high";
    DownloadTrackQuality["Low"] = "low";
})(DownloadTrackQuality || (exports.DownloadTrackQuality = DownloadTrackQuality = {}));
var DownloadTrackCodec;
(function (DownloadTrackCodec) {
    DownloadTrackCodec["FLAC"] = "flac";
    DownloadTrackCodec["AAC"] = "aac";
    DownloadTrackCodec["HEACC"] = "he-aac";
    DownloadTrackCodec["MP3"] = "mp3";
})(DownloadTrackCodec || (exports.DownloadTrackCodec = DownloadTrackCodec = {}));
