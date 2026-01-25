"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DownloadError = exports.ExtractionError = exports.YMApiError = void 0;
const hyperttp_1 = require("hyperttp");
const Types_1 = require("./Types");
const YMApi_1 = __importDefault(require("./YMApi"));
const CryptoYM_1 = require("./CryptoYM");
// ============================================
// Custom Errors
// ============================================
class YMApiError extends Error {
    constructor(message, code) {
        super(message);
        this.code = code;
        this.name = "YMApiError";
    }
}
exports.YMApiError = YMApiError;
class ExtractionError extends YMApiError {
    constructor(entity, input) {
        super(`Не удалось извлечь ${entity} из: ${input}`, "EXTRACTION_FAILED");
        this.entity = entity;
        this.input = input;
        this.name = "ExtractionError";
    }
}
exports.ExtractionError = ExtractionError;
class DownloadError extends YMApiError {
    constructor(trackId, codec) {
        super(`URL не найден для трека ${trackId} с кодеком ${codec}`, "DOWNLOAD_URL_NOT_FOUND");
        this.trackId = trackId;
        this.codec = codec;
        this.name = "DownloadError";
    }
}
exports.DownloadError = DownloadError;
const CODEC_CONFIG = {
    [Types_1.DownloadTrackCodec.MP3]: {
        codecs: "mp3",
        transport: "raw",
        encrypted: false
    },
    [Types_1.DownloadTrackCodec.AAC]: {
        codecs: "aac",
        transport: "encraw",
        encrypted: true
    },
    [Types_1.DownloadTrackCodec.AACMP4]: {
        codecs: "aac-mp4",
        transport: "encraw",
        encrypted: true
    },
    [Types_1.DownloadTrackCodec.HEACC]: {
        codecs: "he-aac",
        transport: "encraw",
        encrypted: true
    },
    [Types_1.DownloadTrackCodec.HEACCMP4]: {
        codecs: "he-aac-mp4",
        transport: "encraw",
        encrypted: true
    },
    [Types_1.DownloadTrackCodec.FLAC]: {
        codecs: "flac",
        transport: "encraw",
        encrypted: true
    },
    [Types_1.DownloadTrackCodec.FLACMP4]: {
        codecs: "flac-mp4",
        transport: "encraw",
        encrypted: true
    }
};
/** Приоритет кодеков: от лучшего качества к худшему */
const CODEC_PRIORITY = [
    Types_1.DownloadTrackCodec.FLACMP4,
    Types_1.DownloadTrackCodec.FLAC,
    Types_1.DownloadTrackCodec.AACMP4,
    Types_1.DownloadTrackCodec.AAC,
    Types_1.DownloadTrackCodec.HEACCMP4,
    Types_1.DownloadTrackCodec.HEACC,
    Types_1.DownloadTrackCodec.MP3
];
// ============================================
// Main Class
// ============================================
class WrappedYMApi {
    constructor(api = new YMApi_1.default()) {
        this.api = api;
        /**
         * @ru Получить информацию для скачивания MP3 трека.
         * @en Get MP3 track download information.
         */
        this.getMp3DownloadInfo = this.createDownloadInfoGetter(Types_1.DownloadTrackCodec.MP3, true);
        /**
         * @ru Получить информацию для скачивания AAC трека.
         * @en Get AAC track download information.
         */
        this.getAacDownloadInfo = this.createDownloadInfoGetter(Types_1.DownloadTrackCodec.AAC);
        /**
         * @ru Получить информацию для скачивания FLAC трека.
         * @en Get FLAC track download information.
         */
        this.getFlacDownloadInfo = this.createDownloadInfoGetter(Types_1.DownloadTrackCodec.FLAC);
        /**
         * @ru Получить информацию для скачивания FLAC-MP4 трека.
         * @en Get FLAC-MP4 track download information.
         */
        this.getFlacMP4DownloadInfo = this.createDownloadInfoGetter(Types_1.DownloadTrackCodec.FLACMP4);
        /**
         * @ru Получить URL для скачивания MP3 трека.
         * @en Get MP3 track download URL.
         */
        this.getMp3DownloadUrl = this.createDownloadUrlGetter(Types_1.DownloadTrackCodec.MP3, true);
        /**
         * @ru Получить URL для скачивания AAC трека.
         * @en Get AAC track download URL.
         */
        this.getAacDownloadUrl = this.createDownloadUrlGetter(Types_1.DownloadTrackCodec.AAC);
        /**
         * @ru Получить URL для скачивания FLAC трека.
         * @en Get FLAC track download URL.
         */
        this.getFlacDownloadUrl = this.createDownloadUrlGetter(Types_1.DownloadTrackCodec.FLAC);
        /**
         * @ru Получить URL для скачивания FLAC-MP4 трека.
         * @en Get FLAC-MP4 track download URL.
         */
        this.getFlacMP4DownloadUrl = this.createDownloadUrlGetter(Types_1.DownloadTrackCodec.FLACMP4);
        this.client = new hyperttp_1.HttpClientImproved({ maxRetries: 3, cacheTTL: 300000 });
        this.urlExtractor = new hyperttp_1.UrlExtractor();
        this.setupUrlExtractor();
    }
    setupUrlExtractor() {
        this.urlExtractor.registerPlatform("yandex", [
            {
                entity: "track",
                regex: /music\.yandex\.ru\/track\/(?<id>\d+)/,
                groupNames: ["id"]
            },
            {
                entity: "track",
                regex: /music\.yandex\.ru\/album\/(?<album>\d+)\/track\/(?<id>\d+)/,
                groupNames: ["album", "id"]
            },
            {
                entity: "album",
                regex: /music\.yandex\.ru\/album\/(?<id>\d+)/,
                groupNames: ["id"]
            },
            {
                entity: "artist",
                regex: /music\.yandex\.ru\/artist\/(?<id>\d+)/,
                groupNames: ["id"]
            },
            {
                entity: "playlist",
                regex: /music\.yandex\.ru\/users\/(?<user>[\w\d\-_.]+)\/playlists\/(?<id>\d+)/,
                groupNames: ["id", "user"]
            },
            {
                entity: "playlist",
                regex: /music\.yandex\.ru\/playlists?\/(?<uid>(?:ar\.)?[A-Za-z0-9-]+)/,
                groupNames: ["uid"]
            }
        ]);
    }
    // ============================================
    // Public API
    // ============================================
    /**
     * @ru Инициализация API клиента с аутентификацией.
     * @en Initialize API client with authentication.
     * @param config Параметры конфигурации API.
     * @returns Промис с данными авторизации.
     */
    init(config) {
        return this.api.init(config);
    }
    /**
     * @ru Получить экземпляр базового API класса.
     * @en Get instance of the base API class.
     * @returns Экземпляр YMApi.
     */
    getApi() {
        return this.api;
    }
    // ============================================
    // ID Extractors (Private)
    // ============================================
    extractNumericId(input, entity) {
        const extracted = this.urlExtractor.extractId(input, entity, "yandex");
        const id = extracted.id;
        if (id === undefined)
            throw new ExtractionError(entity, input);
        return typeof id === "string" ? parseInt(id, 10) : id;
    }
    getTrackId(track) {
        var _a;
        if (typeof track !== "string")
            return track;
        const extracted = this.urlExtractor.extractId(track, "track", "yandex");
        const id = (_a = extracted.id) !== null && _a !== void 0 ? _a : extracted.trackId;
        if (id === undefined)
            throw new ExtractionError("trackId", track);
        return id;
    }
    getAlbumId(album) {
        return typeof album === "string"
            ? this.extractNumericId(album, "album")
            : album;
    }
    getArtistId(artist) {
        return typeof artist === "string"
            ? this.extractNumericId(artist, "artist")
            : artist;
    }
    getPlaylistId(playlist, user) {
        const userStr = user ? String(user) : null;
        if (typeof playlist !== "string") {
            return { id: playlist, user: userStr };
        }
        const extracted = this.urlExtractor.extractId(playlist, "playlist", "yandex");
        if ("uid" in extracted) {
            return { id: extracted.uid, user: null };
        }
        if ("id" in extracted) {
            return {
                id: extracted.id,
                user: extracted.user ? String(extracted.user) : null
            };
        }
        return { id: playlist, user: userStr };
    }
    // ============================================
    // Core Download Methods
    // ============================================
    /**
     * @ru Получить информацию для скачивания трека.
     * @en Get track download information.
     * @param track ID трека или URL.
     * @param options Опции скачивания (кодек, качество, etc.).
     * @returns Промис с информацией о скачивании.
     */
    async getDownloadInfo(track, options = {}) {
        var _a, _b, _c, _d, _e;
        const { codec = Types_1.DownloadTrackCodec.MP3, quality = Types_1.DownloadTrackQuality.Lossless, forceRaw = false } = options;
        const config = CODEC_CONFIG[codec];
        const transport = forceRaw ? "raw" : config.transport;
        const encrypted = forceRaw ? false : config.encrypted;
        const info = await this.api.getTrackDownloadInfoNew(this.getTrackId(track), quality, config.codecs, transport);
        const downloadInfo = info.downloadInfo;
        const downloadUrl = (_a = downloadInfo.url) !== null && _a !== void 0 ? _a : (_b = downloadInfo.urls) === null || _b === void 0 ? void 0 : _b[0];
        if (!downloadUrl)
            throw new DownloadError(track, codec);
        const base = {
            codec: codec,
            bitrateInKbps: (_c = downloadInfo === null || downloadInfo === void 0 ? void 0 : downloadInfo.bitrate) !== null && _c !== void 0 ? _c : 0,
            downloadInfoUrl: downloadUrl,
            direct: true,
            quality: ((_d = downloadInfo === null || downloadInfo === void 0 ? void 0 : downloadInfo.quality) !== null && _d !== void 0 ? _d : quality),
            gain: (_e = downloadInfo === null || downloadInfo === void 0 ? void 0 : downloadInfo.gain) !== null && _e !== void 0 ? _e : false,
            preview: false,
            encrypted
        };
        if (!downloadUrl.includes("/music-v2/crypt/")) {
            return base;
        }
        // Если нужно дешифровать только FLAC / FLAC-MP4 — можно добавить проверку
        // if (codec !== DownloadTrackCodec.FLAC && codec !== DownloadTrackCodec.FLACMP4) {
        //   return base;
        // }
        const res = await fetch(downloadUrl);
        const encryptedBytes = await res.arrayBuffer();
        const keyHex = downloadInfo.key;
        if (!keyHex) {
            return base;
        }
        const decryptedBuffer = await (0, CryptoYM_1.decryptData)({
            key: keyHex,
            data: encryptedBytes,
            loadedBytes: 0
        });
        // Для браузера можно сразу сделать BlobURL
        let decryptedUrl;
        if (typeof URL !== "undefined" && typeof Blob !== "undefined") {
            const mime = codec === Types_1.DownloadTrackCodec.FLAC ||
                codec === Types_1.DownloadTrackCodec.FLACMP4
                ? "audio/flac"
                : "audio/mp4";
            const blob = new Blob([decryptedBuffer], { type: mime });
            decryptedUrl = URL.createObjectURL(blob);
        }
        return {
            ...base,
            decryptedBuffer,
            decryptedUrl
        };
    }
    /**
     * @ru Получить прямую ссылку для скачивания трека.
     * @en Get direct download URL for track.
     * @param track ID трека или URL.
     * @param options Опции скачивания.
     * @returns Промис с прямой ссылкой на скачивание.
     */
    async getDownloadUrl(track, options = {}) {
        const info = await this.getDownloadInfo(track, options);
        let link;
        if (info.decryptedUrl) {
            link = info.decryptedUrl;
        }
        else {
            link = info.downloadInfoUrl;
        }
        return this.api.getTrackDirectLinkNew(link);
    }
    // ============================================
    // FFmpeg & Best Quality Methods
    // ============================================
    /**
     * @ru Получить URL для скачивания в FFmpeg-compatible формате (MP3 raw).
     * @en Get FFmpeg-compatible download URL (raw MP3).
     * @param track Track ID or URL to download.
     * @param quality Quality level for download.
     * @returns Promise with download URL or null on error.
     */
    async getDownloadUrlForFFmpeg(track, quality = Types_1.DownloadTrackQuality.Lossless) {
        try {
            return await this.getDownloadUrl(track, {
                codec: Types_1.DownloadTrackCodec.MP3,
                quality,
                forceRaw: true
            });
        }
        catch {
            return null;
        }
    }
    /**
     * @ru Получить лучший доступный URL для скачивания по приоритету кодеков.
     * @en Get best available download URL based on codec priority.
     * @param track Track ID or URL to download.
     * @param quality Quality level for download.
     * @returns Promise with best available download URL or null.
     */
    async getBestDownloadUrl(track, quality = Types_1.DownloadTrackQuality.Lossless) {
        for (const codec of CODEC_PRIORITY) {
            try {
                return await this.getDownloadUrl(track, { codec, quality });
            }
            catch {
                continue;
            }
        }
        return null;
    }
    /**
     * @ru Проверить, является ли URL зашифрованным.
     * @en Check if URL is encrypted.
     * @param url URL to check for encryption.
     * @returns True if URL is encrypted, false otherwise.
     */
    isEncryptedUrl(url) {
        return url.includes("/music-v2/crypt/") && url.includes("kts=");
    }
    // ============================================
    // Convenience Methods (Factory-based)
    // ============================================
    createDownloadInfoGetter(codec, forceRaw = false) {
        return (track, quality = Types_1.DownloadTrackQuality.Lossless) => this.getDownloadInfo(track, { codec, quality, forceRaw });
    }
    createDownloadUrlGetter(codec, forceRaw = false) {
        return (track, quality = Types_1.DownloadTrackQuality.Lossless) => this.getDownloadUrl(track, { codec, quality, forceRaw });
    }
    // ============================================
    // Entity Getters
    // ============================================
    /**
     * @ru Получить плейлист по ID или URL.
     * @en Get playlist by ID or URL.
     * @param playlist Playlist ID or URL.
     * @param user Optional user identifier for playlist ownership.
     * @returns Promise with playlist information.
     */
    getPlaylist(playlist, user) {
        const { id, user: extractedUser } = this.getPlaylistId(playlist, user);
        return typeof id === "number"
            ? this.api.getPlaylist(id, extractedUser)
            : this.api.getPlaylist(id);
    }
    /**
     * @ru Получить трек по ID или URL.
     * @en Get track by ID or URL.
     * @param track Track ID or URL.
     * @returns Promise with track information.
     */
    getTrack(track) {
        return this.api.getSingleTrack(this.getTrackId(track));
    }
    /**
     * @ru Получить альбом по ID или URL.
     * @en Get album by ID or URL.
     * @param album Album ID or URL.
     * @param withTracks Whether to include tracks in response.
     * @returns Promise with album information.
     */
    getAlbum(album, withTracks = false) {
        return this.api.getAlbum(this.getAlbumId(album), withTracks);
    }
    /**
     * @ru Получить альбом с треками по ID или URL.
     * @en Get album with tracks by ID or URL.
     * @param album Album ID or URL.
     * @returns Promise with album including tracks.
     */
    getAlbumWithTracks(album) {
        return this.api.getAlbumWithTracks(this.getAlbumId(album));
    }
    /**
     * @ru Получить исполнителя по ID или URL.
     * @en Get artist by ID or URL.
     * @param artist Artist ID or URL.
     * @returns Promise with artist information.
     */
    getArtist(artist) {
        return this.api.getArtist(this.getArtistId(artist));
    }
}
exports.default = WrappedYMApi;
