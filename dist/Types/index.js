"use strict";
// ============================================
// Custom Error Types
// ============================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.DownloadTrackCodec = exports.DownloadTrackQuality = exports.DownloadError = exports.ExtractionError = exports.InvalidUrlError = exports.DownloadInfoError = exports.TrackNotFoundError = exports.AuthError = exports.YMApiError = void 0;
class YMApiError extends Error {
    constructor(message, code) {
        super(message);
        this.code = code;
        this.name = "YMApiError";
    }
}
exports.YMApiError = YMApiError;
class AuthError extends YMApiError {
    constructor(message = "Authentication required") {
        super(message, "AUTH_REQUIRED");
        this.name = "AuthError";
    }
}
exports.AuthError = AuthError;
class TrackNotFoundError extends YMApiError {
    constructor(trackId) {
        super(`Track not found: ${trackId}`, "TRACK_NOT_FOUND");
        this.trackId = trackId;
        this.name = "TrackNotFoundError";
    }
}
exports.TrackNotFoundError = TrackNotFoundError;
class DownloadInfoError extends YMApiError {
    constructor(message) {
        super(message, "DOWNLOAD_INFO_ERROR");
        this.name = "DownloadInfoError";
    }
}
exports.DownloadInfoError = DownloadInfoError;
class InvalidUrlError extends YMApiError {
    constructor(url) {
        super(`Invalid Yandex Music URL: ${url}`, "INVALID_URL");
        this.url = url;
        this.name = "InvalidUrlError";
    }
}
exports.InvalidUrlError = InvalidUrlError;
class ExtractionError extends YMApiError {
    constructor(entity, input) {
        super(`Failed to extract ${entity} from: ${input}`, "EXTRACTION_FAILED");
        this.entity = entity;
        this.input = input;
        this.name = "ExtractionError";
    }
}
exports.ExtractionError = ExtractionError;
class DownloadError extends YMApiError {
    constructor(trackId, codec) {
        super(`URL not found for track ${trackId} with codec ${codec}`, "DOWNLOAD_URL_NOT_FOUND");
        this.trackId = trackId;
        this.codec = codec;
        this.name = "DownloadError";
    }
}
exports.DownloadError = DownloadError;
/**
 * @ru Качество загрузки трека.
 * @en Track download quality.
 */
var DownloadTrackQuality;
(function (DownloadTrackQuality) {
    DownloadTrackQuality["Lossless"] = "lossless";
    DownloadTrackQuality["High"] = "high";
    DownloadTrackQuality["Low"] = "low";
})(DownloadTrackQuality || (exports.DownloadTrackQuality = DownloadTrackQuality = {}));
/**
 * @ru Кодек для загрузки трека.
 * @en Track download codec.
 */
var DownloadTrackCodec;
(function (DownloadTrackCodec) {
    DownloadTrackCodec["FLAC"] = "flac";
    DownloadTrackCodec["FLACMP4"] = "flac-mp4";
    DownloadTrackCodec["AAC"] = "aac";
    DownloadTrackCodec["AACMP4"] = "aac-mp4";
    DownloadTrackCodec["HEACC"] = "he-aac";
    DownloadTrackCodec["HEACCMP4"] = "he-aac-mp4";
    DownloadTrackCodec["MP3"] = "mp3";
})(DownloadTrackCodec || (exports.DownloadTrackCodec = DownloadTrackCodec = {}));
