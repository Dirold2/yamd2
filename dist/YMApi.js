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
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const PreparedRequest_1 = require("./PreparedRequest");
const config_1 = __importDefault(require("./PreparedRequest/config"));
const Network_1 = require("./Network");
const crypto = __importStar(require("crypto"));
const timeout_1 = require("./utils/timeout");
const Types_1 = require("./Types");
const ClckApi_1 = __importDefault(require("./ClckApi"));
class YMApi {
    constructor(httpClient = new Network_1.HttpClient(), config = config_1.default) {
        this.httpClient = httpClient;
        this.config = config;
        this.user = {
            password: "",
            token: "",
            uid: 0,
            username: ""
        };
        this.serverOffsetCache = null;
        this.SERVER_OFFSET_CACHE_TTL = 300000; // 5 minutes
    }
    getAuthHeader() {
        return {
            Authorization: `OAuth ${this.user.token}`
        };
    }
    getFakeDeviceHeader() {
        return {
            "X-Yandex-Music-Device": "os=unknown; os_version=unknown; manufacturer=unknown; model=unknown; clid=; device_id=unknown; uuid=unknown"
        };
    }
    /**
     * Authentication
     * @returns access_token & uid
     */
    async init(config) {
        // Skip auth if access_token and uid are present
        if (config.access_token && config.uid) {
            this.user.token = config.access_token;
            this.user.uid = config.uid;
            return {
                access_token: config.access_token,
                uid: config.uid
            };
        }
        if (!config.username || !config.password) {
            throw new Error("username && password || access_token && uid must be set");
        }
        this.user.username = config.username;
        this.user.password = config.password;
        const data = (await this.httpClient.get((0, PreparedRequest_1.authRequest)().setPath("/token").setQuery({
            grant_type: "password",
            username: this.user.username,
            password: this.user.password,
            client_id: this.config.oauth.CLIENT_ID,
            client_secret: this.config.oauth.CLIENT_SECRET
        })));
        this.user.token = data.access_token;
        this.user.uid = data.uid;
        return data;
    }
    /**
     * GET: /account/status
     * @returns account status for current user
     */
    getAccountStatus() {
        const request = (0, PreparedRequest_1.apiRequest)()
            .setPath("/account/status")
            .addHeaders(this.getAuthHeader());
        return this.httpClient.get(request);
    }
    /**
     * GET: /feed
     * @returns the user's feed
     */
    getFeed() {
        const request = (0, PreparedRequest_1.apiRequest)()
            .setPath("/feed")
            .addHeaders(this.getAuthHeader());
        return this.httpClient.get(request);
    }
    /**
     *
     * @param ChartType Type of chart.
     * GET: /landing3/chart/{ChartType}
     * @returns chart of songs.
     */
    getChart(ChartType) {
        const request = (0, PreparedRequest_1.apiRequest)()
            .setPath(`/landing3/chart/${ChartType}`)
            .addHeaders(this.getAuthHeader());
        return this.httpClient.get(request);
    }
    /**
     * GET: /landing3/new-playlists
     * @returns new playlists (for you).
     */
    getNewPlaylists() {
        const request = (0, PreparedRequest_1.apiRequest)()
            .setPath("/landing3/new-playlists")
            .addHeaders(this.getAuthHeader());
        return this.httpClient.get(request);
    }
    /**
     * GET: /landing3/new-releases
     * @returns new releases.
     */
    getNewReleases() {
        const request = (0, PreparedRequest_1.apiRequest)()
            .setPath("/landing3/new-releases")
            .addHeaders(this.getAuthHeader());
        return this.httpClient.get(request);
    }
    /**
     * GET: /landing3/podcasts
     * @returns all podcasts.
     */
    getPodcasts() {
        const request = (0, PreparedRequest_1.apiRequest)()
            .setPath("/landing3/podcasts")
            .addHeaders(this.getAuthHeader());
        return this.httpClient.get(request);
    }
    /**
     * GET: /genres
     * @returns a list of music genres
     */
    getGenres() {
        const request = (0, PreparedRequest_1.apiRequest)()
            .setPath("/genres")
            .addHeaders(this.getAuthHeader());
        return this.httpClient.get(request);
    }
    /**
     * GET: /search
     * Search artists, tracks, albums.
     * @returns Every {type} with query in it's title.
     */
    async search(query, options = {}) {
        const type = !options.type ? "all" : options.type;
        const page = String(!options.page ? 0 : options.page);
        const nococrrect = String(options.nococrrect == null ? false : options.nococrrect);
        const request = (0, PreparedRequest_1.apiRequest)()
            .setPath("/search")
            .addHeaders(this.getAuthHeader())
            .setQuery({
            type,
            text: query,
            page,
            nococrrect
        });
        if (options.pageSize !== void 0) {
            request.addQuery({ pageSize: String(options.pageSize) });
        }
        return await this.httpClient.get(request);
    }
    /**
     * @param query Query
     * @param options Options
     * @returns Every artist with query in it's title.
     */
    searchArtists(query, options = {}) {
        return this.search(query, {
            ...options,
            type: "artist"
        });
    }
    /**
     * @param query Query
     * @param options Options
     * @returns Every track with query in it's title.
     */
    searchTracks(query, options = {}) {
        return this.search(query, {
            ...options,
            type: "track"
        });
    }
    /**
     * @param query Query
     * @param options Options
     * @returns Every album with query in it's title.
     */
    searchAlbums(query, options = {}) {
        return this.search(query, {
            ...options,
            type: "album"
        });
    }
    /**
     * @param query Query
     * @param options Options
     * @returns Everything with query in it's title.
     */
    searchAll(query, options = {}) {
        return this.search(query, {
            ...options,
            type: "all"
        });
    }
    /**
     * GET: /users/[user_id]/playlists/list
     * @returns a user's playlists.
     */
    getUserPlaylists(user = null) {
        const uid = [null, 0, ""].includes(user) ? this.user.uid : user;
        const request = (0, PreparedRequest_1.apiRequest)()
            .setPath(`/users/${uid}/playlists/list`)
            .addHeaders(this.getAuthHeader());
        return this.httpClient.get(request);
    }
    getPlaylist(playlistId, user = null) {
        const uid = [null, 0, ""].includes(user) ? this.user.uid : user;
        let request;
        if (typeof playlistId === "number") {
            request = (0, PreparedRequest_1.apiRequest)()
                .setPath(`/users/${uid}/playlists/${playlistId}`)
                .addHeaders(this.getAuthHeader());
        }
        else {
            if (playlistId.includes("/playlists/")) {
                playlistId = playlistId.replace("/playlists/", "/playlist/");
            }
            request = (0, PreparedRequest_1.apiRequest)()
                .setPath(`/playlist/${playlistId}`)
                .addHeaders(this.getAuthHeader())
                .addQuery({ richTracks: "true" });
        }
        return this.httpClient.get(request);
    }
    /**
     * GET: /playlist/[playlist_uuid]
     * @returns a playlist without tracks
     */
    // Kept for backward compatibility; now delegates to getPlaylist
    getPlaylistNew(playlistId) {
        return this.getPlaylist(playlistId);
    }
    /**
     * GET: /users/[user_id]/playlists
     * @returns an array of playlists with tracks
     */
    getPlaylists(playlists, user = null, options = {}) {
        const uid = [null, 0, ""].includes(user) ? this.user.uid : user;
        const kinds = playlists.join();
        const mixed = String(options.mixed == null ? false : options.mixed);
        const richTracks = String(options["rich-tracks"] == null ? false : options["rich-tracks"]);
        const request = (0, PreparedRequest_1.apiRequest)()
            .setPath(`/users/${uid}/playlists`)
            .addHeaders(this.getAuthHeader())
            .setQuery({
            kinds,
            mixed,
            "rich-tracks": richTracks
        });
        return this.httpClient.get(request);
    }
    /**
     * POST: /users/[user_id]/playlists/create
     * Create a new playlist
     * @returns Playlist
     */
    async createPlaylist(name, options = {}) {
        var _a;
        if (!name)
            throw new Error("Playlist name is required");
        const visibility = (_a = options.visibility) !== null && _a !== void 0 ? _a : "private"; // default to private
        const request = (0, PreparedRequest_1.apiRequest)()
            .setPath(`/users/${this.user.uid}/playlists/create`)
            .addHeaders(this.getAuthHeader())
            .addHeaders({ "content-type": "application/x-www-form-urlencoded" })
            .setBodyData({
            title: name,
            visibility
        });
        return await this.httpClient.post(request);
    }
    /**
     * POST: /users/[user_id]/playlists/[playlist_kind]/delete
     * Remove a playlist
     * @returns "ok" | string
     */
    removePlaylist(playlistId) {
        const request = (0, PreparedRequest_1.apiRequest)()
            .setPath(`/users/${this.user.uid}/playlists/${playlistId}/delete`)
            .addHeaders(this.getAuthHeader());
        return this.httpClient.post(request);
    }
    /**
     * POST: /users/[user_id]/playlists/[playlist_kind]/name
     * Change playlist name
     * @returns Playlist
     */
    renamePlaylist(playlistId, name) {
        const request = (0, PreparedRequest_1.apiRequest)()
            .setPath(`/users/${this.user.uid}/playlists/${playlistId}/name`)
            .addHeaders(this.getAuthHeader())
            .setBodyData({
            value: name
        });
        return this.httpClient.post(request);
    }
    /**
     * POST: /users/[user_id]/playlists/[playlist_kind]/change-relative
     * Add tracks to the playlist
     * @returns Playlist
     */
    addTracksToPlaylist(playlistId, tracks, revision, options = {}) {
        const at = !options.at ? 0 : options.at;
        const request = (0, PreparedRequest_1.apiRequest)()
            .setPath(`/users/${this.user.uid}/playlists/${playlistId}/change-relative`)
            .addHeaders(this.getAuthHeader())
            .addHeaders({ "content-type": "application/x-www-form-urlencoded" })
            .setBodyData({
            diff: JSON.stringify([
                {
                    op: "insert",
                    at,
                    tracks: tracks
                }
            ]),
            revision: String(revision)
        });
        return this.httpClient.post(request);
    }
    /**
     * POST: /users/[user_id]/playlists/[playlist_kind]/change-relative
     * Remove tracks from the playlist
     * @returns Playlist
     */
    removeTracksFromPlaylist(playlistId, tracks, revision, options = {}) {
        const from = !options.from ? 0 : options.from;
        const to = !options.to ? tracks.length : options.to;
        const request = (0, PreparedRequest_1.apiRequest)()
            .setPath(`/users/${this.user.uid}/playlists/${playlistId}/change-relative`)
            .addHeaders(this.getAuthHeader())
            .setBodyData({
            diff: JSON.stringify([
                {
                    op: "delete",
                    from,
                    to,
                    tracks
                }
            ]),
            revision: String(revision)
        });
        return this.httpClient.post(request);
    }
    /**
     * GET: /tracks/[track_id]
     * @returns an array of playlists with tracks
     */
    async getTrack(trackId) {
        const request = (0, PreparedRequest_1.apiRequest)()
            .setPath(`/tracks/${trackId}`)
            .addHeaders(this.getAuthHeader())
            .addHeaders({ "content-type": "application/json" });
        return await this.httpClient.get(request);
    }
    /**
     * GET: /tracks/[track_id]
     * @returns single track
     */
    async getSingleTrack(trackId) {
        const tracks = await this.getTrack(trackId);
        if (!tracks || tracks.length === 0) {
            throw new Error(`No track found for ID ${trackId}`);
        }
        return tracks[0];
    }
    /**
     * GET: /tracks/[track_id]/supplement
     * @returns an array of playlists with tracks
     */
    getTrackSupplement(trackId) {
        const request = (0, PreparedRequest_1.apiRequest)()
            .setPath(`/tracks/${trackId}/supplement`)
            .addHeaders(this.getAuthHeader());
        return this.httpClient.get(request);
    }
    /**
     * GET: /tracks/[track_id]/download-info
     * @returns track download information
     */
    async getTrackDownloadInfo(trackId, quality = Types_1.DownloadTrackQuality.Lossless, canUseStreaming = true) {
        const ts = Math.floor(Date.now() / 1000);
        const sign = this.generateTrackSignature(ts, String(trackId), quality);
        const request = (0, PreparedRequest_1.apiRequest)()
            .setPath(`/tracks/${trackId}/download-info`)
            .addHeaders(this.getAuthHeader())
            .addQuery({
            ts: String(ts),
            can_use_streaming: String(canUseStreaming),
            sign
        });
        return await this.httpClient.get(request);
    }
    async getTrackDownloadInfoNew(trackId, quality = Types_1.DownloadTrackQuality.Lossless) {
        if (!this.user.token)
            throw new Error("User token is missing");
        const offset = await this.getYandexServerOffset();
        const ts = Math.floor(Date.now() / 1000 + offset);
        const sign = this.generateTrackSignature(ts, String(trackId), quality);
        const request = (0, PreparedRequest_1.apiRequest)()
            .setPath("/get-file-info")
            .addHeaders(this.getAuthHeader())
            .addQuery({
            ts: String(ts),
            trackId: String(trackId),
            quality,
            codecs: "flac,aac,he-aac,mp3",
            transports: "raw",
            sign
        });
        return await this.httpClient.get(request);
    }
    /**
     * @returns track direct link
     */
    async getTrackDirectLink(trackDownloadUrl, short = false) {
        const request = (0, PreparedRequest_1.directLinkRequest)(trackDownloadUrl);
        const parsedXml = (await this.httpClient.get(request));
        const downloadInfo = parsedXml["download-info"];
        if (!downloadInfo)
            throw new Error("Download info missing in response");
        const host = downloadInfo.host;
        const path = downloadInfo.path;
        const ts = downloadInfo.ts;
        const s = downloadInfo.s;
        const sign = crypto
            .createHash("md5")
            .update("XGRlBW9FXlekgbPrRHuSiA" + path.slice(1) + s)
            .digest("hex");
        const link = `https://${host}/get-mp3/${sign}/${ts}${path}`;
        return short ? await (0, ClckApi_1.default)(link) : link;
    }
    async getTrackDirectLinkNew(trackUrl) {
        return `${trackUrl}`;
    }
    extractTrackId(url) {
        // пример: https://music.yandex.ru/album/14457044/track/25063569
        const match = url.match(/\/track\/(\d+)/);
        if (!match)
            throw new Error("Invalid Yandex Music track URL");
        return match[1];
    }
    /**
     * @returns track sharing link
     */
    async getTrackShareLink(track) {
        let albumid = 0, trackid = 0;
        if (typeof track === "object") {
            albumid = track.albums[0].id;
            trackid = track.id;
        }
        else {
            albumid = (await this.getSingleTrack(track)).albums[0].id;
            trackid = Number(track);
        }
        return `https://music.yandex.ru/album/${albumid}/track/${trackid}`;
    }
    /**
     * GET: /tracks/{track_id}/similar
     * @returns simmilar tracks
     */
    getSimilarTracks(trackId) {
        const request = (0, PreparedRequest_1.apiRequest)()
            .setPath(`/tracks/${trackId}/similar`)
            .addHeaders(this.getAuthHeader());
        return this.httpClient.get(request);
    }
    /**
     * GET: /albums/[album_id]
     * @returns an album
     */
    getAlbum(albumId, withTracks = false) {
        const request = (0, PreparedRequest_1.apiRequest)()
            .setPath(`/albums/${albumId}${withTracks ? "/with-tracks" : ""}`)
            .addHeaders(this.getAuthHeader());
        return this.httpClient.get(request);
    }
    getAlbumWithTracks(albumId) {
        return this.getAlbum(albumId, true);
    }
    /**
     * GET: /albums
     * @returns an albums
     */
    getAlbums(albumIds) {
        const request = (0, PreparedRequest_1.apiRequest)()
            .setPath(`/albums`)
            .setBodyData({ albumIds: albumIds.join() })
            .addHeaders(this.getAuthHeader());
        return this.httpClient.post(request);
    }
    /**
     * GET: /artists/[artist_id]
     * @returns an artist
     */
    getArtist(artistId) {
        const request = (0, PreparedRequest_1.apiRequest)()
            .setPath(`/artists/${artistId}`)
            .addHeaders(this.getAuthHeader());
        return this.httpClient.get(request);
    }
    /**
     * GET: /artists
     * @returns an artists
     */
    getArtists(artistIds) {
        const request = (0, PreparedRequest_1.apiRequest)()
            .setPath(`/artists`)
            .setBodyData({ artistIds: artistIds.join() })
            .addHeaders(this.getAuthHeader());
        return this.httpClient.post(request);
    }
    /**
     * GET: /artists/[artist_id]/tracks
     * @returns Tracks by artist id
     */
    getArtistTracks(artistId, options = {}) {
        const page = String(!options.page ? 0 : options.page);
        const request = (0, PreparedRequest_1.apiRequest)()
            .setPath(`/artists/${artistId}/tracks`)
            .addHeaders(this.getAuthHeader())
            .setQuery({
            page
        });
        if (options.pageSize !== void 0) {
            request.addQuery({ pageSize: String(options.pageSize) });
        }
        return this.httpClient.get(request);
    }
    /**
     * GET: /users/{userId}/likes/tracks
     * @param userId User id. Nullable.
     * @returns Liked Tracks
     */
    getLikedTracks(userId = null) {
        const uid = [null, 0, ""].includes(userId) ? this.user.uid : userId;
        const request = (0, PreparedRequest_1.apiRequest)()
            .setPath(`/users/${uid}/likes/tracks`)
            .addHeaders(this.getAuthHeader());
        return this.httpClient.get(request);
    }
    /**
     * GET: /users/{userId}/dislikes/tracks
     * @param userId User id. Nullable.
     * @returns Disliked Tracks
     */
    getDislikedTracks(userId = null) {
        const uid = [null, 0, ""].includes(userId) ? this.user.uid : userId;
        const request = (0, PreparedRequest_1.apiRequest)()
            .setPath(`/users/${uid}/dislikes/tracks`)
            .addHeaders(this.getAuthHeader());
        return this.httpClient.get(request);
    }
    /**
     * GET: /rotor/stations/list
     * @param language Language of station list
     * @returns list of stations.
     */
    getAllStationsList(language) {
        const request = (0, PreparedRequest_1.apiRequest)()
            .setPath(`/rotor/stations/list`)
            .addHeaders(this.getAuthHeader())
            .setQuery(language ? { language } : {});
        return this.httpClient.get(request);
    }
    /**
     * GET: /rotor/stations/dashboard
     * REQUIRES YOU TO BE LOGGED IN!
     * @returns list of recomended stations.
     */
    getRecomendedStationsList() {
        const request = (0, PreparedRequest_1.apiRequest)()
            .setPath("/rotor/stations/dashboard")
            .addHeaders(this.getAuthHeader());
        return this.httpClient.get(request);
    }
    /**
     * GET: /rotor/station/{stationId}/tracks
     * REQUIRES YOU TO BE LOGGED IN!
     * @param stationId Id of station. Example: user:onyourwave
     * @param queue Unique id of prev track.
     * @returns tracks from station.
     */
    getStationTracks(stationId, queue) {
        const request = (0, PreparedRequest_1.apiRequest)()
            .setPath(`/rotor/station/${stationId}/tracks`)
            .addHeaders(this.getAuthHeader())
            .addQuery(queue ? { queue } : {});
        return this.httpClient.get(request);
    }
    /**
     * GET: /rotor/station/{stationId}/info
     * @param stationId Id of station. Example: user:onyourwave
     * @returns info of the station.
     */
    getStationInfo(stationId) {
        const request = (0, PreparedRequest_1.apiRequest)()
            .setPath(`/rotor/station/${stationId}/info`)
            .addHeaders(this.getAuthHeader());
        return this.httpClient.get(request);
    }
    /**
     * POST: /rotor/session/new
     * @param seeds array of station ids e.g. ["user:onyourwave"]
     * @param includeTracksInResponse whether to include tracks in response
     */
    createRotorSession(seeds, includeTracksInResponse = true) {
        const body = {
            seeds,
            ...(includeTracksInResponse !== undefined
                ? { includeTracksInResponse }
                : {})
        };
        const request = (0, PreparedRequest_1.apiRequest)()
            .setPath(`/rotor/session/new`)
            .addHeaders(this.getAuthHeader())
            .setBodyData(body);
        return this.httpClient.post(request);
    }
    /**
     * POST: /rotor/session/{sessionId}/tracks
     * Retrieves the next batch of tracks within an existing session
     * @param sessionId The ID of the active session (radioSessionId)
     * @param options Object containing optional parameters such as queue (previous track ID), batchId, etc.
     */
    postRotorSessionTracks(sessionId, options) {
        const body = {
            ...((options === null || options === void 0 ? void 0 : options.queue) ? { queue: options.queue } : {}),
            ...((options === null || options === void 0 ? void 0 : options.batchId) ? { batchId: options.batchId } : {})
        };
        const request = (0, PreparedRequest_1.apiRequest)()
            .setPath(`/rotor/session/${sessionId}/tracks`)
            .addHeaders(this.getAuthHeader())
            .setBodyData(body);
        return this.httpClient.post(request);
    }
    /**
     * GET: /queues
     * @returns queues without tracks
     */
    getQueues() {
        const request = (0, PreparedRequest_1.apiRequest)()
            .setPath("/queues")
            .addHeaders(this.getFakeDeviceHeader())
            .addHeaders(this.getAuthHeader());
        return this.httpClient.get(request);
    }
    /**
     * GET: /queues/{queueId}
     * @param queueId Queue id.
     * @returns queue data with(?) tracks.
     */
    getQueue(queueId) {
        const request = (0, PreparedRequest_1.apiRequest)()
            .setPath(`/queues/${queueId}`)
            .addHeaders(this.getAuthHeader());
        return this.httpClient.get(request);
    }
    /**
     * Get Yandex server time offset with caching
     * @param retries Number of retry attempts
     * @param timeoutMs Timeout in milliseconds
     * @returns Server time offset in seconds
     */
    async getYandexServerOffset(retries = 3, timeoutMs = 2000) {
        if (this.serverOffsetCache) {
            const age = Date.now() - this.serverOffsetCache.timestamp;
            if (age < this.SERVER_OFFSET_CACHE_TTL) {
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
                clearTimeout(timeoutId);
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
            return await (0, timeout_1.withRetry)(fetchOffset, retries);
        }
        catch {
            return 0; // fallback to no offset
        }
    }
    /**
     * Generate signature for track download
     */
    generateTrackSignature(ts, trackId, quality) {
        const codecs = "flacaache-aacmp3";
        const transports = "raw";
        const signBase = `${ts}${trackId}${quality}${codecs}${transports}`;
        const key = "kzqU4XhfCaY6B6JTHODeq5";
        return Buffer.from(crypto.createHmac("sha256", key).update(signBase).digest())
            .toString("base64")
            .replace(/=+$/, "");
    }
}
exports.default = YMApi;
