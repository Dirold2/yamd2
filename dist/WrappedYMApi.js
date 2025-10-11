"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Types_1 = require("./Types");
const YMApi_1 = __importDefault(require("./YMApi"));
const UrlExtractor_1 = __importDefault(require("./Network/UrlExtractor"));
class WrappedYMApi {
    constructor(api = new YMApi_1.default(), urlExtractor = new UrlExtractor_1.default()) {
        this.api = api;
        this.urlExtractor = urlExtractor;
    }
    init(config) {
        return this.api.init(config);
    }
    getApi() {
        return this.api;
    }
    getTrackId(track) {
        if (typeof track === "string") {
            return this.urlExtractor.extractTrackId(track);
        }
        else {
            return track;
        }
    }
    getAlbumId(album) {
        if (typeof album === "string") {
            return this.urlExtractor.extractAlbumId(album);
        }
        else {
            return album;
        }
    }
    getArtistId(artist) {
        if (typeof artist === "string") {
            return this.urlExtractor.extractArtistId(artist);
        }
        else {
            return artist;
        }
    }
    getPlaylistId(playlist, user) {
        if (typeof playlist === "string") {
            return this.urlExtractor.extractPlaylistId(playlist);
        }
        else {
            return { id: playlist, user: user ? String(user) : null };
        }
    }
    async getConcreteDownloadInfo(track, codec, quality) {
        var _a, _b, _c;
        const info = await this.api.getTrackDownloadInfoNew(track, quality);
        // новая структура: downloadInfo.url или downloadInfo.urls[0]
        const downloadUrl = ((_a = info.downloadInfo) === null || _a === void 0 ? void 0 : _a.url) || ((_c = (_b = info.downloadInfo) === null || _b === void 0 ? void 0 : _b.urls) === null || _c === void 0 ? void 0 : _c[0]);
        if (!downloadUrl) {
            throw new Error("Download info not found");
        }
        const downloadInfo = {
            codec,
            bitrateInKbps: info.downloadInfo.bitrate || 0,
            downloadInfoUrl: downloadUrl,
            direct: true,
            quality: info.downloadInfo.quality,
            gain: info.downloadInfo.gain || false,
            preview: false
        };
        return downloadInfo;
    }
    getMp3DownloadInfo(track, quality = Types_1.DownloadTrackQuality.Lossless) {
        return this.getConcreteDownloadInfo(track, Types_1.DownloadTrackCodec.MP3, quality);
    }
    getAacDownloadInfo(track, quality = Types_1.DownloadTrackQuality.Lossless) {
        return this.getConcreteDownloadInfo(track, Types_1.DownloadTrackCodec.AAC, quality);
    }
    getFlacDownloadInfo(track, quality = Types_1.DownloadTrackQuality.Lossless) {
        return this.getConcreteDownloadInfo(track, Types_1.DownloadTrackCodec.FLAC, quality);
    }
    async getMp3DownloadUrl(track, short = false, quality = Types_1.DownloadTrackQuality.High) {
        return this.api.getTrackDirectLinkNew((await this.getMp3DownloadInfo(track, quality)).downloadInfoUrl);
    }
    async getAacDownloadUrl(track, short = false, quality = Types_1.DownloadTrackQuality.High) {
        return this.api.getTrackDirectLink((await this.getAacDownloadInfo(track, quality)).downloadInfoUrl, short);
    }
    async getFlacDownloadUrl(track, short = false, quality = Types_1.DownloadTrackQuality.High) {
        return this.api.getTrackDirectLink((await this.getFlacDownloadInfo(track, quality)).downloadInfoUrl, short);
    }
    async getBestDownloadUrl(track, short = false, quality = Types_1.DownloadTrackQuality.High) {
        const codecsPriority = [
            Types_1.DownloadTrackCodec.FLAC,
            Types_1.DownloadTrackCodec.AAC,
            Types_1.DownloadTrackCodec.MP3
        ];
        for (const codec of codecsPriority) {
            try {
                let info = null;
                switch (codec) {
                    case Types_1.DownloadTrackCodec.FLAC:
                        info = await this.getFlacDownloadInfo(track, quality);
                        break;
                    case Types_1.DownloadTrackCodec.AAC:
                        info = await this.getAacDownloadInfo(track, quality);
                        break;
                    case Types_1.DownloadTrackCodec.MP3:
                        info = await this.getMp3DownloadInfo(track, quality);
                        break;
                }
                if (info === null || info === void 0 ? void 0 : info.downloadInfoUrl) {
                    // Передаём codec из приоритета, а не info.codec
                    return await this.api.getTrackDirectLink(info.downloadInfoUrl, short);
                }
            }
            catch {
                continue;
            }
        }
        return null;
    }
    getPlaylist(playlist, user) {
        const pl = this.getPlaylistId(playlist, user);
        if (typeof pl.id === "number") {
            return this.api.getPlaylist(pl.id, pl.user);
        }
        return this.api.getPlaylist(pl.id);
    }
    getTrack(track) {
        return this.api.getSingleTrack(this.getTrackId(track));
    }
    getAlbum(album, withTracks = false) {
        return this.api.getAlbum(this.getAlbumId(album), withTracks);
    }
    getAlbumWithTracks(album) {
        return this.api.getAlbumWithTracks(this.getAlbumId(album));
    }
    getArtist(artist) {
        return this.api.getArtist(this.getArtistId(artist));
    }
}
exports.default = WrappedYMApi;
