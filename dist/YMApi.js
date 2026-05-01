"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidUrlError = exports.DownloadInfoError = exports.TrackNotFoundError = exports.AuthError = exports.YMApiError = void 0;
const index_js_1 = require("./PreparedRequest/index.js");
const config_js_1 = __importDefault(require("./PreparedRequest/config.js"));
const crypto_1 = require("crypto");
const timeout_js_1 = require("./utils/timeout.js");
const index_js_2 = require("./Types/index.js");
const ClckApi_js_1 = __importDefault(require("./ClckApi.js"));
const hyperttp_1 = require("hyperttp");
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
// ============================================
// Constants
// ============================================
const SIGNATURE_KEY = "kzqU4XhfCaY6B6JTHODeq5";
const DIRECT_LINK_SALT = "XGRlBW9FXlekgbPrRHuSiA";
const SERVER_OFFSET_CACHE_TTL = 300000;
const DEFAULT_HTTP_CONFIG = {
    timeout: 10000,
    maxRetries: 2,
    maxConcurrent: 20,
    cacheTTL: 60000,
    userAgent: "YandexMusicDesktopAppWindows/5.13.2",
    enableCache: true,
    enableRateLimit: true,
    enableQueue: true
};
// ============================================
// Main Class
// ============================================
class YMApi {
    constructor(httpClient = new hyperttp_1.HttpClientImproved(DEFAULT_HTTP_CONFIG), config = config_js_1.default) {
        this.httpClient = httpClient;
        this.config = config;
        this.user = {
            password: "",
            token: "",
            uid: 0,
            username: ""
        };
        this.serverOffsetCache = null;
    }
    // ============================================
    // Private Helpers
    // ============================================
    get authHeader() {
        return { Authorization: `OAuth ${this.user.token}` };
    }
    get deviceHeader() {
        return {
            "X-Yandex-Music-Device": "os=unknown; os_version=unknown; manufacturer=unknown; model=unknown; clid=; device_id=unknown; uuid=unknown"
        };
    }
    resolveUserId(userId) {
        return userId == null || userId === 0 || userId === ""
            ? this.user.uid
            : userId;
    }
    assertAuthenticated() {
        if (!this.user.token) {
            throw new AuthError("User token is missing");
        }
    }
    /** Creates an authenticated API request */
    createRequest(path) {
        return (0, index_js_1.apiRequest)().setPath(path).addHeaders(this.authHeader);
    }
    /** Generic GET request with result extraction */
    async get(request, responseType) {
        const response = await this.httpClient.get(request, responseType);
        return response.result;
    }
    /** Generic POST request with result extraction */
    async post(request, responseType) {
        const response = await this.httpClient.post(request, responseType);
        return response.result;
    }
    // ============================================
    // Authentication
    // ============================================
    /**
     * POST: /token
     * @ru Инициализация API клиента с аутентификацией.
     * @en Initialize API client with authentication.
     * @param config Параметры конфигурации API.
     * @returns Промис с данными авторизации.
     */
    async init(config) {
        if (config.access_token && config.uid) {
            this.user.token = config.access_token;
            this.user.uid = config.uid;
            return { access_token: config.access_token, uid: config.uid };
        }
        if (!config.username || !config.password) {
            throw new AuthError("username && password || access_token && uid must be set");
        }
        this.user.username = config.username;
        this.user.password = config.password;
        const data = await this.get((0, index_js_1.authRequest)().setPath("/token").setQuery({
            grant_type: "password",
            username: this.user.username,
            password: this.user.password,
            client_id: this.config.oauth.CLIENT_ID,
            client_secret: this.config.oauth.CLIENT_SECRET
        }));
        this.user.token = data.access_token;
        this.user.uid = data.uid;
        return data;
    }
    // ============================================
    // Account & Feed
    // ============================================
    /**
     * GET: /account/status
     * @ru Получить статус аккаунта текущего пользователя.
     * @en Get account status of current user.
     * @returns Promise с информацией об аккаунте.
     */
    getAccountStatus() {
        return this.get(this.createRequest("/account/status"));
    }
    /**
     * GET: /feed
     * @ru Получить ленту активности пользователя.
     * @en Get user's activity feed.
     * @returns Promise с лентой активности.
     */
    getFeed() {
        return this.get(this.createRequest("/feed"));
    }
    // ============================================
    // Landing Pages
    // ============================================
    /**
     * GET: /landing3/chart/{chartType}
     * @ru Получить треки из чарта.
     * @en Get tracks from chart.
     * @param chartType Тип чарта (россия или мир).
     * @returns Promise с треками чарта.
     */
    getChart(chartType) {
        return this.get(this.createRequest(`/landing3/chart/${chartType}`));
    }
    /**
     * GET: /landing3/new-playlists
     * @ru Получить новые плейлисты.
     * @en Get new playlists.
     * @returns Promise с новыми плейлистами.
     */
    getNewPlaylists() {
        return this.get(this.createRequest("/landing3/new-playlists"));
    }
    /**
     * GET: /landing3/new-releases
     * @ru Получить новые релизы.
     * @en Get new releases.
     * @returns Promise с новыми релизами.
     */
    getNewReleases() {
        return this.get(this.createRequest("/landing3/new-releases"));
    }
    /**
     * GET: /landing3/podcasts
     * @ru Получить подкасты.
     * @en Get podcasts.
     * @returns Promise с подкастами.
     */
    getPodcasts() {
        return this.get(this.createRequest("/landing3/podcasts"));
    }
    /**
     * GET: /genres
     * @ru Получить список музыкальных жанров.
     * @en Get list of music genres.
     * @returns Promise со списком жанров.
     */
    getGenres() {
        return this.get(this.createRequest("/genres"));
    }
    // ============================================
    // Search
    // ============================================
    /**
     * GET: /search
     * @ru Поиск контента в Yandex Music.
     * @en Search content in Yandex Music.
     * @param query Строка поиска.
     * @param options Опции поиска.
     * @returns Promise с результатами поиска.
     */
    async search(query, options = {}) {
        var _a, _b, _c;
        const request = this.createRequest("/search").setQuery({
            type: (_a = options.type) !== null && _a !== void 0 ? _a : "all",
            text: query,
            page: String((_b = options.page) !== null && _b !== void 0 ? _b : 0),
            nocorrect: String((_c = options.nococrrect) !== null && _c !== void 0 ? _c : false) // API typo preserved
        });
        if (options.pageSize !== undefined) {
            request.addQuery({ pageSize: String(options.pageSize) });
        }
        return this.get(request);
    }
    /**
     * @ru Поиск исполнителей.
     * @en Search for artists.
     * @param query Строка поиска.
     * @param options Опции поиска.
     * @returns Promise с результатами поиска исполнителей.
     */
    searchArtists(query, options = {}) {
        return this.search(query, { ...options, type: "artist" });
    }
    /**
     * @ru Поиск треков.
     * @en Search for tracks.
     * @param query Строка поиска.
     * @param options Опции поиска.
     * @returns Promise с результатами поиска треков.
     */
    searchTracks(query, options = {}) {
        return this.search(query, { ...options, type: "track" });
    }
    /**
     * @ru Поиск альбомов.
     * @en Search for albums.
     * @param query Строка поиска.
     * @param options Опции поиска.
     * @returns Promise с результатами поиска альбомов.
     */
    searchAlbums(query, options = {}) {
        return this.search(query, { ...options, type: "album" });
    }
    /**
     * @ru Поиск контента всех типов.
     * @en Search all content types.
     * @param query Строка поиска.
     * @param options Опции поиска.
     * @returns Promise с результатами поиска всех типов.
     */
    searchAll(query, options = {}) {
        return this.search(query, { ...options, type: "all" });
    }
    // ============================================
    // Playlists
    // ============================================
    /**
     * GET: /users/{uid}/playlists/list
     * @ru Получить плейлисты пользователя.
     * @en Get user's playlists.
     * @param userId ID пользователя (опционально).
     * @returns Promise с массивом плейлистов.
     */
    getUserPlaylists(userId = null) {
        const uid = this.resolveUserId(userId);
        return this.get(this.createRequest(`/users/${uid}/playlists/list`));
    }
    getPlaylist(playlistId, user = null) {
        if (typeof playlistId === "number") {
            const uid = this.resolveUserId(user);
            return this.get(this.createRequest(`/users/${uid}/playlists/${playlistId}`));
        }
        const normalizedId = playlistId.replace("/playlists/", "/playlist/");
        return this.get(this.createRequest(`/playlist/${normalizedId}`).addQuery({
            richTracks: "true"
        }));
    }
    /** @deprecated Используйте getPlaylist(string) вместо этого метода.
     *  @en Use getPlaylist(string) instead of this method. */
    getPlaylistNew(playlistId) {
        return this.getPlaylist(playlistId);
    }
    /**
     * GET: /users/{uid}/playlists
     * @ru Получить несколько плейлистов.
     * @en Get multiple playlists.
     * @param playlists Массив ID плейлистов.
     * @param user ID пользователя.
     * @param options Опции загрузки.
     * @returns Promise с массивом плейлистов.
     */
    getPlaylists(playlists, user = null, options = {}) {
        var _a, _b;
        const uid = this.resolveUserId(user);
        return this.get(this.createRequest(`/users/${uid}/playlists`).setQuery({
            kinds: playlists.join(),
            mixed: String((_a = options.mixed) !== null && _a !== void 0 ? _a : false),
            "rich-tracks": String((_b = options["rich-tracks"]) !== null && _b !== void 0 ? _b : false)
        }));
    }
    /**
     * POST: /users/{uid}/playlists/create
     * @ru Создать новый плейлист.
     * @en Create new playlist.
     * @param name Название плейлиста.
     * @param options Опции видимости.
     * @returns Promise с созданным плейлистом.
     */
    async createPlaylist(name, options = {}) {
        var _a;
        if (!name)
            throw new YMApiError("Playlist name is required", "INVALID_INPUT");
        return this.post(this.createRequest(`/users/${this.user.uid}/playlists/create`)
            .addHeaders({ "content-type": "application/x-www-form-urlencoded" })
            .setBodyData({
            title: name,
            visibility: (_a = options.visibility) !== null && _a !== void 0 ? _a : "private"
        }));
    }
    /**
     * POST: /users/{uid}/playlists/{id}/delete
     * @ru Удалить плейлист.
     * @en Delete playlist.
     * @param playlistId ID плейлиста.
     * @returns Promise с результатом удаления.
     */
    removePlaylist(playlistId) {
        return this.post(this.createRequest(`/users/${this.user.uid}/playlists/${playlistId}/delete`));
    }
    /**
     * POST: /users/{uid}/playlists/{id}/name
     * @ru Переименовать плейлист.
     * @en Rename playlist.
     * @param playlistId ID плейлиста.
     * @param name Новое название.
     * @returns Promise с обновленным плейлистом.
     */
    renamePlaylist(playlistId, name) {
        return this.post(this.createRequest(`/users/${this.user.uid}/playlists/${playlistId}/name`).setBodyData({ value: name }));
    }
    /**
     * POST: /users/{uid}/playlists/{id}/change-relative
     * @ru Добавить треки в плейлист.
     * @en Add tracks to playlist.
     * @param playlistId ID плейлиста.
     * @param tracks Массив треков для добавления.
     * @param revision Ревизия плейлиста.
     * @param options Опции позиции.
     * @returns Promise с обновленным плейлистом.
     */
    addTracksToPlaylist(playlistId, tracks, revision, options = {}) {
        var _a;
        const formattedTracks = tracks.map(t => ({
            id: String(t.id),
            albumId: String(t.albumId)
        }));
        const diff = JSON.stringify([
            {
                op: "insert",
                at: (_a = options.at) !== null && _a !== void 0 ? _a : 0,
                tracks: formattedTracks
            }
        ]);
        return this.post(this.createRequest(`/users/${this.user.uid}/playlists/${playlistId}/change-relative`)
            .addHeaders({ "content-type": "application/x-www-form-urlencoded" })
            .setBodyData({
            diff: diff,
            revision: String(revision)
        }));
    }
    /**
     * POST: /users/{uid}/playlists/{id}/change-relative
     * @ru Удалить треки из плейлиста.
     * @en Remove tracks from playlist.
     * @param playlistId ID плейлиста.
     * @param tracks Массив треков для удаления.
     * @param revision Ревизия плейлиста.
     * @param options Опции диапазона.
     * @returns Promise с обновленным плейлистом.
     */
    removeTracksFromPlaylist(playlistId, tracks, revision, options = {}) {
        var _a, _b;
        return this.post(this.createRequest(`/users/${this.user.uid}/playlists/${playlistId}/change-relative`).setBodyData({
            diff: JSON.stringify([
                {
                    op: "delete",
                    from: (_a = options.from) !== null && _a !== void 0 ? _a : 0,
                    to: (_b = options.to) !== null && _b !== void 0 ? _b : tracks.length,
                    tracks
                }
            ]),
            revision: String(revision)
        }));
    }
    // ============================================
    // Tracks
    // ============================================
    /**
     * @ru Получить информацию о треке по ID.
     * @en Get track information by ID.
     * @param trackId Идентификатор трека.
     * @returns Promise с информацией о треке.
     */
    getTrack(trackId) {
        return this.get(this.createRequest(`/tracks/${trackId}`).addHeaders({
            "content-type": "application/json"
        }));
    }
    /**
     * @ru Получить одиночный трек по ID.
     * @en Get single track by ID.
     * @param trackId Идентификатор трека.
     * @returns Promise с треком.
     */
    async getSingleTrack(trackId) {
        const tracks = await this.getTrack(trackId);
        if (!(tracks === null || tracks === void 0 ? void 0 : tracks.length))
            throw new TrackNotFoundError(trackId);
        return tracks[0];
    }
    /**
     * @ru Получить дополнительную информацию о треке.
     * @en Get additional track information.
     * @param trackId Идентификатор трека.
     * @returns Promise с дополнительной информацией.
     */
    getTrackSupplement(trackId) {
        return this.get(this.createRequest(`/tracks/${trackId}/supplement`));
    }
    /**
     * @ru Получить похожие треки.
     * @en Get similar tracks.
     * @param trackId Идентификатор трека.
     * @returns Promise с похожими треками.
     */
    getSimilarTracks(trackId) {
        return this.get(this.createRequest(`/tracks/${trackId}/similar`));
    }
    /**
     * @ru Получить информацию для скачивания трека.
     * @en Get track download information.
     * @param trackId Идентификатор трека.
     * @param quality Качество загрузки.
     * @param canUseStreaming Разрешить использование стриминга.
     * @returns Promise с информацией о загрузке.
     */
    async getTrackDownloadInfo(trackId, quality = index_js_2.DownloadTrackQuality.Lossless, canUseStreaming = true) {
        const ts = Math.floor(Date.now() / 1000);
        const sign = this.generateTrackSignature(ts, String(trackId), quality, "mp3", "raw");
        return this.get(this.createRequest(`/tracks/${trackId}/download-info`).addQuery({
            ts: String(ts),
            can_use_streaming: String(canUseStreaming),
            sign
        }));
    }
    /**
     * @ru Получить информацию для скачивания трека (новый метод).
     * @en Get track download information (new method).
     * @param trackId Идентификатор трека.
     * @param quality Качество загрузки.
     * @param codecs Кодеки.
     * @param transport Тип транспорта.
     * @returns Promise с информацией о файле.
     */
    async getTrackDownloadInfoNew(trackId, quality = index_js_2.DownloadTrackQuality.Lossless, codecs = "flac,aac,he-aac,mp3,flac-mp4,aac-mp4,he-aac-mp4", transport = "encraw") {
        this.assertAuthenticated();
        const offset = await this.getYandexServerOffset();
        const ts = Math.floor(Date.now() / 1000 + offset);
        const sign = this.generateTrackSignature(ts, String(trackId), quality, codecs, transport);
        return this.get(this.createRequest("/get-file-info").addQuery({
            ts: String(ts),
            trackId: String(trackId),
            quality,
            codecs,
            transports: transport,
            sign
        }));
    }
    /**
     * @ru Получить прямую ссылку на скачивание трека.
     * @en Get direct download link for track.
     * @param trackDownloadUrl URL для скачивания.
     * @param short Использовать короткую ссылку.
     * @returns Promise со ссылкой для скачивания.
     */
    async getTrackDirectLink(trackDownloadUrl, short = false) {
        const request = (0, index_js_1.directLinkRequest)(trackDownloadUrl);
        const rawResponse = await this.httpClient.get(request, "json");
        const downloadInfo = rawResponse["download-info"];
        if (!downloadInfo)
            throw new DownloadInfoError("Download info missing in response");
        const { host, path, ts, s } = downloadInfo;
        const sign = (0, crypto_1.createHash)("md5")
            .update(DIRECT_LINK_SALT + path.slice(1) + s)
            .digest("hex");
        const link = `https://${host}/get-mp3/${sign}/${ts}${path}`;
        return short ? (0, ClckApi_js_1.default)(link) : link;
    }
    /**
     * @ru Получить прямую ссылку на трек (новый метод).
     * @en Get direct track link (new method).
     * @param trackUrl URL трека.
     * @returns Прямая ссылка на трек.
     */
    getTrackDirectLinkNew(trackUrl) {
        return trackUrl;
    }
    /**
     * @ru Извлечь ID трека из URL.
     * @en Extract track ID from URL.
     * @param url URL трека.
     * @returns ID трека.
     */
    extractTrackId(url) {
        const match = url.match(/\/track\/(\d+)/);
        if (!match)
            throw new InvalidUrlError(url);
        return match[1];
    }
    /**
     * @ru Получить ссылку для поделиться треком.
     * @en Get share link for track.
     * @param track Трек или ID трека.
     * @returns Promise со ссылкой для поделиться.
     */
    async getTrackShareLink(track) {
        const [albumId, trackId] = typeof track === "object"
            ? [track.albums[0].id, track.id]
            : [(await this.getSingleTrack(track)).albums[0].id, Number(track)];
        return `https://music.yandex.ru/album/${albumId}/track/${trackId}`;
    }
    // ============================================
    // Albums
    // ============================================
    /**
     * @ru Получить информацию об альбоме.
     * @en Get album information.
     * @param albumId Идентификатор альбома.
     * @param withTracks Включать треки в ответ.
     * @returns Promise с информацией об альбоме.
     */
    getAlbum(albumId, withTracks = false) {
        const path = withTracks
            ? `/albums/${albumId}/with-tracks`
            : `/albums/${albumId}`;
        return this.get(this.createRequest(path));
    }
    /**
     * @ru Получить альбом с треками.
     * @en Get album with tracks.
     * @param albumId Идентификатор альбома.
     * @returns Promise с альбомом и треками.
     */
    getAlbumWithTracks(albumId) {
        return this.getAlbum(albumId, true);
    }
    /**
     * @ru Получить информацию о нескольких альбомах.
     * @en Get information about multiple albums.
     * @param albumIds Массив ID альбомов.
     * @returns Promise с массивом альбомов.
     */
    getAlbums(albumIds) {
        return this.post(this.createRequest("/albums").setBodyData({ albumIds: albumIds.join() }));
    }
    // ============================================
    // Artists
    // ============================================
    /**
     * @ru Получить информацию об исполнителе.
     * @en Get artist information.
     * @param artistId Идентификатор исполнителя.
     * @returns Promise с полной информацией об исполнителе.
     */
    getArtist(artistId) {
        return this.get(this.createRequest(`/artists/${artistId}`));
    }
    /**
     * @ru Получить информацию о нескольких исполнителях.
     * @en Get information about multiple artists.
     * @param artistIds Массив ID исполнителей.
     * @returns Promise с массивом исполнителей.
     */
    getArtists(artistIds) {
        return this.post(this.createRequest("/artists").setBodyData({
            artistIds: artistIds.join()
        }));
    }
    /**
     * @ru Получить треки исполнителя.
     * @en Get artist tracks.
     * @param artistId Идентификатор исполнителя.
     * @param options Опции пагинации.
     * @returns Promise с треками исполнителя.
     */
    getArtistTracks(artistId, options = {}) {
        var _a;
        const request = this.createRequest(`/artists/${artistId}/tracks`).setQuery({
            page: String((_a = options.page) !== null && _a !== void 0 ? _a : 0)
        });
        if (options.pageSize !== undefined) {
            request.addQuery({ pageSize: String(options.pageSize) });
        }
        return this.get(request);
    }
    // ============================================
    // User Preferences
    // ============================================
    /**
     * @ru Получить понравившиеся треки пользователя.
     * @en Get user's liked tracks.
     * @param userId ID пользователя (опционально).
     * @returns Promise с понравившимися треками.
     */
    getLikedTracks(userId = null) {
        const uid = this.resolveUserId(userId);
        return this.get(this.createRequest(`/users/${uid}/likes/tracks`));
    }
    /**
     * @ru Получить не понравившиеся треки пользователя.
     * @en Get user's disliked tracks.
     * @param userId ID пользователя (опционально).
     * @returns Promise с не понравившимися треками.
     */
    getDislikedTracks(userId = null) {
        const uid = this.resolveUserId(userId);
        return this.get(this.createRequest(`/users/${uid}/dislikes/tracks`));
    }
    // ============================================
    // Radio Stations (Rotor)
    // ============================================
    /**
     * @ru Получить список всех радиостанций.
     * @en Get list of all radio stations.
     * @param language Язык для списка станций.
     * @returns Promise со списком радиостанций.
     */
    getAllStationsList(language) {
        const request = this.createRequest("/rotor/stations/list");
        if (language)
            request.setQuery({ language });
        return this.get(request);
    }
    /**
     * @ru Получить рекомендованные радиостанции.
     * @en Get recommended radio stations.
     * @returns Promise с рекомендованными радиостанциями.
     */
    getRecomendedStationsList() {
        return this.get(this.createRequest("/rotor/stations/dashboard"));
    }
    /**
     * @ru Получить треки радиостанции.
     * @en Get radio station tracks.
     * @param stationId ID радиостанции.
     * @param queue ID предыдущего трека.
     * @returns Promise с треками станции.
     */
    getStationTracks(stationId, queue) {
        const request = this.createRequest(`/rotor/station/${stationId}/tracks`);
        if (queue)
            request.addQuery({ queue });
        return this.get(request);
    }
    /**
     * @ru Получить информацию о радиостанции.
     * @en Get radio station information.
     * @param stationId ID радиостанции.
     * @returns Promise с информацией о станции.
     */
    getStationInfo(stationId) {
        return this.get(this.createRequest(`/rotor/station/${stationId}/info`));
    }
    /**
     * @ru Создать сессию Rotor.
     * @en Create Rotor session.
     * @param seeds Массив ID станций.
     * @param includeTracksInResponse Включать треки в ответ.
     * @returns Promise с созданной сессией.
     */
    createRotorSession(seeds, includeTracksInResponse = true) {
        const body = { seeds, includeTracksInResponse };
        return this.post(this.createRequest("/rotor/session/new").setBodyData(body));
    }
    /**
     * @ru Получить треки сессии Rotor.
     * @en Get Rotor session tracks.
     * @param sessionId ID сессии.
     * @param options Опции запроса.
     * @returns Promise с треками сессии.
     */
    postRotorSessionTracks(sessionId, options) {
        const body = {};
        if (options === null || options === void 0 ? void 0 : options.queue)
            body.queue = options.queue;
        if (options === null || options === void 0 ? void 0 : options.batchId)
            body.batchId = options.batchId;
        return this.post(this.createRequest(`/rotor/session/${sessionId}/tracks`).setBodyData(body));
    }
    // ============================================
    // Queues
    // ============================================
    /**
     * @ru Получить список очередей воспроизведения.
     * @en Get list of playback queues.
     * @returns Promise со списком очередей.
     */
    getQueues() {
        return this.get(this.createRequest("/queues").addHeaders(this.deviceHeader));
    }
    /**
     * @ru Получить информацию об очереди воспроизведения.
     * @en Get playback queue information.
     * @param queueId ID очереди.
     * @returns Promise с информацией об очереди.
     */
    getQueue(queueId) {
        return this.get(this.createRequest(`/queues/${queueId}`));
    }
    // ============================================
    // Private: Server Time & Signatures
    // ============================================
    async getYandexServerOffset(retries = 3, timeoutMs = 2000) {
        if (this.serverOffsetCache) {
            const age = Date.now() - this.serverOffsetCache.timestamp;
            if (age < SERVER_OFFSET_CACHE_TTL) {
                return this.serverOffsetCache.value;
            }
        }
        const fetchOffset = async () => {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
            try {
                const resp = await fetch("https://api.music.yandex.net", {
                    signal: controller.signal
                });
                const dateHeader = resp.headers.get("Date");
                if (!dateHeader)
                    throw new Error("Date header missing");
                const serverTime = Math.floor(new Date(dateHeader).getTime() / 1000);
                const localTime = Math.floor(Date.now() / 1000);
                const offset = serverTime - localTime;
                this.serverOffsetCache = { value: offset, timestamp: Date.now() };
                return offset;
            }
            finally {
                clearTimeout(timeoutId);
            }
        };
        try {
            return await (0, timeout_js_1.withRetry)(fetchOffset, retries);
        }
        catch {
            return 0;
        }
    }
    generateTrackSignature(ts, trackId, quality, codecs, transports) {
        const signBase = `${ts}${trackId}${quality}${codecs}${transports}`.replace(/,/g, "");
        return Buffer.from((0, crypto_1.createHmac)("sha256", SIGNATURE_KEY).update(signBase).digest())
            .toString("base64")
            .replace(/=+$/, "");
    }
}
exports.default = YMApi;
